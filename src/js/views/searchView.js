import View from './View.js';

class SearchView extends View {
  _parentElement = document.querySelector('.search');

  /**
   * Get the query entered in the search field
   * @returns {string} The query string entered by the user
   * @this {Object} SearchView instance
   */
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  /**
   * Clear the input field in the search form
   * @this {Object} SearchView instance
   */
  #clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  /**
   * Attach an event handler to the search form submission
   * @param {Function} handler The function to handle the form submit event
   * @this {Object} SearchView instance
   */
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
