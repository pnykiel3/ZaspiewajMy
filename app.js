const express = require('express');
const path = require('path');
const db = require('./database');
const { toUnicode } = require('punycode');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); // Do obsługi formularzy

app.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM songs ORDER BY views DESC LIMIT 10');
        
        res.render('index', { trends: rows });
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Błąd pobierania trendów");
    }
});

app.get('/search', async (req, res) => {
    const query = req.query.q ? req.query.q.trim() : null;
    const category = req.query.cat ? req.query.cat.trim() : null;

        try {
            let sql = "";
            let params = [];
            let searchTitle = "";

            if (category) {
                const categoryNames = {
                    // Rock, Metal i Alternatywa
                    'rock': 'Rock',
                    'rocknroll': "Rock'n'Roll",
                    'hardrock': 'Hard Rock',
                    'progrock': 'Rock Progresywny',
                    'softrock': 'Soft Rock',
                    'glamrock': 'Glam Rock',
                    'metal': 'Heavy Metal',
                    'trashmetal': 'Thrash Metal',
                    'symphonic': 'Symphonic Metal',
                    'numetal': 'Nu Metal',
                    'punk': 'Punk Rock',
                    'grunge': 'Grunge',
                    'indie': 'Indie Rock',
                    'britpop': 'Britpop',
                    'alternative': 'Rock Alternatywny',
                    'rock_ballads': 'Rockowe Ballady',

                    // Pop, Disco i dekady
                    'pop': 'Pop',
                    'dance': 'Dance / Club',
                    'disco': 'Disco',
                    'italodisco': 'Italo Disco',
                    'eurodance': 'Eurodance',
                    'boyband': 'Boybands & Girlbands',
                    'kpop': 'K-Pop',
                    'lata60': 'Hity lat 60.',
                    'lata70': 'Hity lat 70.',
                    'lata80': 'Hity lat 80.',
                    'lata90': 'Hity lat 90.',
                    'lata2000': 'Lata 2000–2010',
                    'lata2010': 'Lata 2010+',
                    'lata2020': 'Lata 2020+',

                    // Hip-Hop, Rap, R&B
                    'rap': 'Rap',
                    'hiphop': 'Hip-Hop',
                    'oldschool': 'Old School Rap',
                    'gangsta': 'Gangsta Rap',
                    'trap': 'Trap',
                    'rnb': 'R&B',
                    'soul': 'Soul',
                    'funk': 'Funk',
                    'gospel': 'Gospel',
                    'reggaeton': 'Reggaeton',

                    // Polska strefa
                    'polskipop': 'Polski Pop',
                    'polskirock': 'Polski Rock',
                    'polskirap': 'Polski Hip-Hop',
                    'discopolo': 'Disco Polo',
                    'biesiadna': 'Piosenka Biesiadna',
                    'bigbeat': 'Big Beat',
                    'poezja': 'Poezja Śpiewana',
                    'szanty': 'Szanty',
                    'patriotyczne': 'Pieśni Patriotyczne',

                    // Latino, Country, Folk
                    'latinopop': 'Latino Pop',
                    'salsa': 'Salsa / Bachata',
                    'samba': 'Samba',
                    'country': 'Country',
                    'countrypop': 'Country Pop',
                    'folk': 'Folk / Etno',
                    'goralskie': 'Muzyka Góralska',
                    'cyganskie': 'Muzyka Cygańska',

                    // Elektronika
                    'house': 'House',
                    'techno': 'Techno',
                    'trance': 'Trance',
                    'edm': 'EDM',
                    'dubstep': 'Dubstep / Drum & Bass',
                    'synthwave': 'Synthwave',
                    'lofi': 'Lo-Fi / Chillout',
                    'ambient': 'Ambient',

                    // Okazjonalne
                    'dladzieci': 'Dla Dzieci',
                    'disney': 'Bajki Disney / Pixar',
                    'weselne': 'Hity Weselne',
                    'urodzinowe': 'Urodzinowe',
                    'swiateczne': 'Świąteczne / Kolędy',
                    'milosne': 'Miłosne',
                    'imprezowe': 'Imprezowe',

                    // Inne
                    'jazz': 'Jazz',
                    'blues': 'Blues',
                    'reggae': 'Reggae / Ska',
                    'klasyczna': 'Muzyka Klasyczna',
                    'filmowa': 'Muzyka Filmowa',
                    'musical': 'Musical / Broadway',
                    'duety': 'Słynne Duety',
                    'inne': 'Inne'
                };
                sql = `SELECT * FROM songs WHERE category LIKE ? ORDER BY views DESC`;
                params = [`%${category}%`];
                const gatunek = categoryNames[category] || category;
                searchTitle = `Gatunek: ${gatunek}`;
            } else if (query) {
                sql = `SELECT * FROM songs WHERE title LIKE ? OR artist LIKE ? ORDER BY views DESC`;
                const searching = `%${query}%`;
                params = [searching, searching];
                searchTitle = query
            } else {
            return res.render('search-results', { songs: [], searchQuery: "" });
            }

            const [results] = await db.execute(sql, params);
            res.render('search-results', {
                songs: results,
                searchQuery: searchTitle
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Błąd podczas wyszukiwania");
        }
});

app.get('/song/:id', async (req, res) => {
    const songId = req.params.id;
    const messageType = req.query.message;

    try {
        const [songs] = await db.execute('SELECT * FROM songs WHERE id = ?', [songId]);
        const song = songs[0];
        if (song.youtube_url && song.youtube_url.includes('watch?v=')) {
            song.youtube_url = song.youtube_url.replace('watch?v=', 'embed/');
        }

        if (!song) {
            return res.status(404).send('Piosenka nie znaleziona');
        }
        
        const [comments] = await db.execute('SELECT * FROM comments WHERE song_id = ? ORDER BY created_at DESC', [songId]);
        await db.execute('UPDATE songs SET views = views + 1 WHERE id = ?', [songId]);

        res.render('song', { 
            song: song,
            comments: comments,
            msg: messageType
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Błąd serwera');
    }
});

app.get('/add-song', (req, res) => {
    res.render('add-song');
});

app.post('/add-comment', async (req, res) => {
    const songId = req.body.song_id;
    const userName = req.body.nick;
    const commentText = req.body.comment;

    if (!songId || !userName || !commentText) {
        return res.status(400).send("Błąd: Brakuje danych formularza (sprawdź czy dodałeś hidden input w song.ejs)");
    }
    
    try {
        const sql = `
            INSERT INTO comments (song_id, user_name, comment)
            VALUES (?, ?, ?)
        `;
        await db.execute(sql, [songId, userName, commentText]);
        res.redirect('/song/' + songId);
    } catch (error) {
        console.error(error);
        res.status(500).send("Błąd podczas dodawania komentarza");
    }
});

app.post('/add-song', async (req, res) => {

    const title =   req.body.title.trim();
    const artist =  req.body.artist.trim();
    const category =req.body.category.trim();
    const lyrics =  req.body.lyrics.trim();
    const youtube_url = req.body.youtube_url.trim();
    const added_by = req.body.added_by.trim();

    let finalUrl = youtube_url;
    if (finalUrl.includes('watch?v=')) {
        finalUrl = finalUrl.replace('watch?v=', 'embed/');
    } else if (finalUrl.includes('youtu.be/')) {
        finalUrl = finalUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    } if (finalUrl.includes('&')) {
            finalUrl = finalUrl.split('&')[0];
        }

    try {

        const checkSQL = 'SELECT * FROM songs WHERE title = ? AND artist = ?';
        const [existing] = await db.execute(checkSQL, [title, artist]);
        
        if (existing.length > 0) {
            return res.redirect('/song/' + existing[0].id + '?message=duplicate');
        }

        const sql = `
            INSERT INTO songs (title, artist, category, lyrics, youtube_url, nick, views)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        `;
        const [result] = await db.execute(sql, [title, artist, category, lyrics, finalUrl, added_by]);

        console.log("Dodano piosenkę o ID:", result.insertId);

        res.redirect('/song/' + result.insertId + '?message=success');
    } catch (error) {
        console.error("Błąd dodawania piosenki:", error);
        res.status(500).send("Wystąpił błąd podczas zapisywania.");
    }
});

app.listen(port, () => {
    console.log(`Serwer działa! Wejdź na stronę: http://localhost:${port}`);
});