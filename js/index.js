"use strict"

import * as db from "./db.js"

const Config = {
  mainTemplate: document.querySelector("#template").innerHTML,
  mainWrap: document.querySelector("#index"),
  gridSettings: {
    container: ".wrap", // Required
    static: true, // Required for static content
    gutter: 25,
    maxColumns: 10, // Default: Infinite
    useMin: true, // Prioritize shorter columns when positioning items
    useTransform: true, // Position items using CSS transform
    animate: false // Animate item positioning
  },
  groupModalTemplate: document.querySelector("#group-modal-template").innerHTML,
  modalWrap: document.querySelector("#modal-wrap")
}

class Listify {
  constructor(config) {
    this.conf = config
    this.init()
  }

  init() {
    // Gets data (promise) and renders main template
    db.findAll().then(result => {
      console.log(result)

      this.renderTemplate(result, this.conf.mainTemplate, this.conf.mainWrap)
      this.bindEvents()

      this.grid = new MagicGrid(this.conf.gridSettings)
      this.grid.listen()
    })
  }

  /**
   * Renders Mustache template using data from chrome storage
   *
   * @param {JSON} data
   * @param {string} templateSrc
   * @param {Node} outputElem
   */
  renderTemplate(data, templateSrc, outputElem) {
    Mustache.parse(templateSrc)
    outputElem.innerHTML = Mustache.render(templateSrc, data)
  }

  bindEvents() {
    const self = this

    // chrome.storage.onChanged.addListener(() => {
    //   this.init()
    // })

    // groups
    document.querySelectorAll(".js-edit-group").forEach(function(link) {
      link.addEventListener("click", function(e) {
        e.preventDefault()
        const groupId = this.getAttribute("data-groupid")

        self.openModal(
          self.conf.groupModalTemplate,
          self.conf.modalWrap,
          groupId
        )
      })
    })

    // links
    // document.querySelectorAll(".js-edit-link").forEach(function(link) {
    //   link.addEventListener("click", function(e) {
    //     e.preventDefault()
    //     const groupId = this.getAttribute("data-groupid")
    //     const linkId = this.getAttribute("data-linkid")
    //     console.log(groupId, linkId)
    //   })
    // })
  }

  openModal(tmpl, outElem, groupId) {
    const self = this

    db.findGroup(groupId).then(result => {
      this.renderTemplate(result, tmpl, outElem)
      this.conf.modalWrap.classList.add("open")

      // close modal
      outElem
        .querySelector(".js-cancel")
        .addEventListener("click", e => self.closeModal(e))

      // save group
      document.forms.group.addEventListener("submit", e =>
        self.submitGroupModal(e)
      )
    })
  }

  closeModal(e) {
    e.preventDefault()
    this.conf.modalWrap.classList.remove("open")
  }

  submitGroupModal(e) {
    e.preventDefault()
    const elems = this.elements
    db.editGroup({
      _id: elems._id.value,
      title: elems.title.value
    })
    this.conf.modalWrap.classList.remove("open")
  }
} // class Listify

new Listify(Config)
