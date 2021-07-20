export default function buildFileSystemDataAccess({ makeDB }) {
	return function fileSystemDataAccess() {

		return Object.freeze({
			delete: (todoId) => {
				const db = makeDB()
				return db.delete(todoId)
			},
			insert: (newTodo) => {
				const db = makeDB()
				return db.insert(newTodo)
			},
			edit: (editTodo) => {
				const db = makeDB()
				return db.edit(editTodo)
			},
			getAllContent: () => {
				const db = makeDB()
				return db.content
			},
			getFirstElement: () => {
				const db = makeDB()
				return db.content[0]
			},
			getLastElement: () => {
				const db = makeDB()
				db.content[db.content.length - 1]
			},
			findByAuthor: (author) => {
				const db = makeDB()
				const found = db.content.filter(p => p.author === author)
				return found.length > 0 ? found : null
			},
			findById: (id) => {
				const db = makeDB()
				const found = db.content.filter(p => p.id === id)
				return found.length > 0 ? found : null
			}
		})
	}
}