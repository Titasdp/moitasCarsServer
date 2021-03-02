const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
class User extends Model {}

User.init({
    id_user: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "user",
    tableName: "user",
    logging: false,
});
// // UserType Connection
// userTypeModel.UserType.hasMany(User, {
//     foreignKey: {
//         name: "id_user_type",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// User.belongsTo(userTypeModel.UserType, {
//     foreignKey: {
//         name: "id_user_type",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// // Login type
// loginTypeModel.LoginType.hasMany(User, {
//     foreignKey: {
//         name: "id_login_type",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// User.belongsTo(loginTypeModel.LoginType, {
//     foreignKey: {
//         name: "id_login_type",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// // User Status type
// userStatusModel.UserStatus.hasMany(User, {
//     foreignKey: {
//         name: "id_user_status",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// User.belongsTo(userStatusModel.UserStatus, {
//     foreignKey: {
//         name: "id_user_status",
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

module.exports = {
    User
};