import icons from 'url:../../img/icons.svg';

class RecipeView {
  #parentElement = document.querySelector('.recipe');
  #data;

  render(data) {
    this.#data = data;
    const html = this.#generateHtml();
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', html);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  renderSpinner() {
    const html = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;

    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', html);
  }

  #generateHtml() {
    return `
        <figure class="recipe__fig">
          <img src="${this.#data.image}" alt="${this.#data.title}" 
          class="recipe__img" />
          <h1 class="recipe__title">
            <span>"${this.#data.title}"</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this.#data.alcoholic
            }</span>
            <span class="recipe__info-text">drink</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">4</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this.#data.ingredients
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
            ${this.#data.instructions}
          </p>
        </div>
        `;
  }

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler)
    );
  }
}

export default new RecipeView();
