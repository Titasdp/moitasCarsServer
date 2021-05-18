const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
class Testimonial extends Model {}
const userModel = require("../Models/user_model")

Testimonial.init({
    id_testimonial: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    person_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    testimonial_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.NOW,
        allowNull: false,
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.NOW,
        allowNull: false,
    }
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "testimonial",
    tableName: "testimonial",
    logging: false,
});
// User Connection
userModel.User.hasMany(Testimonial, {
    foreignKey: {
        name: "id_user",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Testimonial.belongsTo(userModel.User, {
    foreignKey: {
        name: "id_user",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

module.exports = {
    Testimonial
};