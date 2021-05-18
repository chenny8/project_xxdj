'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class activity extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    activity.init({
        name: DataTypes.STRING,
        type: DataTypes.INTEGER,
        location: DataTypes.STRING,
        longitude: DataTypes.STRING,
        latitude: DataTypes.STRING,
        radius: DataTypes.STRING,
        location_check: DataTypes.INTEGER,
        duration: DataTypes.STRING,
        min_duration: DataTypes.STRING,
        sign_in_time: DataTypes.DATE,
        sign_out_time: DataTypes.DATE,
        ahead_sign_in_time: DataTypes.DATE,
        delay_sign_in_time: DataTypes.DATE,
        ahead_sign_out_time: DataTypes.DATE,
        delay_sign_out_time: DataTypes.DATE,
        credits: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'activity',
        freezeTableName: true,   //设置表名一致
        underscored: true,    //设置updatedAt -> updated_at
    });
    return activity;
};