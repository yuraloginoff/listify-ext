"use strict"

const db = chrome.storage.local

const defaults = {
  groups: [
    {
      _id: 0,
      title: "Default list",
      links: [
        {
          id: 0,
          groupId: 0,
          url: "https://wikipedia.org",
          title: "Wikipedia",
          favicon: "https://ru.wikipedia.org/static/favicon/wikipedia.ico"
        }
      ]
    }
  ]
}

/**
 * Get all items from Chrome storage
 *
 * @returns Promise
 */
const findAll = () => {
  return new Promise((resolve) =>
    db.get(null, (data) => {
      console.log(data)
      if (!data.groups) {
        // if it's first run
        db.set(defaults, function () {
          resolve(defaults)
        })
      }
      if (!data.settings) {
        // add settings
        data.settings = {
          darktheme: false
        }
        db.set(data, function () {
          resolve(data)
        })
      }
      resolve(data)
    })
  )
}

/**
 * Get the group by ID from Chrome storage
 * id -- string
 * @returns Promise
 */
const findGroup = (id) => {
  id = parseInt(id, 10)
  return new Promise((resolve) =>
    db.get(null, (data) => {
      const group = data.groups.find((item) => item._id === id)
      resolve({
        _id: group._id,
        title: group.title
      })
    })
  )
}

/**
 * Get the link of group by ID from Chrome storage
 * groupId, linkId -- strings
 * @returns Promise
 */
const findLink = (groupId, linkId) => {
  groupId = parseInt(groupId, 10)
  linkId = parseInt(linkId, 10)
  return new Promise((resolve) =>
    db.get(null, (data) => {
      const group = data.groups.find((item) => item._id === groupId)
      const link = group.links.find((item) => item.id === linkId)
      // console.log(group, link)
      resolve(link)
    })
  )
}

const editGroup = (id, title) => {
  id = parseInt(id, 10)

  db.get(null, (data) => {
    data.groups.map((item) => {
      if (item._id === id) {
        item["title"] = title
      }
    })

    db.set(data, function () {
      console.info("Saved")
    })
  })
}

const editLink = (linkId, groupId, title, url) => {
  linkId = parseInt(linkId, 10)
  groupId = parseInt(groupId, 10)

  db.get(null, (data) => {
    data.groups.map((group) => {
      if (group._id === groupId) {
        group.links.map((link) => {
          if (link.id === linkId) {
            link.title = title
            link.url = url
          }
        })
      }
    })

    db.set(data, function () {
      console.info("Saved")
    })
  })
}

const deleteGroup = (id) => {
  id = parseInt(id, 10)

  db.get(null, (data) => {
    data.groups.map((item, i) => {
      if (item._id === id) {
        data.groups.splice(i, 1)
      }
    })

    db.set(data, function () {
      console.info("Deleted")
    })
  })
}

const deleteLink = (linkId, groupId) => {
  linkId = parseInt(linkId, 10)
  groupId = parseInt(groupId, 10)

  db.get(null, (data) => {
    data.groups.map((group) => {
      if (group._id === groupId) {
        group.links.map((link, i) => {
          if (link.id === linkId) {
            group.links.splice(i, 1)
          }
        })
      }
    })

    db.set(data, function () {
      console.info("Deleted")
    })
  })
}

const addLink = (groupId) => {
  groupId = parseInt(groupId, 10)

  return new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (tabs) => {
        db.get(null, (data) => {
          data.groups.map((group) => {
            if (group._id === groupId) {
              const newLink = {
                url: tabs[0]["url"],
                title: tabs[0]["title"],
                favicon: tabs[0]["favIconUrl"],
                groupId: groupId
              }
              if (group.links.length) {
                // id: get id value of the last link. Increase it by 1.
                newLink.id = group.links[group.links.length - 1]["id"] + 1
              } else {
                newLink.id = 0
              }
              group.links.push(newLink)
            }
          })

          db.set(data, function () {
            resolve(chrome.runtime.lastError)
          })
        })
      }
    )
  })
}

const addGroup = (title) => {
  return new Promise((resolve) => {
    db.get(null, (data) => {
      data.groups.push({
        _id: data.groups.length + 1,
        title: title,
        links: []
      })

      db.set(data, function () {
        resolve(chrome.runtime.lastError)
      })
    })
  })
}

export {
  findAll,
  findGroup,
  addGroup,
  editGroup,
  deleteGroup,
  findLink,
  editLink,
  deleteLink,
  addLink
}

/*
db.get(null, data => {
  data.groups.map(gr => {
    gr.links.map((link, i) => {
      link.id = i
    })
  })

  db.set(data, function() {
    console.log("Saved")
  })
})
*/
