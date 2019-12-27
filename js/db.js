"use strict"

/**
 * Get all items from Chrome storage
 *
 * @returns Promise
 */
const findAll = () => {
  return new Promise(resolve =>
    chrome.storage.local.get(null, data => {
      resolve(data)
    })
  )
}

/**
 * Get the group by ID from Chrome storage
 * id -- string
 * @returns Promise
 */
const findGroup = id => {
  id = parseInt(id, 10)
  return new Promise(resolve =>
    chrome.storage.local.get(null, data => {
      const group = data.groups.find(item => item._id === id)
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
  return new Promise(resolve =>
    chrome.storage.local.get(null, data => {
      const group = data.groups.find(item => item._id === groupId)
      const link = group.links.find(item => item.id === linkId)
      // console.log(group, link)
      resolve(link)
    })
  )
}

const editGroup = (id, title) => {
  id = parseInt(id, 10)

  chrome.storage.local.get(null, data => {
    data.groups.map(item => {
      if (item._id === id) {
        data.groups[id]["title"] = title
      }
    })

    chrome.storage.local.set(data, function() {
      console.info("Saved")
    })
  })
}

const editLink = (linkId, groupId, title, url) => {
  linkId = parseInt(linkId, 10)
  groupId = parseInt(groupId, 10)

  chrome.storage.local.get(null, data => {
    data.groups.map(group => {
      if (group._id === groupId) {
        group.links.map(link => {
          if (link.id === linkId) {
            link.title = title
            link.url = url
          }
        })
      }
    })

    chrome.storage.local.set(data, function() {
      console.info("Saved")
    })
  })
}

const deleteGroup = id => {
  id = parseInt(id, 10)

  chrome.storage.local.get(null, data => {
    data.groups.map((item, i) => {
      if (item._id === id) {
        data.groups.splice(i, 1)
      }
    })

    chrome.storage.local.set(data, function() {
      console.info("Deleted")
    })
  })
}

const deleteLink = (linkId, groupId) => {
  linkId = parseInt(linkId, 10)
  groupId = parseInt(groupId, 10)
  console.log(linkId, groupId)

  chrome.storage.local.get(null, data => {
    data.groups.map(group => {
      if (group._id === groupId) {
        group.links.map((link, i) => {
          if (link.id === linkId) {
            group.links.splice(i, 1)
          }
        })
      }
    })

    chrome.storage.local.set(data, function() {
      console.info("Deleted")
    })
  })
}

export {
  findAll,
  findGroup,
  editGroup,
  deleteGroup,
  findLink,
  editLink,
  deleteLink
}

/*
chrome.storage.local.get(null, data => {
  data.groups.push({
    _id: data.groups.length + 1,
    title: "Default ",
    links: []
  })

  chrome.storage.local.set(data, function() {
    console.log("Saved")
  })
})
*/
