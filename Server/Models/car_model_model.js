const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
class CarModel extends Model {}
const brandModel = require("../Models/brand_model")


CarModel.init({
    id_model: {
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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "model",
    tableName: "model",
    logging: false,
});

// Brand Connection
brandModel.Brand.hasMany(CarModel, {
    foreignKey: {
        name: "id_brand",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
CarModel.belongsTo(brandModel.Brand, {
    foreignKey: {
        name: "id_brand",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

module.exports = {
    CarModel
};