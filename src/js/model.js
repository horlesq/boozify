import { API_URL } from './config.js';
import { getJSON } from './helpers.js';
import { RES_PER_PAGE } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  favorites: [],
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

    if (state.favorites.some(fav => fav.id === id))
      state.recipe.favorite = true;
    else state.recipe.favorite = false;
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

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

const persistFavorites = function () {
  localStorage.setItem('favorite', JSON.stringify(state.favorites));
};

export const addFavorite = function (recipe) {
  // Add favorite
  state.favorites.push(recipe);

  // Mark current recipe as favorite
  if (recipe.id === state.recipe.id) state.recipe.favorite = true;

  persistFavorites();
};

export const removeFavorite = function (id) {
  // Remove favorite
  const index = state.favorites.findIndex(el => el.id === id);
  state.favorites.splice(index, 1);

  // Mark current recipe as NOT favorite
  if (id === state.recipe.id) state.recipe.favorite = false;

  persistFavorites();
};

const init = function () {
  const storage = localStorage.getItem('favorite');
  if (storage) state.favorites = JSON.parse(storage);
};

init();
console.log(state.favorites);
