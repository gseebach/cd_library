import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 10000;

dotenv.config({ path: './.env' });

const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPort = process.env.DB_PORT;
const dbPassword = process.env.DB_PASSWORD;


/* const db = new pg.Client({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
}); */

const db = new pg.Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
  max: 10,
  ssl: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
const result = await db.query("SELECT track_no, track_name AS title, artist, cds.title AS cd_title FROM tracks JOIN cds ON cd_id = cds.id ORDER BY cd_id ASC, track_no ASC;");
  console.log(result.rows);
  res.render("index.ejs",{selection: result.rows}); 

});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});