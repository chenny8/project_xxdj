'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class songkuandan extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };

    songkuandan.init({
        channel: DataTypes.STRING,
        market_point: DataTypes.STRING,
        bussiness_time: DataTypes.DATEONLY,
        cash_type: DataTypes.STRING,
        cash_src: DataTypes.STRING,
        total_money: DataTypes.STRING,
        is_qianxiao: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'songkuandan',
        freezeTableName: true,   //设置表名一致
        underscored: true,    //设置updatedAt -> updated_at
    });
    return songkuandan;
};