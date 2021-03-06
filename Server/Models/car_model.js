const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
class Car extends Model {}

const fuelModel = require("../Models/fuel_model")
const countryModel = require("../Models/country_model")
const engineModel = require("../Models/engine_model")
const carModelsModel = require("../Models/car_model_model")
const userModel = require("../Models/user_model")



Car.init({
    id_car: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    reg_plate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    img_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    mileage: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    top_speed: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    production_date: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    facebook_url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    custoJusto_url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    filed: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
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
    modelName: "car",
    tableName: "car",
    logging: false,
});
// User Connection
userModel.User.hasMany(Car, {
    foreignKey: {
        name: "publisher_id",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Car.belongsTo(userModel.User, {
    foreignKey: {
        name: "publisher_id",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
// Fuel Connection
fuelModel.Fuel.hasMany(Car, {
    foreignKey: {
        name: "id_fuel_type",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Car.belongsTo(fuelModel.Fuel, {
    foreignKey: {
        name: "id_fuel_type",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
//Country connection
countryModel.Country.hasMany(Car, {
    foreignKey: {
        name: "id_country",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Car.belongsTo(countryModel.Country, {
    foreignKey: {
        name: "id_country",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
// Engine Connection
engineModel.Engine.hasMany(Car, {
    foreignKey: {
        name: "id_engine_type",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Car.belongsTo(engineModel.Engine, {
    foreignKey: {
        name: "id_engine_type",
        allowNull: true,
        type: DataTypes.STRING,
    }
});

// Engine Connection
carModelsModel.CarModel.hasMany(Car, {
    foreignKey: {
        name: "id_engine_type",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Car.belongsTo(carModelsModel.CarModel, {
    foreignKey: {
        name: "id_engine_type",
        allowNull: true,
        type: DataTypes.STRING,
    }
});




module.exports = {
    Car
};