'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ziyingting_yskjh extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };

    ziyingting_yskjh.init({
        branch: DataTypes.STRING,
        bussiness_time: DataTypes.DATEONLY,
        unit: DataTypes.STRING,
        boss_qcqj: DataTypes.DECIMAL(12, 2),
        boss_qcqjxc: DataTypes.DECIMAL(12, 2),
        boss_total: DataTypes.DECIMAL(12, 2),
        boss_add : DataTypes.DECIMAL(12, 2),
        boss_subtract : DataTypes.DECIMAL(12, 2),
        boss_yingjiao : DataTypes.DECIMAL(12, 2),
        boss_cash : DataTypes.DECIMAL(12, 2),
        boss_pos : DataTypes.DECIMAL(12, 2),
        boss_check : DataTypes.DECIMAL(12, 2),
        boss_alipay : DataTypes.DECIMAL(12, 2),
        boss_wechat : DataTypes.DECIMAL(12, 2),
        boss_pishouhuakou : DataTypes.DECIMAL(12, 2),
        boss_xiaofeifenqi : DataTypes.DECIMAL(12, 2),
        boss_benriyijiao : DataTypes.DECIMAL(12, 2),
        boss_benriqianjiao : DataTypes.DECIMAL(12, 2),
        boss_qimoqianjiao : DataTypes.DECIMAL(12, 2),
        atm_qcqj : DataTypes.DECIMAL(12, 2),
        atm_qcqjxc : DataTypes.DECIMAL(12, 2),
        atm_total : DataTypes.DECIMAL(12, 2),
        atm_benriyijiao : DataTypes.DECIMAL(12, 2),
        atm_benriqianjiao : DataTypes.DECIMAL(12, 2),
        atm_qimoqianjiao : DataTypes.DECIMAL(12, 2),
        memo : DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ziyingting_yskjh',
        freezeTableName: true,   //设置表名一致
        underscored: true,    //设置updatedAt -> updated_at
    });
    return ziyingting_yskjh;
};