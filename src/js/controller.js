import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationsView from './views/paginationView.js';
import favoritesView from './views/favoritesView.js';
import { INIT_PAGE } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Display spinner
    recipeView.renderSpinner();

    // Update results view to mark selected item
    resultsView.update(model.getSearchResultsPage());

    // Update favorites view
    favoritesView.update(model.state.favorites);

    // Load recipe
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(error);
  }
};

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Display spinner
    resultsView.renderSpinner();

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage(INIT_PAGE));

    // Render initial pagination buttons
    paginationsView.render(model.state.search);
  } catch (error) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render new pagination buttons
  paginationsView.render(model.state.search);
};

const controlAddFavorite = function () {
  // Add/remove favorites
  if (!model.state.recipe.favorite) model.addFavorite(model.state.recipe);
  else model.removeFavorite(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render favorite list
  favoritesView.render(model.state.favorites);
};

const controlFavorites = function () {
  favoritesView.render(model.state.favorites);
};

const init = function () {
  favoritesView.addHandlerRender(controlFavorites);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddFavorite(controlAddFavorite);
  searchView.addHandlerSearch(controlSearchResults);
  paginationsView.addHandlerPagination(controlPagination);
};

init();
