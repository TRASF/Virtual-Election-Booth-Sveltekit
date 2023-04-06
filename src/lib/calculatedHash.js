// src/lib/calculateHash.js
import CryptoJS from 'crypto-js';

/**
 * @param {any} object
 */
export function calculateHash(object) {
  const stringifiedObject = JSON.stringify(object);
  const hash = CryptoJS.SHA256(stringifiedObject).toString();
  return hash;
}
