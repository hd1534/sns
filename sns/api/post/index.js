var express = require("express");
var router = express.Router();
const ctrl = require("./post.ctrl");

router.get("/list", ctrl.showListPage); // 목록 조회
router.get("/new", ctrl.showCreatePage); //  등록 페이지 보여주기
router.get("/_id/:_id/edit", ctrl.showUpdatePage); // 수정 페이지 보여주기
router.get("/_id/:_id/detail", ctrl.showDetailPage); // 수정 페이지 보여주기
router.get("/_id/:_id/like", ctrl.like); // 좋아요
router.get("/_id/:_id/unlike", ctrl.unlike); // 좋아요 취소
router.post("/_id/:_id/comment", ctrl.addComment); // 좋아요

router.get("/", ctrl.list); // 목록 조회
router.get("/_id/:_id", ctrl.detail); // 상세 조회
router.post("/", ctrl.create); // 등록
router.put("/_id/:_id", ctrl.update); // 수정
router.delete("/_id/:_id", ctrl.remove); // 삭제

module.exports = router;
