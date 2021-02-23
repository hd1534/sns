/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PostAssessments",
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
      user_idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: "users",
          key: "idx",
        },
      },
      assessment: {
        type: DataTypes.ENUM("like", "dislike", "damn", "WTF"),
        allowNull: false,
      },
      added_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn("NOW"),
      },
    },
    {
      tableName: "post_assessments",
    }
  );
};
