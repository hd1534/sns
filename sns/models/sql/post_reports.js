/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "PostReports",
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
      report_type: {
        type: DataTypes.ENUM("bad_words", "etc"),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      added_date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn("NOW"),
      },
    },
    {
      tableName: "post_eports",
    }
  );
};
