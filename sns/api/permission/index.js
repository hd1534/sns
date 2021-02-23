var express = require("express");
var router = express.Router();
const ctrl = require("./permission.ctrl");

// router.get("/", ctrl.findAll);
router.post("/", ctrl.createIfNotExist);
router.get("/idx/:idx", ctrl.findByIdx);
router.put("/idx/:idx", ctrl.updateByIdx);
router.delete("/idx/:idx", ctrl.deleteByIdx);

module.exports = router;
