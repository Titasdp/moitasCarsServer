const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
class Brand extends Model {}

Brand.init({
    id_brand: {
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
    modelName: "brand",
    tableName: "brand",
    logging: false,
});


module.exports = {
    Brand
};