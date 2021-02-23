/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "UserTags",
    {
      idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: "users",
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
      admin: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      modification_allowed: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      invitation_allowed: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      post_allowed: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      acceptance_allowed: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "forced",
          "invited",
          "invitation_accept",
          "invitation_refuse",
          "creator",
          "request",
          "request_accepted",
          "request_refused",
          "by_dimigoin"
        ),
        allowNull: true,
      },
    },
    {
      tableName: "user_tags",
    }
  );
};
