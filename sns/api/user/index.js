var express = require("express");
var router = express.Router();
const ctrl = require("./user.ctrl");
const { tokenCheck, logOut, logIn } = require("../token/token.ctrl");

// router.get("/", ctrl.findAll);
router.get("/signup", ctrl.showSignUpPage); // 회원가입 페이지
router.get("/login", ctrl.showLoginPage); // 로그인 페이지
router.get("/profile", ctrl.showProfilePage);
router.get("/idx/:idx/edit", ctrl.showUpdatePage);
router.get("/logout", logOut);
router.post("/signup", ctrl.create); // 회원가입
router.post("/login", logIn); // 로그인

router.post("/", ctrl.create);
router.get("/idx/:idx", tokenCheck, ctrl.findByIdx);
router.put("/idx/:idx", ctrl.updateByIdx);
router.delete("/idx/:idx", tokenCheck, ctrl.findByIdxAndDelete);

module.exports = router;
