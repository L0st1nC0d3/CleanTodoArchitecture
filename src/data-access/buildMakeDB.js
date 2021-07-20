import * as fs from 'fs'

export default function buildMakeDB({ filePath }) {
	return function makeDB() {
		if (!filePath || filePath === '') {
			throw new Error('A valid path must be set')
		}

		const rawData = fs.readFileSync(filePath)
		const jsonContent = JSON.parse(rawData)

		return Object.freeze({
			content: jsonContent,
			edit: (todo) => {
				const oldOne = jsonContent.filter(p => p.id === todo.id)[0]
				oldOne.date = todo.date
				oldOne.title = todo.title
				const index = jsonContent.findIndex(p => p.id === todo.id)
				jsonContent.splice(index, 1)
				jsonContent.push(oldOne)
				const newContent = JSON.stringify(jsonContent)
				try {
					fs.writeFileSync(filePath, newContent)
					return todo
				} catch (error) {
					console.log(error)
					return null
				}
			},
			insert: (newTodo) => {
				jsonContent.push(newTodo)
				const newRawData = JSON.stringify(jsonContent)
				try {
					fs.writeFileSync(filePath, newRawData)
					return newTodo
				} catch (error) {
					console.log(error)
					return null
				}
			},
			delete: (todoId) => {
				const index = jsonContent.findIndex(p => p.id === todoId)
				jsonContent.splice(index, 1)
				const newContent = JSON.stringify(jsonContent)
				try {
					fs.writeFileSync(filePath, newContent)
					return Object.freeze({
						message: `Deleted todo with ID ${todoId}`
					})
				} catch (error) {
					console.log(error)
					return null
				}
			}
		})
	}
}
