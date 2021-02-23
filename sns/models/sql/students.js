/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "Students",
    {
      idx: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "idx",
        },
      },
      grade: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      klass: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
      },
      serial: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      tableName: "students",
    }
  );
};
