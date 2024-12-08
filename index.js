import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: 5432,
  database: process.env.DB_NAME,
  host: "localhost",
});

db.connect()
  .then(() => {
    console.log("Veritabanına baglandı");
  })
  .catch(() => {
    console.log("bir sorun olustu");
  });

function getFormattedDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0"); // Adds leading zero if day is less than 10
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so add 1
  const year = today.getFullYear();

  return `${day}-${month}-${year}`;
}

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", async (req, res) => {
  const sortBy = req.query.sort;
  let query = "SELECT * FROM books"; // Default query

  // Modify query based on sort criteria
  if (sortBy === "rating") {
    query += " ORDER BY rate DESC";
  } else if (sortBy === "receny") {
    query += " ORDER BY readt_date DESC";
  }
  try {
    const reponse = await db.query(query);
    const books = reponse.rows;
    res.render("index.ejs", { bookList: books });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
