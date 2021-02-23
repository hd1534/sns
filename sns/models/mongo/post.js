const xss = require("xss");
const mongoose = require("mongoose");

bgresource = [
  "https://s2.best-wallpaper.net/wallpaper/1680x1050/1603/Beautiful-universe-stars-galaxies_1680x1050.jpg",
  "https://c.wallhere.com/photos/e6/78/artwork_space_art-177315.jpg!d",
  "https://image.fmkorea.com/files/attach/new/20190317/486616/291138520/1674527678/3bb303c76f55866af2dfdc95aa040105.jpg",
  "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260",
  "https://images.pexels.com/photos/1628110/nature-milky-way-galaxy-cosmos-1628110.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
];
background = () => bgresource[Math.floor(Math.random() * bgresource.length)];

const CommentSchema = new mongoose.Schema();
CommentSchema.add({
  title: {
    type: String,
    required: true,
    set: xss,
  },
  content: {
    type: String,
    required: true,
    set: xss,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  writer: {
    idx: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  subComments: [CommentSchema],
});

const PostSchema = new mongoose.Schema({
  // tags: {type:[{name: String, idx: Number}],required:true},  // will be added
  writer: {
    type: {
      idx: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    required: [true, "writer is empty"],
  },
  title: {
    type: String,
    required: [true, "title is empty"],
    set: xss,
  },
  content: {
    type: String,
    required: [true, "content is empty"],
    set: xss,
  },
  img_url: {
    type: String,
    default: background,
    set: xss,
  },
  status: {
    type: String,
    enum: ["normal", "censored"],
    setDefaultsOnInsert: "normal",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  comments: [CommentSchema],
  meta: {
    likes: {
      type: Number,
      default: 0,
    },
  },
  liked_people_idxs: {
    type: [Number],
    set: function (v, schematype) {
      if (
        this instanceof mongoose.Document &&
        this.liked_people_idxs &&
        v != null
      ) {
        // 이렇게 했더니 삭제일때도 실행된다!
        this.meta.likes = this.liked_people_idxs.length + v.length;
      }
      return v;
    },
  },
});
PostSchema.virtual("likes").get(function () {
  return this.liked_people_idxs.length;
});

const Post = mongoose.model("post", PostSchema);

module.exports = Post;
