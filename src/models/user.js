module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    displayName: { type: DataTypes.STRING },
    email: { unique: true, type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
  },
    { timestamps: false });

  User.associate = (models) => {
    User.hasMany(models.BlogPost, { as: 'posts', foreignKey: 'userId' });
  };
  return User;
};