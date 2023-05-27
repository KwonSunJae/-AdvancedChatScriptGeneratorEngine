module.exports = (sequelize, DataTypes) => {
    const cacheddialog = sequelize.define(
        "cacheddialog",
        {
            order: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
        cacheddialog.belongsTo(models.user, {
            foreignKey: "user_no",
        })
    }
    return cacheddialog;
};