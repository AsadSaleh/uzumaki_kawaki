const express = require("express");
const session = require("express-session");
const flash = require("express-flash");

require("dotenv").config();

const app = express();

// const PORT = process.env.PORT;
// const SECRET_KEY = process.env.SECRET_KEY;
// const DATABASE_URL = process.env.DATABASE_URL;

const { PORT } = process.env;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Atur session:
app.use(
  session({
    secret: "Buat ini jadi rahasia",
    resave: false,
    saveUninitialized: false,
  })
);

// Ketiga, setting passport
// (sebelum router dan view engine)
// const passport = require("./lib/passport"); // => NANTI HARUS KITA BUAT!!!
// app.use(passport.initialize());
// app.use(passport.session());

// Keempat, setting flash
app.use(flash());

// Kelima, setting view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => res.send("Hello world! Server sudah menyala"));

app.listen(PORT, () => {
  console.log(`Server sudah menyala ✅ di http://localhost:${PORT}`);
});
