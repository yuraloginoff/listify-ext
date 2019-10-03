"use strict"

/**
 * Get all items from Chrome storage
 * @returns Promise
 */
function findAll() {
  return new Promise(resolve =>
    chrome.storage.local.get(data => resolve(data))
  )
}

findAll().then(console.log)
