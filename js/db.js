"use strict"

/**
 * Get all items from Chrome storage
 *
 * @returns Promise
 */
let findAll = () => {
  return new Promise(resolve =>
    chrome.storage.local.get(data => resolve(data))
  )
}

export { findAll };