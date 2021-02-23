/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PostNotTags",
    {
      idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      post_idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: "posts",
          key: "idx",
        },
      },
      tag_idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: "tags",
          key: "idx",
        },
      },
    },
    {
      tableName: "post_not_tags",
    }
  );
};
