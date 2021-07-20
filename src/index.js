import path from 'path'
import bodyParser from 'body-parser'
import express from 'express'
import * as fs from 'fs'

import buildMakeTodo from './entities/todo.js'
import buildAddTodo from './use-cases/buildAddTodo.js'
import buildDeleteTodo from './use-cases/buildDeleteTodo.js'
import buildEditTodo from './use-cases/buildEditTodo.js'
import buildFileSystemDataAccess from './data-access/fileSystemDataAccess.js'
import buildMakeDB from './data-access/buildMakeDB.js'

export default function TodoApp() {
    const filePath = path.resolve(path.resolve(), 'src/repository/todos.json')
    const makeDb = buildMakeDB({ filePath: filePath, fs: fs })
    const fileSystemDataAccess = buildFileSystemDataAccess({ makeDB: makeDb })
    const dataAccess = fileSystemDataAccess()
    const port = 3670
    const app = express()

    app.use(bodyParser.json())

    app.get('/', (req, res) => {
        res.send(dataAccess.getAllContent())
    })

    app.post('/add', (req, res) => {
        const id = `Id${Math.random() * 10}`
        const makeTodo = buildMakeTodo({ Author: req.body.author, CreationDate: req.body.date, Text: req.body.text, Id: id })
        const newTodo = makeTodo()
        const addTodo = buildAddTodo({ dataAccess: dataAccess })
        res.send(addTodo(newTodo))
    })

    app.patch('/edit/:id', (req, res) => {
        const id = req.params.id
        const makeTodo = buildMakeTodo({ Author: req.body.author, CreationDate: req.body.date, Id: id, Text: req.body.text })
        const editedTodo = makeTodo()
        const editTodo = buildEditTodo({ dataAccess: dataAccess })
        res.send(editTodo(editedTodo))
    })

    app.delete('/delete/:id', (req, res) => {
        const id = req.params.id
        const deleteTodo = buildDeleteTodo({ dataAccess: dataAccess })
        res.send(deleteTodo(id))
    })

    app.listen(port, () => {
        console.log('Started on port ' + port)
    })
}

TodoApp()
