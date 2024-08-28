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

/**
 * Formats API recipe data into a structured recipe object
 * - Extracts and formats ingredients
 * - Creates a structured recipe object with relevant fields
 * @param {Object} apiData - The raw recipe data from the API
 * @returns {Object} The formatted recipe object
 */
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

/**
 * Loads a recipe from TheCocktailDB API and updates the state.recipe object
 * - Retrieves recipe data based on ID or gets a random recipe
 * - Formats the recipe data and updates the state
 * - Marks the recipe as favorite if it exists in the favorites list
 * @async
 * @param {string} [id] - The ID of the recipe to be loaded (optional for random recipe)
 * @throws {Error} Throws an error if the recipe cannot be loaded
 */
export const loadRecipe = async function (id) {
  try {
    const data = id
      ? await getJSON(`${API_URL}lookup.php?i=${id}`)
      : await getJSON(`${API_URL}random.php`); // No id - random recipe

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

/**
 * Loads search results from TheCocktailDB API based on the search query
 * - Updates the state.search.results with formatted recipe data
 * @async
 * @param {string} query - The search query for fetching recipes
 * @throws {Error} Throws an error if the search results cannot be loaded
 */
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

/**
 * Gets a specific page of search results
 * - Calculates the slice based on the current page and results per page
 * @param {number} [page=state.search.page] - The page number to retrieve
 * @returns {Object[]} A list of recipes for the specified page
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

/**
 * Persists the favorites list in localStorage
 * - Saves the current favorites state to localStorage
 */
const persistFavorites = function () {
  localStorage.setItem('favorite', JSON.stringify(state.favorites));
};

/**
 * Adds a recipe to the favorites list and updates the current recipe state
 * - Adds the recipe to the favorites array
 * - Updates the favorite status of the current recipe
 * - Persists the updated favorites list in localStorage
 * @param {Object} recipe - The recipe to be added to favorites
 */
export const addFavorite = function (recipe) {
  // Add favorite
  state.favorites.push(recipe);

  // Mark current recipe as favorite
  if (recipe.id === state.recipe.id) state.recipe.favorite = true;

  persistFavorites();
};

/**
 * Removes a recipe from the favorites list and updates the current recipe state
 * - Removes the recipe from the favorites array
 * - Updates the favorite status of the current recipe
 * - Persists the updated favorites list in localStorage
 * @param {string} id - The ID of the recipe to be removed from favorites
 */
export const removeFavorite = function (id) {
  // Remove favorite
  const index = state.favorites.findIndex(el => el.id === id);
  state.favorites.splice(index, 1);

  // Mark current recipe as NOT favorite
  if (id === state.recipe.id) state.recipe.favorite = false;

  persistFavorites();
};

/**
 * Initializes the application state by loading favorites from localStorage
 * - Retrieves and parses the favorites list from localStorage
 */
const init = function () {
  const storage = localStorage.getItem('favorite');
  if (storage) state.favorites = JSON.parse(storage);
};

init();
