export default function buildEditTodo({ dataAccess }) {
	return function editTodo(todo) {
		if (todo) {
			const exists = dataAccess.findById(todo.getId())
			if (!exists) return null

			return dataAccess.edit({
				author: todo.getAuthor(),
				date: todo.getDate(),
				id: todo.getId(),
				title: todo.getText()
			})
		}
	}
}