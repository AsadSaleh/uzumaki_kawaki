const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  loginController,
  registerController,
  logoutController,
  whoamiController,
} = require("./controller/authController");
const morgan = require("morgan");
const { restrictPageAccess } = require("./middleware/restrictPageAccess");
const { restrictLoginPage } = require("./middleware/restrictLoginPage");
const {
  createRoomController,
  joinRoomController,
  getAllRoomsController,
  getRoomByIdController,
  playGameController,
} = require("./controller/roomController");

require("dotenv").config();

const app = express();

const { PORT } = process.env;

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "Buat ini jadi rahasia",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.set("view engine", "ejs");

// Routing
app.get("/", restrictPageAccess, async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("dashboard", { users });
});
app.get("/login", restrictLoginPage, (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.post("/api/login", loginController);
app.post("/register", registerController);
app.post("/logout", logoutController);
app.get("/whoami", restrictPageAccess, whoamiController);

app.get("/api/room", getAllRoomsController);
app.get("/api/room/:roomId", getRoomByIdController);
app.post("/api/room/create", createRoomController);
app.post("/api/room/:roomId/join", joinRoomController);
app.post("/api/room/:roomId/play", playGameController);

app.listen(PORT, () => {
  console.log(`Server sudah menyala ✅ di http://localhost:${PORT}`);
});
