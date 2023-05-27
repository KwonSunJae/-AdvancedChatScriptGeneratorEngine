module.exports = (sequelize, DataTypes) => {
    const cacheddialog = sequelize.define(
        "cacheddialog",
        {
            order: {
                type: DataTypes.INT,
                allowNull: false,
                autoIncrement: true
            },
            userchat: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            wimnchat: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: "cacheddialog",
            timestamps: true,
        }
    );
    cacheddialog.associate = (models) => {
        history.belongsTo(models.user, {
            foreignKey: "user_no",
        })
    }
    return cacheddialog;
};