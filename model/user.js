const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function encrypt(password) {
  return bcrypt.hashSync(password, 10);
}

function checkPassword(incomingPassword, databasePassword) {
  return bcrypt.compareSync(incomingPassword, databasePassword);
}

async function register({ email, password }) {
  const encryptedPassword = encrypt(password);
  console.log({ email, encryptedPassword });
  return await prisma.user.create({
    data: { email, password: encryptedPassword },
  });
}

async function login({ email, password }) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return Promise.reject("User not found!");

    const isPasswordValid = checkPassword(password, user.password);
    if (!isPasswordValid) return Promise.reject("Wrong password");

    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function findByPk(pk) {
  try {
    const user = await prisma.user.findUnique({ where: { id: pk } });
    console.log("findByPk.", { pk, user });
    return user;
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = { register, login, findByPk };

// class User {
//   static #encrypt = (password) => bcrypt.hashSync(password, 10);

//   static register = ({ email, password }) => {
//     const encryptedPassword = this.#encrypt(password);
//     return prisma.user.create({ data: { email, password: encryptedPassword } });
//   };
// }

// const user = new User();

// module.exports = user
