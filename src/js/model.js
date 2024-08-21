import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
  },
};

// Format API recipe fields
const formatRecipe = function (apiData) {
  const formatedIngredients = [];

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

      formatedIngredients.push({
        quantity: quantity,
        unit: unit,
        description: description,
      });
    }
  }

  return {
    id: apiData.idDrink,
    title: apiData.strDrink,
    image: apiData.strDrinkThumb,
    alcoholic: apiData.strAlcoholic,
    glass: apiData.strGlass,
    instructions: apiData.strInstructions,
    ingredients: formatedIngredients,
  };
};

// Load recipe from TheCocktailDB API and update state.recipe
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}lookup.php?i=${id}`);

    const recipe = data.drinks[0];
    state.recipe = formatRecipe(recipe);
  } catch (error) {
    console.error(`${error} 🧨`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}search.php?s=${query}`);

    state.search.results = data.drinks.map(recipe => formatRecipe(recipe));
  } catch (error) {
    console.error(`${error} 🧨🧨🧨`);
    throw error;
  }
};
