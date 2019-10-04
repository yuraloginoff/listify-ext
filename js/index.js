"use strict"

const mainTemplate = document.querySelector('#template').innerHTML
const mainWrap = document.querySelector('#index')

/**
 * Get all items from Chrome storage
 *
 * @returns Promise
 */
function findAll() {
  return new Promise(resolve =>
    chrome.storage.local.get(data => resolve(data))
  )
}


/**
 * Renders Mustache template using data from chrome storage
 *
 * @param {JSON} data
 * @param {string} templateSrc
 * @param {Node} outputElem
 */
function renderTemplate(data, templateSrc, outputElem) {
  Mustache.parse(templateSrc)
  outputElem.innerHTML = Mustache.render(templateSrc, data)
}


/**
 * Gets data prmise and renders demplate
 */
findAll().then(
  result => renderTemplate(result, mainTemplate, mainWrap)
)