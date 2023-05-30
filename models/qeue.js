module.exports = (sequelize, DataTypes) => {
    const qeue = sequelize.define(
        "qeue",
        {
            order: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            wimnchat: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            types : {
                type : DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            tableName: "qeue",
            timestamps: false,
        }
    );
    qeue.associate = (models) => {
        qeue.belongsTo(models.user, {
            foreignKey: "user_no",
        })
    }
    return qeue;
};