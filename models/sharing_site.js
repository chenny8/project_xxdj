'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class sharing_site extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    sharing_site.init({
        name: DataTypes.STRING,
        type: DataTypes.INTEGER,
        capacity: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        longitude: DataTypes.STRING,
        latitude: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'sharing_site',
        freezeTableName: true,   //设置表名一致
        underscored: true,    //设置updatedAt -> updated_at
    });
    return sharing_site;
};