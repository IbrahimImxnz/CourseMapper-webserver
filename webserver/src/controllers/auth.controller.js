import { sign } from "jsonwebtoken";
import { compareSync, hashSync } from "bcryptjs";

const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

/**
 * @function signup
 * User registration controller
 *
 * @param {string} req.body.firstname The username
 * @param {string} req.body.lastname The username
 * @param {string} req.body.username The username
 * @param {string} req.body.email The email
 * @param {string} req.body.password The new password
 * @param {Array} req.body.role The roles e.g., ['user']
 */
export const signup = async (req, res) => {
  let user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    password: hashSync(req.body.password, 8),
  });

  try {
    await user.save();
  } catch (err) {
    return res.status(500).send({ error: err });
  }

  if (req.body.roles) {
    try {
      let roles = await Role.find({ name: { $in: req.body.roles } });
      user.roles = roles.map((role) => role._id);
    } catch (err) {
      return res.status(500).send({ error: err });
    }

    try {
      await user.save();
      res.status(200).send({ success: "User is successfully registered!" });
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  } else {
    try {
      let role = await Role.findOne({ name: "user" });
      user.roles = [role._id];
    } catch (err) {
      return res.status(500).send({ error: err });
    }

    try {
      await user.save();
      return res
        .status(200)
        .send({ success: "User is successfully registered!" });
    } catch (err) {
      return res.status(500).send({ error: err });
    }
  }
};

/**
 * @function signin
 * User login controller
 *
 * @param {string} req.body.username The username
 * @param {string} req.body.password The new password
 */
export const signin = async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  try {
    let user = await User.findOne({ username: username }).populate(
      "roles",
      "-__v"
    );
    if (!user) {
      return res.status(404).send({ error: "User not found." });
    }

    let passwordIsValid = await compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ error: "Invalid Password!" });
    }

    let token = sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }

    req.session.token = token;

    const userName = `${user.firstname} ${user.lastname}`;

    return res.status(200).send({
      id: user._id,
      name: userName,
      username: user.username,
      email: user.email,
      roles: authorities,
    });
  } catch (err) {
    return res.status(500).send({ error: err });
  }
};

/**
 * @function signout
 * User logout controller
 *
 */
export const signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ success: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
