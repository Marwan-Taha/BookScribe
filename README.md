# BookScribe 📚

BookScribe is a book tracking and notes app that allows users to discover books, save them to a personal library, and take notes on each book. Built with Node.js, Express, PostgreSQL, and integrated with the Google Books API, BookScribe makes managing a personal digital library seamless and engaging.

## Features

- **Book Discovery**: Search for books using the Google Books API.
- **Personal Library**: Add books to your personal library for quick access.
- **Note-Taking**: Take and save notes for each book in your library.
- **User Authentication**: Secure user registration and login (optional, if applicable).
- **User Dashboard**: View your saved books and notes from a personal dashboard.

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Frontend**: EJS for server-side templating
- **APIs**: Google Books API for book data
- **Deployment**: Vercel (for server) and Neon (for PostgreSQL hosting)

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Vercel CLI](https://vercel.com/cli) (for deployment)
- [Google Books API Key](https://developers.google.com/books/docs/v1/using)

### Clone the Repository

```bash
git clone https://github.com/Marwan-Taha/BookScribe.git
cd BookScribe
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL=your_database_url_here
GOOGLE_API_KEY=your_google_books_api_key_here
PORT=3000
```

### Initialize the Database

1. Connect to your PostgreSQL instance (using [pgAdmin](https://www.pgadmin.org/) or directly via CLI).
2. Create a new database (e.g., `BookScribe`).
3. Run the SQL schema commands to create tables:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(255) NOT NULL
   );

   CREATE TABLE books (
     id SERIAL PRIMARY KEY,
     google_id VARCHAR(255) UNIQUE NOT NULL,
     title VARCHAR(255)
   );

   CREATE TABLE user_books (
     user_id INT REFERENCES users(id),
     book_id INT REFERENCES books(id),
     PRIMARY KEY (user_id, book_id)
   );

   CREATE TABLE notes (
     id SERIAL PRIMARY KEY,
     user_id INT REFERENCES users(id),
     book_id INT REFERENCES books(id),
     content TEXT NOT NULL
   );
   ```

### Run the Application Locally

```bash
npm start
```

The app will be running at [http://localhost:3000](http://localhost:3000).

## Usage

1. Visit the homepage to search for books.
2. Add books to your personal library.
3. View details for each book and add notes.
4. Access your dashboard to view and manage your library and notes.


## Future Improvements

- Implement user authentication.
- Add categories and tagging for books.
- Enhance search and filtering capabilities.
- Implement a reminder system for reading goals.

## Contributing

Feel free to submit issues and pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Books API](https://developers.google.com/books)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

