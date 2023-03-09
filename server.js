// בס"ד

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

// const bugs = require('./data/bugs.json')

const bugService = require('./services/bug.service')
const userService = require('./services/user.service')


app.listen(3030, () => console.log('Server ready at port 3030!'))

app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


// app.get('/', (req, res) => res.send('Hello!159311.'))
// app.get('/', (req, res) => {
//     res.send('Hello World!!')
// })

// bugs API

app.get('/api/bug', (req, res) => {
    const { txt, severity, labels, page
    } = req.query
    const filter = { txt: txt || '', severity: severity || 0, labels, page: page || 0 }

    bugService.query(filter)
        .then(bugs => res.send(bugs)
        )
        .catch((err) => {
            console.log('OOPS: ', err)
            res.status(400).send('Could not load bugs')
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const { _id, title, description, severity, createdAt } = req.body

    const bug = { _id, title, description, severity, createdAt }

    bugService.save(bug)
        .then(savedBug => {
            console.log('savedBug', savedBug)
            res.send(savedBug)
        })
        .catch(err => {
            res.status(400).send('Could not save the bug')
        })
})

app.post('/api/bug', (req, res) => {
    const { title, description, severity } = req.body

    const bug = { title, description, severity }

    bugService.save(bug)
        .then(savedBug => {
            console.log('savedBug', savedBug)
            res.send(savedBug)
        })
        .catch(err => {
            res.status(400).send('Could not save the bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            console.log('OOPS: ', err)
            res.status(400).send('Could not load bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send('Bug was deleted successfully'))
        .catch((err) => {
            console.log('OOPS: ', err)
            res.status(400).send('Could not delete bug')
        })
})

// Users

app.get('/api/user', (req, res) => {

    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load users')
        })

})

app.put('/api/user/:userId', (req, res) => {
    const { _id, username, fullname, password } = req.body
    const user = { _id, username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.post('/api/user', (req, res) => {
    const { username, fullname, password } = req.body
    const user = { username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load user')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.remove(userId)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove user')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout')
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})
