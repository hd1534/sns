const { Users, RevokedTokens } = require("../../models/sql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const privateKey = fs.readFileSync(path.resolve(__dirname, "../../rs256.pem"));
const publicKey = fs.readFileSync(path.resolve(__dirname, "../../rs256.pub"));

const getToken = (req, res, next) => {
  const { id, password } = req.body;

  if (!id) return res.status(400).send("enter your id");
  if (!password) return res.status(400).send("enter your password");
  if (!require("../../functions").passwordChecker(password))
    return res.status(400).send("check your password");

  Users.findOne({ where: { id: id } })
    .then((user) => {
      if (!user) return res.status(404).send("user not found");

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).send("server error");
        if (!isMatch) return res.status(403).send("password is incorrect");

        delete user.dataValues["password"];
        const token = jwt.sign(
          // 만료 시간 : 30분
          { user, exp: Math.floor(Date.now() / 1000) + 60 * 30 },
          privateKey,
          { algorithm: "RS256" }
        );
        // res.cookie("token", token, { httpOnly: true });
        // res.json(result);
        res.cookie("user", JSON.stringify(user), { httpOnly: true });
        return res.status(200).send(user);
      });
    })
    .catch((err) => next(err));
};

const tokenCheck = (req, res, next) => {
  const token = req.token;

  if (!token) return res.status(403).send("Missing Authorization Header");

  // algorithm 체크
  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) return next(err);

    RevokedTokens.findOne({ where: { jwt: token } })
      .then((result) => {
        if (result) return res.status(403).send("revoked token");
        req.decodedJWT = decoded;
        return next();
      })
      .catch((err) => next(err));
  });
};

const tokenInfo = (req, res, next) => {
  const token = req.token;

  if (!token) return res.status(403).send("Missing Authorization Header");

  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) return next(err);

    return res.status(200).send(decoded);
  });
};

const revokeToken = (req, res, next) => {
  const token = req.token;

  if (!token) return res.status(403).send("Missing Authorization Header");

  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) return next(err);

    RevokedTokens.create({ jwt: token })
      .then((RevokedToken) => res.send(RevokedToken))
      .catch((err) => next(err));
  });
};

const logIn = (req, res) => {
  const { id, password } = req.body;

  if (!id) return res.status(400).send("id를 입력해주세요");
  if (!password) return res.status(400).send("비밀번호를 입력해주세요");
  if (!require("../../functions").passwordChecker(password, id))
    return res.status(400).send("비밀번호가 형식에 맞지 않습니다.");

  Users.findOne({ where: { id: id } })
    .then((user) => {
      if (!user) return res.status(404).send("없는 계정 입니다.");

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).send("로그인중 서버에러");
        if (!isMatch) return res.status(403).send("비밀번호가 틀립니다.");

        const token = jwt.sign(
          // 만료 시간 : 30분
          { user, exp: Math.floor(Date.now() / 1000) + 60 * 30 },
          privateKey,
          { algorithm: "RS256" }
        );
        res.cookie("token", token, { httpOnly: true });
        res.json(token);
      });
    })
    .catch((err) => next(err));
};
const logOut = (req, res) => {
  const token = req.cookies.token;

  jwt.verify(token, publicKey, (err, decoded) => {
    if (err) return res.status(500).send("로그아웃 시 오류가 발생했습니다.");

    RevokedTokens.create({ jwt: token })
      .then((RevokedToken) => {
        res.clearCookie("token");
        res.redirect("/");
      })
      .catch((err) => res.status(500).send("로그아웃 시 오류가 발생했습니다."));
  });
};

const checkAuth = (req, res, next) => {
  // 모든 화면에서 공통으로 사용되는 값
  res.locals.user = null;

  const token = req.cookies.token;

  if (!token) {
    if (
      req.url === "/" ||
      req.url === "/user" ||
      req.url === "/user/signup" ||
      req.url === "/user/login"
    )
      return next();
    console.log("not allowed : " + req.url);
    return res.redirect("/user/login");
  }

  jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, user) => {
    if (err) {
      res.clearCookie("token");
      return res.redirect("user/login");
    }
    req.decodedJWT = user;
    res.locals.user = user.user;
    next();
  });
};

module.exports = {
  logIn,
  logOut,
  checkAuth,
  getToken,
  tokenCheck,
  tokenInfo,
  revokeToken,
};
