module.exports = (sequelize, _DataTypes) => {
  const PostCategory = sequelize.define('PostCategory', {},
    { timestamps: false, tableName: 'PostsCategories' });
  PostCategory.associate = (models) => {
    models.BlogPost.belongsToMany(models.Category, {
      as: 'categories',
      through: models.PostCategory,
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });
    models.Category.belongsToMany(models.BlogPost, {
      as: 'posts',
      through: models.PostCategory,
      foreignKey: 'categoryId',
      otherKey: 'postId',
    });
  };

  return PostCategory;
};