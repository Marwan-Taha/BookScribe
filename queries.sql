CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(40) NOT NULL,
	last_name VARCHAR(40)
);


CREATE TABLE books (
    google_id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
);


CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id TEXT REFERENCES books(google_id),
    content TEXT
);


CREATE TABLE user_books (
    user_id INTEGER REFERENCES users(id),
    book_id TEXT REFERENCES books(google_id),
    UNIQUE (user_id, book_id)
);





