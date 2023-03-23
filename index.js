const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const { PrismaClient } = require("@prisma/client");
const { register, login } = require("./model/user");
const prisma = new PrismaClient();
const passport = require("./lib/passport");
require("dotenv").config();

const app = express();

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
app.use(passport.initialize());
app.use(passport.session());

// Keempat, setting flash
app.use(flash());

// Kelima, setting view engine
app.set("view engine", "ejs");

function restrict(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Routing
app.get("/", restrict, async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("dashboard", { users });
});

app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
  await register({ email: req.body.email, password: req.body.password });
  res.redirect("/");
});

app.get("/login", (req, res) => res.render("login"));
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/whoami", restrict, (req, res) => {
  res.render("whoami", { username: req.user.email });
});

app.listen(PORT, () => {
  console.log(`Server sudah menyala ✅ di http://localhost:${PORT}`);
});
