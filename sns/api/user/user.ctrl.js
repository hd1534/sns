const { Users } = require("../../models/sql");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const emailChecker = require("../../functions").emailChecker;
const passwordChecker = require("../../functions").passwordChecker;

const showSignUpPage = (req, res) => {
  res.render("user/signup");
};

const showLoginPage = (req, res) => {
  res.render("user/login");
};

const showProfilePage = (req, res, next) => {
  Users.findOne({
    where: {
      idx: req.decodedJWT.user.idx,
    },
  })
    .then((result) => {
      if (!result) {
        res.status(404).send("NotFound");
      } else {
        res.render("user/profile", { result });
      }
    })
    .catch((err) => next(err));
};

const showUpdatePage = (req, res, next) => {
  res.render("user/update");
};

const create = (req, res, next) => {
  var { name, id, password, email, gender, user_type } = req.body;
  // start checking data
  if (!name) return res.status(400).send("enter your name");
  if (!id) return res.status(400).send("enter your id");
  if (!password) return res.status(400).send("enter your password");
  if (!passwordChecker(password))
    return res.status(400).send("check your password");
  if (password == name)
    return res.status(400).send("your password is same as your name");
  if (password == id)
    return res.status(400).send("your password is same as your id");
  if (password == email)
    return res.status(400).send("your password is same as your email");
  if (!email) return res.status(400).send("enter your email");
  if (!emailChecker(email)) return res.status(400).send("check your email");
  user_type = user_type ? user_type : "O";
  gender = gender ? gender : "O";
  // end checking

  Users.findOne({ where: { email: email } })
    .then((user) => {
      if (user) return res.status(409).send("this email already used");

      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) return res.status(500).send("server error");

        Users.create({ name, id, password: hash, email, gender, user_type })
          .then((user) => res.send(user))
          .catch((err) => next(err));
      });
    })
    .catch((err) => next(err));
};

const findByIdx = (req, res, next) => {
  const idx = req.params.idx;

  Users.findOne({
    attributes: ["idx", "name"],
    where: {
      idx: idx,
    },
  })
    .then((result) => {
      if (!result) {
        res.status(404).send("NotFound");
      } else {
        res.send(result);
      }
    })
    .catch((err) => next(err));
};

const updateByIdx = (req, res, next) => {
  const idx = req.params.idx;
  Users.update(req.body, {
    where: { idx: idx },
    fields: ["name", "email"], // fields to update
  })
    .then((result) => {
      if (!result) {
        res.status(404).send("NotFound");
      } else {
        res.send(result);
      }
    })
    .catch((err) => next(err));
};

const findByIdxAndDelete = (req, res, next) => {
  const idx = req.params.idx;

  Users.destroy({
    where: {
      idx: idx,
    },
  })
    .then((result) => {
      if (!result) {
        res.status(404).send("NotFound");
      } else {
        res.status(200).send("deleted");
      }
    })
    .catch((err) => next(err));
};

module.exports = {
  showLoginPage,
  showSignUpPage,
  showProfilePage,
  showUpdatePage,
  create,
  updateByIdx,
  findByIdx,
  findByIdxAndDelete,
};
