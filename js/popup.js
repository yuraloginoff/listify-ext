"use strict"

import * as db from "./db.js"

const Config = {
  mainTemplate: document.querySelector("#main-template").innerHTML,
  mainWrap: document.querySelector("#index"),
  alertOk: document.querySelector(".alert-success"),
  alertError: document.querySelector(".alert-danger")
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
        const groupId = link.getAttribute("data-groupid")
        db.addLink(groupId).then(result => {
          this.showAlert(result)
        })
      })
    })

    document.forms.addgroup.addEventListener("submit", e => {
      e.preventDefault()
      db.addGroup(document.forms.addgroup.elements.title.value).then(result => {
        console.error(result)
        this.init()
      })
    })
  }

  showAlert(error) {
    if (error) {
      this.conf.alertError.classList.add("open")
    } else {
      this.conf.alertOk.classList.add("open")
    }
    setTimeout(window.close, 1000)
  }
}

new Popup(Config)
