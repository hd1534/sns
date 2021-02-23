const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger")();
const router = express.Router();

const { tokenCheck } = require("./token/token.ctrl");
const { permissionChecker } = require("./permission/permission.ctrl");

router.use("/token", require("./token"));
router.use("/user", require("./user"));
router.use("/permission", require("./permission"));
router.use("/post", require("./post"));
router.use("/admin", permissionChecker("admin", 10), (req, res) => {
  res.send("hi admin!"); // tmp
});

// swagger
router.use(
  "/docs",
  function (req, res, next) {
    swaggerDocument.host = req.get("host");
    req.swaggerDoc = swaggerDocument;
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup()
);
router.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

router.get("/", (req, res) => {
  console.log(res.locals);
  return res.render("index");
});

module.exports = router;
