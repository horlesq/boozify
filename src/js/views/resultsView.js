import View from './View.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No cocktails found for your query. Please try again!';
  _successMessage = '';

  _generateHtml() {
    console.log(this._data);
    return this._data
      .map(
        recipe =>
          `
          <li class="preview">
            <a class="preview__link" href="#${recipe.id}">
              <figure class="preview__fig">
                <img src="${recipe.image}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${recipe.title}</h4>
                <p class="preview__publisher">${recipe.alcoholic.toUpperCase()}</p>
              </div>
            </a>
          </li>
       `
      )
      .join('');
  }
}

export default new ResultsView();
