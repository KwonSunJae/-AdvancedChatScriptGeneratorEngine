module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define(
        "user",
        {
            no: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            essentialdata: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isQeued: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue : false,
            },
        },
        {
            sequelize,
            tableName: "users",
            timestamps: true,
        }
    );
    user.associate = (models) => {
        user.hasMany(models.cacheddialog, {
            foreignKey: "user_no",
            onDelete: "cascade",
            allowNull: "false",
        });
        user.hasMany(models.foods,{
            foreignKey: "user_no",
            onDelete: "cascade",
            allowNull: "false",
        });
        user.hasMany(models.qeue,{
            foreignKey: "user_no",
            onDelete: "cascade",
            allowNull: "false",
        });
    };
    return user;
};