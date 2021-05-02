const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
class Engine extends Model {}

Engine.init({
    id_engine: {
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
    horse_power: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
}, {
    sequelize,
    timestamps: false,
    modelName: "engine",
    tableName: "engine",
    logging: false,
});


module.exports = {
    Engine
};