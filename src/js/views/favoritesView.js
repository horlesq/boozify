import View from './View.js';
import previewView from './previewView.js';

class FavoritesView extends View {
  _parentElement = document.querySelector('.favorites__list');
  _errorMessage = 'No favorite cocktails yet!';
  _successMessage = '';

  /**
   * Generate HTML markup for the list of favorite recipes
   * @returns {string} A string of HTML markup for the favorite recipes
   * @this {Object} FavoritesView instance
   */
  _generateHtml() {
    return this._data
      .map(favorite => previewView.render(favorite, false))
      .join('');
  }

  /**
   * Attach an event handler to the window's load event for rendering favorites
   * @param {Function} handler The function to call when the window's load event is triggered
   * @this {Object} FavoritesView instance
   */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new FavoritesView();
