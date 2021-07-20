export default function buildAddTodo({ dataAccess }) {
	return function addTodo(newTodo) {
		if (newTodo) {
			const exists = dataAccess.findById(newTodo.getId())
			if (exists) return exists

			return dataAccess.insert({
				author: newTodo.getAuthor(),
				date: newTodo.getDate(),
				id: newTodo.getId(),
				title: newTodo.getText()
			})
		}
	}
}
