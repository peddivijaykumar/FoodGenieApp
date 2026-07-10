const recipeRoutes = require('./routes/recipe.js');
console.log('recipeRoutes type:', typeof recipeRoutes);
console.log('recipeRoutes keys:', Object.keys(recipeRoutes));
console.log('isFunction:', typeof recipeRoutes === 'function');
console.log('recipeRoutes default:', recipeRoutes.default);
