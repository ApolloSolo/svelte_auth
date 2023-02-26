const bcrypt = require("bcrypt");
const { User } = require("../models");
const generateToken = require("../util/generateToken");

const getUsers = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  try {
    const cookie = req.cookies["token"];
    console.log(cookie);
    const users = await User.find({}).select("-__v -password");
    res.status(200).json(users);
  } catch (error) {
    res.json({
      error: error.message
    });
  }
};

const getUser = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  try {
    const { id } = req.params;
    const foundUser = await User.findById(id).select("-__v -password");
    if (!foundUser) {
      res.status(404);
      throw new Error("User Not Found");
    }
    res.status(200).json(foundUser);
  } catch (error) {
    res.json({
      error: error.message
    });
  }
};

const registerUser = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  try {
    const { username, email, password, confirmPass } = req.body;

    if (!username || !email || !password || !confirmPass) {
      res.status(400);
      const error = {
        success: false,
        error: true,
        message: "Please add all fields",
        data: req.body
      };
      throw new Error(error.message);
    }

    if (password !== confirmPass) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      const error = {
        success: false,
        error: true,
        message: "User already registered",
        data: req.body
      };
      throw new Error(error.message);
    }

    const newUser = await User.create(req.body);

    if (!newUser) {
      res.status(400);
      throw new Error("Invalid user data");
    }

    const token = await generateToken(newUser);

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(201).json({
      _id: newUser.id,
      username: newUser.username,
      password: newUser.password,
      token
    });
  } catch (error) {
    res.json({
      error: error.message
    });
  }
};

const login = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(404);
      throw new Error("Incorrect credentials");
    }

    const correctPassword = await foundUser.isCorrectPassword(password);

    if (!correctPassword) {
      res.status(400);
      throw new Error("Incorrect credentials");
    }

    const token = await generateToken(foundUser);

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(201).json({
      _id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      token
    });
  } catch (error) {
    res.json({
      error: error.message
    });
  }
};

const logout = async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  const token = req.cookies["token"];
  res.cookie("token", token, { httpOnly: true, maxAge: 0 });
  res.send({ success: true, error: false, message: "Logout Successful" });
};

module.exports = { getUsers, getUser, registerUser, login, logout };
