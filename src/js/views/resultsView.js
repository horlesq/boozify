import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No cocktails found for your query. Please try again!';
  _successMessage = '';

  /**
   * Generate HTML markup for the results
   * @returns {string} A string of HTML markup
   * @this {Object} ResultsView instance
   */
  _generateHtml() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
