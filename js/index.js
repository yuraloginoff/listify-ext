"use strict"

import * as db from "./db.js"

const mainTemplate = document.querySelector("#template").innerHTML
const mainWrap = document.querySelector("#index")
const gridSettings = {
  container: ".wrap", // Required. Can be a class, id, or an HTMLElement
  static: true, // Required for static content. Default: false.
  // gutter: 30, // Optional. Space between items. Default: 25(px).
  maxColumns: 10, // Optional. Maximum number of columns. Default: Infinite.
  useMin: true, // Optional. Prioritize shorter columns when positioning items. Default: false.
  useTransform: true, // Optional. Position items using CSS transform. Default: True.
  animate: false // Optional. Animate item positioning. Default: false.
}
const groupModalTemplate = document.querySelector("#group-modal-template")
  .innerHTML
const modalWrap = document.querySelector("#modal-wrap")

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

function bindEvents() {
  // groups
  document.querySelectorAll(".js-edit-group").forEach(function(link) {
    link.addEventListener("click", function(e) {
      e.preventDefault()
      const groupId = this.getAttribute("data-groupid")

      openModal(groupModalTemplate, modalWrap, groupId)
    })
  })

  // links
  document.querySelectorAll(".js-edit-link").forEach(function(link) {
    link.addEventListener("click", function(e) {
      e.preventDefault()
      const groupId = this.getAttribute("data-groupid")
      const linkId = this.getAttribute("data-linkid")
      console.log(groupId, linkId)
    })
  })
}

/**
 * Gets data promise and renders template
 */
db.findAll().then(result => {
  console.log(result)

  renderTemplate(result, mainTemplate, mainWrap)
  bindEvents()

  // masonry-like layout
  let grid = new MagicGrid(gridSettings)
  grid.listen()
})

function openModal(tmpl, outElem, groupId) {
  db.findGroup(groupId).then(result => {
    renderTemplate(result, tmpl, outElem)
    modalWrap.classList.add("open")

    // close modal
    outElem.querySelector(".js-cancel").addEventListener("click", function(e) {
      e.preventDefault()
      console.log(this)
      modalWrap.classList.remove("open")
    })
  })
}
