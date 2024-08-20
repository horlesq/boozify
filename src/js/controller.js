import icons from 'url:../img/icons.svg';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://www.thecocktaildb.com/api.php

///////////////////////////////////////

const renderSpinner = function (parentEl) {
  const html = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;

  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', html);
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

const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Load recipe
    renderSpinner(recipeContainer);
    const response = await fetch(
      `https://thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    const data = await response.json();

    if (!data.drinks) throw new Error(`Drink does not exist`);

    let recipe = data.drinks[0];
    recipe = {
      id: recipe.idDrink,
      title: recipe.strDrink,
      image: recipe.strDrinkThumb,
      alcoholic: recipe.strAlcoholic,
      glass: recipe.strGlass,
      instructions: recipe.strInstructions,
      ingredients: formatIngridients(recipe),
    };

    console.log(recipe);

    // Render recipe
    const html = `
        <figure class="recipe__fig">
          <img src="${recipe.image}" alt="${
      recipe.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>"${recipe.title}"</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              recipe.alcoholic
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
            ${recipe.ingredients
              .map(ing => {
                return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${ing.quantity}</div>
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
            ${recipe.instructions}
          </p>
          
        </div>
        `;

    recipeContainer.innerHTML = '';
    recipeContainer.insertAdjacentHTML('afterbegin', html);
  } catch (err) {
    alert(err);
  }
};

['hashchange', 'load'].forEach(event =>
  window.addEventListener(event, showRecipe)
);
