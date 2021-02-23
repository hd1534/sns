/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "RevokedTokens",
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      jwt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "revoked_tokens",
    }
  );
};
