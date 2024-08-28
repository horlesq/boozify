import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  /**
   * Generate HTML markup for the pagination buttons based on the current page and total pages
   * @returns {string} A string of HTML markup for pagination buttons
   * @this {Object} PaginationView instance
   */
  _generateHtml() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 - plus other pages
    if (curPage === 1 && numPages > 1) {
      return `
          <button data-goto="${curPage + 1}" 
           class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // Other page
    if (curPage < numPages) {
      return `
          <button data-goto="${curPage - 1}"
           class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>

          <button data-goto="${curPage + 1}"
           class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
          <button data-goto="${curPage - 1}"
           class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
      `;
    }

    // Page 1 = no other pages
    return '';
  }

  /**
   * Attach an event handler to the pagination buttons for navigating between pages
   * @param {Function} handler The function to call when a pagination button is clicked
   * @this {Object} PaginationView instance
   */
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

export default new PaginationView();
