import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import path from "path";
import ejs from "ejs";
import dotenv from "dotenv";
dotenv.config();

const db = new pg.Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon due to self-signed certificates
  },
});
db.connect();

const app = express();

let currentUser = 1;

app.use(express.static(__dirname + "/../public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// app.engine("ejs", require("ejs").__express); // Add this line to set the templating engine
app.set("views", path.join(__dirname, "../views")); // Assuming 'views' is in same level as root folder
async function findBookByID(id) {
  const result = await axios.get(
    `https://www.googleapis.com/books/v1/volumes/${id}`,
    {
      params: {
        key: process.env.GOOGLE_API_KEY,
      },
    }
  );

  return result.data;
}

async function getNotes(user, book) {
  const notesQuery = await db.query(
    "SELECT content FROM notes WHERE user_id = $1 AND book_id = $2",
    [user, book]
  );

  return notesQuery.rows;
}

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard.ejs", { display: "home" });
});

app.get("/dashboard/books", async (req, res) => {
  res.render("dashboard.ejs", { books: [], display: "books" });
});

app.get("/dashboard/library", async (req, res) => {
 
  const booksIDs = await db.query(
    "SELECT book_id FROM user_books WHERE user_id = $1",
    [currentUser]
  );
  
  const bookIds = booksIDs.rows.map(row => row.book_id);  // Extract the book_id values
  
  const books = await Promise.all(bookIds.map(bookId => findBookByID(bookId)));
  res.render("dashboard.ejs", {
    display: "library",
    books: books
  });
});

app.get("/view/:id", async (req, res) => {
  const bookId = req.params.id;
  const book = await findBookByID(bookId);
  try {
    const bookExists = await db.query(
      "SELECT EXISTS(SELECT * FROM user_books WHERE(user_id, book_id)= ($1, $2))",
      [currentUser, bookId]
    );
    res.render("view.ejs", {
      book: book,
      bookExists: bookExists.rows[0].exists,
      notes: await getNotes(currentUser, bookId),
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/dashboard/books/find", async (req, res) => {
  const bookTitle = req.body.title;
  try {
    const result = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: {
          q: `${bookTitle}`,
          maxResults: 30,
          orderBy: "relevance",
          langRestrict: "en",
          key: "AIzaSyCz94nFBJR2EnLMFiHgiA9kakBHHZIoLuw",
        },
      }
    );
    const books = result.data.items;
    res.render("dashboard.ejs", { books: books, display: "books" });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add/:id", async (req, res) => {
  const bookId = req.params.id;
  const title = req.body.bookTitle;
  const book = await findBookByID(bookId);
  try {
    await db.query("INSERT INTO books(google_id, title) VALUES($1,$2)", [
      bookId,
      title,
    ]);

    await db.query("INSERT INTO user_books(user_id, book_id) VALUES ($1, $2)", [
      currentUser,
      bookId,
    ]);
    res.render("view.ejs", {
      book: book,
      bookExists: true,
      notes: await getNotes(currentUser, bookId),
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/addNote/:id", async (req, res) => {
  const bookId = req.params.id;
  const note = req.body.note;
  const book = await findBookByID(bookId);
  try {
    await db.query(
      "INSERT INTO notes(user_id, book_id, content) VALUES($1, $2, $3)",
      [currentUser, bookId, note]
    );
    console.log("note inserted");

    const notes = await getNotes(currentUser, bookId);

    res.render("view.ejs", { book: book, notes: notes, bookExists: true });
  } catch (error) {
    console.log(error);
  }
});

app.listen((3000))

export default app;
