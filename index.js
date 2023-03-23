const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const { PrismaClient } = require("@prisma/client");
const { register, login } = require("./model/user");
const prisma = new PrismaClient();
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

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("dashboard", { users });
});
app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
  await register({ email: req.body.email, password: req.body.password });
  res.redirect("/");
});

app.get("/login", (req, res) => res.render("login"));
app.post("/login", async (req, res) => {
  try {
    await login({ email: req.body.email, password: req.body.password });
    res.redirect("/");
  } catch (error) {
    console.log({ error });
    res.redirect("/login");
  }
});

app.listen(PORT, () => {
  console.log(`Server sudah menyala ✅ di http://localhost:${PORT}`);
});
