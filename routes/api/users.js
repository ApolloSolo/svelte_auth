const router = require("express").Router();
const {
  getUsers,
  registerUser,
  login,
  logout,
  getUser
} = require("../../controllers/users");
const protected = require("../../middleware/auth")

/* GET users listing. */
router.get("/", protected, getUsers);
router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);
router.get("/:id", getUser);

module.exports = router;
