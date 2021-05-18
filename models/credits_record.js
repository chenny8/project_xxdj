'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class credits_record extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    credits_record.init({
        name: DataTypes.STRING,
        credits: DataTypes.INTEGER,
        member_id:DataTypes.INTEGER,
        credits_rule_id:DataTypes.INTEGER,
        memo:DataTypes.STRING
    }, {
        sequelize,
        modelName: 'credits_record',
        freezeTableName: true,   //设置表名一致
        underscored: true,    //设置updatedAt -> updated_at
    });
    return credits_record;
};