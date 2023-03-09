// בס"ד

const fs = require('fs')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.SECRET || 'secret-puk-1234')

const gUsers = require('../data/users.json')

module.exports = {
    query,
    getById,
    remove,
    save,
    checkLogin,
    getLoginToken,
    validateToken
}

const PAGE_SIZE = 3

function query() {
    const users = gUsers.map(user => {
        user = { ...user }
        delete user.password
        return user
    })

    return Promise.resolve(users)
}

function getById(id) {
    const user = gUsers.find(item => item._id === id)
    if (!user) return Promise.reject('Unknown user')

    return Promise.resolve(user)
}

function remove(id) {
    const index = gUsers.findIndex(item => item._id === id)
    if (index === -1) return Promise.reject('Unknown user')

    gUsers.splice(index, 1)

    return _saveUsersToFile()
}

function save(user) {
    var savedUser
    console.log('hi from server service save');

    if (user._id) {
        savedUser = gUsers.find(item => item._id === user._id)
        if (!savedUser) return Promise.reject('Unknown user')

        savedUser.username = user.username
        savedUser.fullname = user.fullname
        savedUser.password = user.password
    } else {
        savedUser = {
            _id: _makeId(),
            username: user.username,
            fullname: user.fullname,
            password: user.password,
        }

        gUsers.push(savedUser)
    }

    return _saveUsersToFile()
        .then(() => {
            const user = {
                _id: savedUser._id,
                fullname: savedUser.fullname
            }
            return user
        })
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}


function checkLogin({ username, password }) {
    var user = gUsers.find(user => user.username === username && user.password === password)
    if (user) {
        user = {
            _id: user._id,
            fullname: user.fullname
        }
    }
    return Promise.resolve(user)
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gUsers, null, 2)

        fs.writeFile('data/users.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
