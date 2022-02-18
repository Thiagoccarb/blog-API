module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.STRING },
    userId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      references: { model: 'User', key: 'id', onUpdate: 'CASCADE', onDelete: 'CASCADE' },
    },
    published: { type: DataTypes.DATE },
    updated: { type: DataTypes.DATE },
  },
    { timestamps: false });
  BlogPost.associate = (models) => {
    BlogPost.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };
  return BlogPost;
};