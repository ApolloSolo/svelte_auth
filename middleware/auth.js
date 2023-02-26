const jwt = require("jsonwebtoken");
const { User } = require("../models");

const protected = async (req, res, next) => {
  try {
    const cookie = req.cookies["token"];
    console.log(cookie)
    if (cookie) {
      // Verify token
      const decoded = jwt.verify(cookie, process.env.JWT_SECRET);

      if(!decoded) {
        throw new Error("Not Auth User");
      }

      // Get user from token
      req.user = await User.findById(decoded.data._id).select("-password");

      next();
    } else {
      throw new Error("Not Auth User");
    }
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = protected;
