const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const { PrismaClient } = require("@prisma/client");
const { register, login, generateToken, verifyToken } = require("./model/user");
const prisma = new PrismaClient();
const passport = require("./lib/passport");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

const { PORT } = process.env;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

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

function restrictLocalStrategy(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Fungsi untuk menendang user ke halaman utama, kalau dia udah authenticated.
function pushToMainIfAuthed(req, res, next) {
  const cookie = req.cookies.chap7;
  console.log({ cookie });
  if (cookie === undefined) {
    return next();
  }

  const isTokenVerified = verifyToken(cookie);
  if (!isTokenVerified) {
    return next();
  }

  res.redirect("/");
}

// Fungsi untuk menendang user ke halaman login, kalau dia belum authenticated.
function restrictByCheckCookie(req, res, next) {
  const cookie = req.cookies.chap7;
  if (cookie === undefined) {
    res.redirect("/login");
    return;
  }
  const isTokenVerified = verifyToken(cookie);
  if (!isTokenVerified) {
    res.redirect("/login");
    return;
  }
  next();
}

// Routing
app.get("/", restrictByCheckCookie, async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("dashboard", { users });
});

app.get("/register", (req, res) => res.render("register"));
app.post("/register", async (req, res) => {
  await register({ email: req.body.email, password: req.body.password });
  res.redirect("/");
});

app.get("/login", pushToMainIfAuthed, (req, res) => res.render("login"));
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.post("/login-jwt", async (req, res) => {
  try {
    const user = await login(req.body);
    const token = generateToken(user);
    res.cookie("chap7", token, { maxAge: 900000, httpOnly: true });
    res.redirect("/");
  } catch (error) {
    res.redirect("/login");
  }
});

app.get("/whoami", restrictLocalStrategy, (req, res) => {
  res.render("whoami", { username: req.user.email });
});

app.listen(PORT, () => {
  console.log(`Server sudah menyala ✅ di http://localhost:${PORT}`);
});
