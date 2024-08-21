import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
};

// Format API ingridients
const formatIngridients = function (apiData) {
  const ingredients = [];

  for (let i = 1; i <= 15; i++) {
    const ingredient = apiData[`strIngredient${i}`];
    const measure = apiData[`strMeasure${i}`];

    if (ingredient) {
      // Split measure into quantity and unit
      let quantity = null;
      let unit = '';
      let description = ingredient;

      if (measure) {
        const measureParts = measure.trim().split(' ');
        quantity = measureParts[0];
        unit = measureParts.slice(1).join(' ');
      }

      ingredients.push({
        quantity: quantity,
        unit: unit,
        description: description,
      });
    }
  }

  return ingredients;
};

// Load recipe from TheCocktailDB API and update state.recipe
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

    const recipe = data.drinks[0];
    state.recipe = {
      id: recipe.idDrink,
      title: recipe.strDrink,
      image: recipe.strDrinkThumb,
      alcoholic: recipe.strAlcoholic,
      glass: recipe.strGlass,
      instructions: recipe.strInstructions,
      ingredients: formatIngridients(recipe),
    };
  } catch (err) {
    // alert(err);
    console.error(`${err} 🎇🎇`);
  }
};
