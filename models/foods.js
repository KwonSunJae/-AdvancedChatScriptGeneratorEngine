module.exports = (sequelize, DataTypes) => {
    const foods = sequelize.define(
        "foods",
        {
            food: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            deadline: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_new : {
                type : DataTypes.BOOLEAN,
                allowNull : false, 
                defaultValue : true,
            }
        },
        {
            sequelize,
            tableName: "foods",
            timestamps: true,
        }
    );
    foods.associate = (models) => {
        foods.belongsTo(models.user, {
            foreignKey: "user_no",
        })
    }
    return foods;
};