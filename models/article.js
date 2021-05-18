'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class article extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    article.init({
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        content: DataTypes.TEXT,
        section: DataTypes.INTEGER,
        memo: DataTypes.STRING,

    }, {
        sequelize,
        modelName: 'article',
        freezeTableName: true,   //设置表名一致
        underscored: true,    //设置updatedAt -> updated_at
    });
    return article;
};