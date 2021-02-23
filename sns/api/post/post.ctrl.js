const { Posts } = require("../../models/sql");
const postModel = require("../../models/mongo/post");
const mongoose = require("mongoose");
const { off } = require("../../models/mongo/post");

const list = (req, res, next) => {
  const limit = parseInt(req.query.limit || 10, 10);
  const offset = parseInt(req.query.offset || 10, 10);

  if (Number.isNaN(limit)) return res.status(400).send("limit must be number");
  if (Number.isNaN(offset))
    return res.status(400).send("offset must be number");

  postModel
    .find((err, result) => {
      if (err) next(err); // 직접 처리해도 됨

      // res.json(result);
      res.json(result);
    })
    .skip(offset)
    .limit(limit)
    .sort({ date: -1 });
};

const detail = (req, res, next) => {
  const _id = req.params._id;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send("_id is invalid");

  result = postModel.findById(_id, (err, result) => {
    if (err) next(err);

    if (!result) return res.status(404).send("NotFound");

    res.json(result);
  });
};

const create = (req, res, next) => {
  var post = null;
  const { title, content, img_url } = req.body;
  writer = {
    idx: req.decodedJWT.user.idx,
    name: req.decodedJWT.user.name,
  };

  // Document.save() 방식
  if (img_url) {
    post = new postModel({
      writer,
      title,
      img_url,
      content,
    });
  } else {
    post = new postModel({
      writer,
      title,
      content,
    });
  }
  post.save((mongoErr, result) => {
    if (mongoErr) return next(mongoErr);

    Posts.create({
      writer_idx: writer.idx,
      title,
      post_id: result._id.toString(),
    })
      .then((data) => res.status(201).json(result))
      .catch((sqlErr) => {
        postModel.findByIdAndDelete(result._id, (InnerMongoErr, result) => {
          if (InnerMongoErr) {
            console.error("zombie post created in mongo. _id : " + result._id);
            return res
              .status(500)
              .send("critical server error\n please contect manager ");
          }
        });

        return next(sqlErr);
      });
  });

  // PostModel.create() 방식
  // postModel.create({ post, data }, (err, result) => {
  //   if (err) return next(err);
  //   res.status(201).json(result);
  // });
};

const update = (req, res, next) => {
  const _id = req.params._id;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send("_id is invalid");

  const { content, title, img_url } = req.body;
  if (!content && !title) return res.status(400).send("nothing to change");

  post = postModel.findById(_id, (err, post) => {
    if (err) next(err);
    if (!post) return res.status(404).send("NotFound");

    if (content) post.content = content;
    if (title) post.title = title;
    if (img_url) post.img_url = img_url;
    else post.img_url = null;

    post
      .save()
      .then((post) => res.status(202).send(post))
      .catch((err) => next(err));
  });

  // postModel.findByIdAndUpdate(
  //   _id,
  //   { content, title },
  //   { new: true },
  //   (err, result) => {
  //     if (err) next(err);
  //     if (!result) return res.status(404).send();

  //     res.json(result);
  //   }
  // );
};

const remove = (req, res, next) => {
  const _id = req.params._id;

  postModel.findByIdAndDelete(_id, (err, result) => {
    if (err) next(err);
    if (!result) return res.status(404).send();

    res.send(result);
  });
};

const showListPage = (req, res, next) => {
  var limit = parseInt(req.query.limit || 12, 10);
  var offset = parseInt(req.query.offset || 0, 10);

  if (Number.isNaN(limit)) limit = 12;
  if (Number.isNaN(offset)) offset = 0;
  if (offset < 0) offset = 0;
  console.log(limit);

  postModel
    .find((err, result) => {
      if (err) next(err); // 직접 처리해도 됨

      // res.json(result);
      res.locals.offset = offset;
      res.locals.limit = limit;
      res.render("post/list", { result });
    })
    .skip(offset)
    .limit(limit)
    .sort({ date: -1 });
};

const showCreatePage = (req, res) => {
  res.render("post/create");
};

const showUpdatePage = (req, res) => {
  const _id = req.params._id;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send("_id is invalid");

  result = postModel.findById(_id, (err, result) => {
    if (err) next(err);

    if (!result) return res.status(404).send("NotFound");

    res.render("post/update", { result });
  });
};

const showDetailPage = (req, res, next) => {
  const _id = req.params._id;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send("_id is invalid");

  result = postModel.findById(_id, (err, result) => {
    if (err) next(err);

    if (!result) return res.status(404).send("NotFound");

    res.render("post/detail", { result });
  });
};

const like = (req, res, next) => {
  const _id = req.params._id;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send("_id is invalid");

  post = postModel.findById(_id, (err, post) => {
    if (err) next(err);
    if (!post) return res.status(404).send("NotFound");

    if (!post.liked_people_idxs.includes(req.decodedJWT.user.idx)) {
      post.liked_people_idxs.push(req.decodedJWT.user.idx);
      post
        .save()
        .then((post) => res.status(202).send())
        .catch((err) => next(err));
    }
    return res.status(202).send();
  });
};

const unlike = (req, res, next) => {
  const _id = req.params._id;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send("_id is invalid");

  post = postModel.findById(_id, (err, post) => {
    if (err) next(err);
    if (!post) return res.status(404).send("NotFound");

    post.liked_people_idxs = post.liked_people_idxs.filter(
      (e) => e !== req.decodedJWT.user.idx
    );
    post
      .save()
      .then((post) => res.status(202).send())
      .catch((err) => next(err));
  });
};

const addComment = (req, res, next) => {
  const _id = req.params._id;

  const { content, title } = req.body;
  if (!content && !title) return res.status(400).send("nothing to change");

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(400).send("_id is invalid");

  post = postModel.findById(_id, (err, post) => {
    if (err) next(err);
    if (!post) return res.status(404).send("NotFound");

    post.comments.push({
      title,
      content,
      writer: {
        idx: req.decodedJWT.user.idx,
        name: req.decodedJWT.user.name,
      },
    });

    post
      .save()
      .then((post) => res.status(202).send())
      .catch((err) => next(err));
  });
};

module.exports = {
  list,
  detail,
  create,
  update,
  remove,
  like,
  unlike,
  addComment,
  showListPage,
  showDetailPage,
  showCreatePage,
  showUpdatePage,
};
