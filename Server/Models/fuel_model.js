const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
class Fuel extends Model {}

Fuel.init({
    id_fuel_type: {
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
    modelName: "fuel",
    tableName: "fuel",
    logging: false,
});


module.exports = {
    Fuel
};