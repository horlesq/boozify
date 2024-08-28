import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Renders the provided data to the DOM.
   * - If `render` is true, it inserts the HTML into the DOM.
   * - If `render` is false, it returns the HTML string.
   * @param {Object | Object[]} data - The data to be rendered.
   * @param {boolean} [render=true] - If false, returns HTML string instead of rendering.
   * @returns {undefined | string} - Returns HTML string if `render=false`.
   * @this {View} - The current instance of the View class.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const html = this._generateHtml();

    if (!render) return html;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  /**
   * Updates the DOM to reflect changes in data.
   * - Only updates elements that have changed.
   * @param {Object | Object[]} data - The new data to update.
   * @this {View} - The current instance of the View class.
   */
  update(data) {
    this._data = data;
    const newHtml = this._generateHtml();

    const newDOM = document.createRange().createContextualFragment(newHtml);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, idx) => {
      const curEl = curElements[idx];
      // Updating text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updating attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  /**
   * Clear the content of the parent element in the DOM
   * @this {Object} View instance
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Render a loading spinner to the DOM
   * @this {Object} View instance
   */
  renderSpinner() {
    const html = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  /**
   * Render an error message to the DOM
   * @param {string} [message=this._errorMessage] The error message to be displayed
   * @this {Object} View instance
   */
  renderError(message = this._errorMessage) {
    const html = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  /**
   * Render a success message to the DOM
   * @param {string} [message=this._successMessage] The success message to be displayed
   * @this {Object} View instance
   */
  renderMessage(message = this._successMessage) {
    const html = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
