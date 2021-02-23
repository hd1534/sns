const { Permissions } = require("../../models/sql");
const { Op } = require("sequelize");

const createIfNotExist = (req, res, next) => {
  Permissions.findOne({
    where: {
      user_idx: req.body.user_idx,
      section: req.body.section,
    },
  })
    .then((result) => {
      if (result) return res.status(409).send("already have permission");

      Permissions.create(req.body, { returning: true })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const findAll = (req, res, next) => {
  const offset = parseInt(req.query.offset || 0, 10); // TODO: 이거 안전한지 확인하기
  const limit = parseInt(req.query.limit || 10, 10);
  if (Number.isNaN(limit) || Number.isNaN(offset)) return res.status(400).end();

  Permissions.findAll({
    attributes: ["user_idx", "section", "level"],
    offset: offset,
    limit: limit,
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

const findByIdx = (req, res, next) => {
  const idx = req.params.idx;

  Permissions.findOne({
    attributes: ["user_idx", "section", "level"],
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

const findAllByUserIdx = (req, res, next) => {
  const offset = parseInt(req.query.offset || 0, 10);
  const limit = parseInt(req.query.limit || 10, 10);
  if (Number.isNaN(limit) || Number.isNaN(offset)) return res.status(400).end();

  Permissions.findAll({
    attributes: ["section", "level"],
    where: {
      user_idx: user_idx,
    },
    offset: offset,
    limit: limit,
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
  Permissions.update(req.body, {
    where: { idx: idx },
    fields: ["level"], // fields to update
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

const deleteByIdx = (req, res, next) => {
  const idx = req.params.idx;

  Permissions.destroy({
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

// usage : router.use("/admin", tokenCheck, permissionChecker("admin", 10), call_back_fuc);
const permissionChecker = (section, level) => {
  return (req, res, next) => {
    if (!req.decodedJWT)
      throw "no decoded JWT. you have to check whether using tokenChecker";

    Permissions.findOne({
      attributes: ["level"],
      where: {
        user_idx: req.decodedJWT.user.idx,
        section: section,
        level: {
          [Op.gte]: level, //Greater Than or Equal To
        },
      },
    })
      .then((result) => {
        if (!result) return res.status(403).send("Permission denied");
        if (result.levle < level)
          return res.status(403).send("Permission denied");
        return next();
      })
      .catch((err) => next(err));
  };
};

module.exports = {
  createIfNotExist,
  findAll,
  findByIdx,
  findAllByUserIdx,
  updateByIdx,
  deleteByIdx,
  permissionChecker,
};
