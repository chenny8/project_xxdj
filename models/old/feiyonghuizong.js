'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class feiyonghuizong extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };

    feiyonghuizong.init({
        channel_no: DataTypes.STRING,
        unit: DataTypes.STRING,
        bussiness_type: DataTypes.STRING,
        cash_type: DataTypes.STRING,
        is_cmiot: DataTypes.STRING,
        income: DataTypes.STRING,
        bussiness_time: DataTypes.DATEONLY,
        memo: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'feiyonghuizong',
        freezeTableName: true,   //设置表名一致
        underscored: true,    //设置updatedAt -> updated_at

    });
    return feiyonghuizong;
};