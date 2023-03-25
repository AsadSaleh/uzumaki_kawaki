const { login, register, findByPk } = require("../model/user");
const jwt = require("jsonwebtoken");

async function loginController(req, res) {
  try {
    const user = await login(req.body);
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Simpan token di cookie:
    req.session.token = token;

    res.redirect("/");
  } catch (error) {
    res.redirect("/login");
  }
}

async function registerController(req, res) {
  try {
    await register({ email: req.body.email, password: req.body.password });
    res.redirect("/login");
  } catch (error) {
    res.redirect("/register");
  }
}

async function logoutController(req, res) {
  req.session.destroy();
  res.redirect("/login");
}

async function whoamiController(req, res) {
  try {
    const userId = req.userId;
    const user = await findByPk(userId);
    res.render("whoami", { username: user.email });
  } catch (error) {
    console.log(error);
    res.render("error");
  }
}

module.exports = {
  loginController,
  registerController,
  logoutController,
  whoamiController,
};
