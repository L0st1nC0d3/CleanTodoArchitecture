export default function buildMakeTodo({ Author, CreationDate, Id, Text }) {
    return function makeTodo({
            author = Author,
            date = CreationDate,
            id = Id,
            text = Text
        } = {}) {
        if (!author) {
            throw new Error("An author must be set.")
        }
        if (author.length < 2) {
            throw new Error("Author name must be longer than 2 characters.")
        }
        if (!date) {
            throw new Error("Date must be valid.")
        }
        if (!id || id === '') {
            throw new Error("Id must be valid.")
        }
        if (!text || text === '') {
            throw new Error("Text must be valid.")
        }

        return Object.freeze({
            getAuthor: () => author,
            getDate: () => date,
            getId: () => id,
            getText: () => text,
            isExpired: () => false
        })
    }
}
