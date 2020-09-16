module.exports = (sequelize,DataTypes) =>{
    let alias = 'User';
    let cols = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey : true,
            allowNull: false,
            autoIncrement: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        image: DataTypes.STRING,
        idAddress: DataTypes.INTEGER,
    };
    let config = {
        tableName : 'users',
    }
    
    const User = sequelize.define(alias,cols,config);

    User.associate = function(models) {
        User.belongsTo(models.Address, {
            as: "addresses",
            foreignKey: "idAddress"

        });
    }

    return User;
}