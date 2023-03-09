// בס"ד

const fs = require('fs')

const gBugs = require('../data/bugs.json')

module.exports = {
    query,
    getById,
    remove,
    save,
}

const PAGE_SIZE = 3

function query(filterBy = { txt: '', severity: 0, labels: [], page: 0 }) {

    const regex = new RegExp(filterBy.txt, 'i')

    var bugs = gBugs.filter(item => regex.test(item.title) || regex.test(item.description))

    if (+filterBy.page < 0) filterBy.page = Math.ceil(gBugs.length / PAGE_SIZE) - 1
    if (+filterBy.page * PAGE_SIZE >= gBugs.length) filterBy.page = 0

    let ignoreIndex = bugs.findIndex(item => item["//בס''ד"] === '')

    if (ignoreIndex >= 0) bugs.splice(ignoreIndex, 1)

    const startIdx = filterBy.page * PAGE_SIZE
    bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)

    return Promise.resolve(bugs)
}

function getById(id) {
    const bug = gBugs.find(item => item._id === id)
    if (!bug) return Promise.reject('Unknown bug')

    return Promise.resolve(bug)
}

function remove(id) {
    const index = gBugs.findIndex(item => item._id === id)
    if (index === -1) return Promise.reject('Unknown bug')

    gBugs.splice(index, 1)

    return _saveBugsToFile()
}

function save(bug) {
    var savedBug
    console.log('hi from server service save');

    if (bug._id) {
        savedBug = gBugs.find(item => item._id === bug._id)
        if (!savedBug) return Promise.reject('Unknown bug')

        savedBug.title = bug.title
        savedBug.description = bug.description
        savedBug.severity = bug.severity
    } else {
        savedBug = {
            _id: _makeId(),
            title: bug.title,
            description: bug.description,
            severity: bug.severity,
            createdAt: Date.now(),
        }

        gBugs.push(savedBug)
    }

    return _saveBugsToFile()
        .then(() => {
            console.log('savedBug', savedBug)
            return savedBug
        })
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
