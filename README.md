# 🎤 ZaśpiewajMy - Music & Lyrics Platform

 A full-stack web application designed for music enthusiasts to discover lyrics, and engage with a community of music lovers.

## 📖 Overview

**ZaśpiewajMy** ("Let's Sing") is a dynamic web platform that aggregates song lyrics and matches them with corresponding YouTube music videos. The application solves the problem of switching between tabs (lyrics vs. video) by unifying them into a single, immersive interface. It features a search engine, genre categorization, and a community-driven database where users can add songs and post comments.

## 🚀 Key Features

*   **Smart Search Engine:** Allows users to find songs by title or artist instantly.
*   **YouTube Integration:** Automatically embeds the best matching music video for every song.
*   **Trending System:** Algorithmic "Top 10" list based on real-time view counts.
*   **Community Interaction:** Users can contribute by adding new songs and commenting on existing ones.
*   **Genre Filtering:** Categorized browsing (Rock, Pop, Rap, etc.) for easier discovery.
*   **Responsive Design:** Fully optimized for desktop and mobile devices.

## 🛠️ Tech Stack & Rationale

I chose a robust, scalable stack to ensure performance and ease of deployment.

### Backend
*   **Node.js & Express.js:** Chosen for its non-blocking I/O model, which efficiently handles multiple concurrent requests (search, database reads). It allows for rapid development of RESTful routes.
*   **MySQL:** Selected as the database engine to maintain structured relationships between **Songs** and **Comments**. ACID compliance ensures data integrity for user contributions.

### Frontend
*   **EJS (Embedded JavaScript):** Used for Server-Side Rendering (SSR). This ensures faster initial page loads and better SEO compared to client-side rendering for this type of content-heavy application.
*   **Bootstrap 5:** Implemented to ensure a responsive, mobile-first UI without the overhead of writing custom CSS grid systems.

### DevOps & Tools
*   **Docker & Docker Compose:** The entire application (App + Database) is containerized. This ensures the environment is consistent across development and production.

## 🔧 Getting Started

The project is fully containerized, making it extremely easy to run locally.

### Prerequisites
*   Docker & Docker Compose installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/pnykiel3/ZaspiewajMy.git
    cd zaspiewajmy
    ```

2.  **Run with Docker:**
    ```bash
    docker-compose up
    ```

3.  **Access the App:**
    Open your browser and visit: `http://localhost:3000`

*Note: The database will be automatically initialized with the schema and sample data upon the first launch.*

---
© 2025 Paweł Nykiel