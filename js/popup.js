"use strict"

import * as db from "./db.js"

const Config = {
  mainTemplate: document.querySelector("#main-template").innerHTML,
  mainWrap: document.querySelector("#index")
}

class Popup {
  constructor(config) {
    this.conf = config
    this.init()
  }

  init() {
    db.findAll().then(result => {
      this.renderTemplate(result, this.conf.mainTemplate, this.conf.mainWrap)
      this.bindEvents()
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
    document.querySelectorAll(".js-group-link").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault()
        console.log(this)
        const groupId = link.getAttribute("data-groupid")
        db.insertLink(groupId, this.showAlert)
      })
    })
  }

  showAlert(error) {
    if (error) {
      console.log("err")
    } else {
      console.log("Ok")
    }
  }
}

new Popup(Config)
