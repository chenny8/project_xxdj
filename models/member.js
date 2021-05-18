'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class member extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    member.init({
        name: DataTypes.STRING,
        type: DataTypes.INTEGER,
        sex: DataTypes.INTEGER,
        id_number: DataTypes.STRING,
        tel: DataTypes.STRING,
        credits: DataTypes.STRING,
        status: DataTypes.INTEGER,
        confirmed: DataTypes.INTEGER,
        position: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'member',
        freezeTableName: true,   //设置表名一致
        underscored: true,    //设置updatedAt -> updated_at
    });
    return member;
};