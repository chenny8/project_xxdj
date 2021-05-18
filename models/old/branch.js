'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class branch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  branch.init({
    branch: DataTypes.STRING,
    unit: DataTypes.STRING,
    is_zy: DataTypes.STRING,
    memo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'branch',
    freezeTableName: true,   //设置表名一致
    underscored: true,    //设置updatedAt -> updated_at
  });
  return branch;
};