export default function buildDeleteTodo({ dataAccess }) {
	return function deleteTodo(todoId) {
		if (!todoId || todoId === '') {
			throw new Error('Todo id must be provided')
		}

		const exists = dataAccess.findById(todoId)
		if (!exists) return Object.freeze({
			message: 'Nothing to delete'
		})

		return dataAccess.delete(todoId)
	}
}