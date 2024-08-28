import View from './View.js';
import icons from 'url:../../img/icons.svg';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage =
    'We could not find that cocktail recipe. Please try another one!';
  _successMessage = '';
  _generateHtml() {
    return `
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${this._data.title}" 
          class="recipe__img" />
          <h1 class="recipe__title">
            <span>"${this._data.title}"</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-drink"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.alcoholic
            }</span>
            <span class="recipe__info-text">drink</span>
          </div>

          <button class="btn--round btn--favorite">
            <svg class="">
            <use href="${icons}#icon-favorite${
      this._data.favorite === true ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
              .map(ing => {
                return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${
                  ing.quantity ? ing.quantity : ''
                }</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit}</span>
                  ${ing.description}
                </div>
              </li>
              `;
              })
              .join('')}
          </ul>
        </div>

        <div class="recipe__instructions">
          <h2 class="heading--2">How to prepare it</h2>
          <p class="recipe__instructions-text">
            ${this._data.instructions}
          </p>
        </div>
        `;
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }

  addHandlerAddFavorite(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--favorite');
      if (!btn) return;
      handler();
    });
  }
}

export default new RecipeView();
