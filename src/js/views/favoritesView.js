import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class FavoritesView extends View {
  _parentElement = document.querySelector('.favorites__list');
  _errorMessage = 'No favorite cocktails yet!';
  _successMessage = '';

  _generateHtml() {
    return this._data
      .map(favorite => previewView.render(favorite, false))
      .join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler)
  }
}

export default new FavoritesView();
