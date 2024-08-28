import { TIMEOUT_SEC } from './config';

/**
 * Creates a promise that rejects with an error after a specified timeout period
 * @param {number} s The timeout duration in seconds
 * @returns {Promise<void>} A promise that rejects after the specified timeout
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Fetches JSON data from a specified URL with a timeout
 * @param {string} url The URL to fetch data from
 * @returns {Promise<Object>} A promise that resolves with the fetched data
 * @throws {Error} Throws an error if the request times out or if no data is found
 */
export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    if (!data.drinks) throw new Error(`Cocktail recipe does not exist!`);
    return data;
  } catch (error) {
    throw error;
  }
};
