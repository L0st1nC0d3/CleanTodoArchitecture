export default function buildMakeDB({ filePath, fs }) {
	return function makeDB() {
		if (!filePath || filePath === '') {
			throw new Error('A valid path must be set')
		}
		if (!fs || typeof(fs) !== 'object') {
			throw new Error('A valid filesystem object handler must be provided')
		}

		let jsonContent = []

		const content = () => {
			if (jsonContent.length === 0) {
				const rawData = fs.readFileSync(filePath)
				jsonContent = JSON.parse(rawData)
			}
			
			return jsonContent
		}

		const edit = (todo) => {
			if (!todo) {
				throw new Error('The todo item must have been provided')
			}
			const oldOne = content().filter(p => p.id === todo.id)[0]
			oldOne.date = todo.date
			oldOne.title = todo.title
			const index = content().findIndex(p => p.id === todo.id)
			const updatedContent = Object.assign([], content())
			updatedContent.splice(index, 1)
			updatedContent.push(oldOne)
			const newContent = JSON.stringify(updatedContent)
			try {
				fs.writeFileSync(filePath, newContent)
				return todo
			} catch (error) {
				console.log(error)
				return null
			}
		}

		const insert = (newTodo) => {
			if (!newTodo) {
				throw new Error('You must provide a todo item')
			}
			const updatedContent = Object.assign([], content())
			updatedContent.push(newTodo)
			const newRawData = JSON.stringify(updatedContent)
			try {
				fs.writeFileSync(filePath, newRawData)
				return newTodo
			} catch (error) {
				console.log(error)
				return null
			}
		}

		const remove = (todoId) => {
			if (!todoId) {
				throw new Error('An item id must be provided')
			}
			const index = content().findIndex(p => p.id === todoId)
			const updatedContent = Object.assign([], content())
			updatedContent.splice(index, 1)
			const newContent = JSON.stringify(updatedContent)
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

		return Object.freeze({
			content: content,
			edit: edit,
			insert: insert,
			delete: remove
		})
	}
}
