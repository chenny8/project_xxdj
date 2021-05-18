'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class interaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    interaction.init({
        comment: DataTypes.TEXT,
        category: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        progress: DataTypes.TEXT,
        user_id: DataTypes.STRING,
        confirmed: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'interaction',
        freezeTableName: true,   //设置表名一致
        underscored: true,    //设置updatedAt -> updated_at
    });
    return interaction;
};