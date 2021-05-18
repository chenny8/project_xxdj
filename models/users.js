'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  users.init({
    name: DataTypes.STRING,
    display_name: DataTypes.STRING,
    sex: DataTypes.INTEGER,
    tel: DataTypes.STRING,
    email: DataTypes.STRING,
    email_verified_at: DataTypes.DATE,
    password: DataTypes.STRING,
    remember_token: DataTypes.STRING,
    memo: DataTypes.STRING,
    isadmin: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'users',
    freezeTableName: true,   //设置表名一致
    underscored: true,    //设置updatedAt -> updated_at
  });
  return users;
};