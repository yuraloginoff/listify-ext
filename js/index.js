"use strict"

import * as db  from "./db.js";

const mainTemplate = document.querySelector('#template').innerHTML
const mainWrap = document.querySelector('#index')
const gridSettings = {
  container: ".wrap", // Required. Can be a class, id, or an HTMLElement
  static: true, // Required for static content. Default: false.
  gutter: 30, // Optional. Space between items. Default: 25(px).
  maxColumns: 10, // Optional. Maximum number of columns. Default: Infinite.
  useMin: true, // Optional. Prioritize shorter columns when positioning items. Default: false.
  useTransform: true, // Optional. Position items using CSS transform. Default: True.
  animate: false // Optional. Animate item positioning. Default: false.
}
let grid
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
  result => {
    renderTemplate(result, mainTemplate, mainWrap)

    // masonry layout
    grid = new MagicGrid(gridSettings)
    grid.listen()
  }
)