"use strict"

import * as db  from "./db.js";

const mainTemplate = document.querySelector('#template').innerHTML
const mainWrap = document.querySelector('#index')

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
db.findAll().then(
  result => renderTemplate(result, mainTemplate, mainWrap)
)