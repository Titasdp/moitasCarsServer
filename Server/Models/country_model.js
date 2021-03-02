const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
class Country extends Model {}

Country.init({
    id_country: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    timestamps: false,
    modelName: "country",
    tableName: "country",
    logging: false,
});


module.exports = {
    Country
};