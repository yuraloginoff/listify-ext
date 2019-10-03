"use strict"

const mainTemplate = document.querySelector('#template')
const mainWrap = document.querySelector('#index')

/**
 * Get all items from Chrome storage
 * @returns Promise
 */
function findAll() {
  return new Promise(resolve =>
    chrome.storage.local.get(data => resolve(data))
  )
}

function renderTemplate(data, elem) {
  const template = elem.innerHTML
  Mustache.parse(template)
  const rendered = Mustache.render(template, data)
  mainWrap.innerHTML = rendered
}

findAll().then(
  result => renderTemplate(result, mainTemplate)
)