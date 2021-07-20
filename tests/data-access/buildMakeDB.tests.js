import buildMakeDB from '../../src/data-access/buildMakeDB.js'

describe('buildMakeDB', () => {
	const fs = {
		readFileSync: (path) => '\[\{"author":"content","id":"fakeId"\}\]',
		writeFileSync: (path, content) => {
			if (path === 'fail') {
				throw new Error('Exception handling writing')
			}
		}
	}

	it('should throw an error if path is not provided', () => {
		try {
			const makeDB = buildMakeDB({})
			makeDB()
			expect(true).toBe(false)
		} catch (error) {
			expect(error).not.toBe(null)
			expect(error.message).toEqual('A valid path must be set')
		}
	})
	it('should throw an error if path is provided as empty string', () => {
		try {
			const makeDB = buildMakeDB({ filePath: '' })
			makeDB()
			expect(true).toBe(false)
		} catch (error) {
			expect(error).not.toBe(null)
			expect(error.message).toEqual('A valid path must be set')
		}
	})
	it('should throw an error if the file system handler is not provided', () => {
		try {
			const makeDB = buildMakeDB({ filePath: 'tst' })
			makeDB()
			expect(true).toBe(false)
		} catch (error) {
			expect(error).not.toBe(null)
			expect(error.message).toEqual('A valid filesystem object handler must be provided')
		}
	})
	it('should throw an error if an invalid file system handler is provided', () => {
		try {
			const makeDB = buildMakeDB({ filePath: 'tst', fs: '' })
			makeDB()
			expect(true).toBe(false)
		} catch (error) {
			expect(error).not.toBe(null)
			expect(error.message).toEqual('A valid filesystem object handler must be provided')
		}
	})
	it('should return an function to build the DB', () => {
		const makeDB = buildMakeDB({ filePath: 'tst', fs: fs })
		expect(makeDB).not.toBe(null)
		expect(typeof(makeDB)).toEqual('function')
	})
	it('should return an object to represent the DB', () => {
		const makeDB = buildMakeDB({ filePath: 'test', fs: fs })
		const db = makeDB()
		expect(db).not.toBe(null)
		expect(typeof(db)).toEqual('object')
	})
	it('should return an object with a specific interface of functions', () => {
		const makeDB = buildMakeDB({ filePath: 'test', fs: fs })
		const db = makeDB()
		expect(db.edit).not.toBe(null)
		expect(typeof(db.edit)).toBe('function')
		expect(db.insert).not.toBe(null)
		expect(typeof(db.insert)).toBe('function')
		expect(db.delete).not.toBe(null)
		expect(typeof(db.delete)).toBe('function')
		expect(db.content).not.toBe(null)
		expect(typeof(db.content)).toBe('function')
	})
	it('should throw an error if I try to add a null todo and the number of items doesn\'t change', () => {
		const makeDB = buildMakeDB({ filePath: 'test', fs: fs })
		const db = makeDB()
		const itemsNumber = db.content().length
		try {
			db.insert(null)
			expect(true).toBe(false)
		} catch (error) {
			expect(error).not.toBe(null)
			expect(error.message).toEqual('You must provide a todo item')
			expect(db.content().length).toEqual(itemsNumber)
		}
	})
	it('should throw an error if I try to edit a todo without providing it', () => {
		const makeDB = buildMakeDB({ filePath: 'test', fs: fs })
		const db = makeDB()
		try {
			db.edit(null)
			expect(true).toBe(false)
		} catch (error) {
			expect(error).not.toBe(null)
			expect(error.message).toEqual('The todo item must have been provided')
		}
	})
	it('should throw an error if I try to delete a todo without provide his owwn id', () => {
		const makeDB = buildMakeDB({ filePath: 'test', fs: fs })
		const db = makeDB()
		try {
			db.delete(null)
			expect(true).toBe(false)
		} catch (error) {
			expect(error).not.toBe(null)
			expect(error.message).toEqual('An item id must be provided')
		}
	})
	it('should add a new item and increase the list count by one', () => {
		const makeDB = buildMakeDB({ filePath: 'test', fs: fs })
		const db = makeDB()
		const itemsNumber = db.content().length
		const inserted = db.insert({ author: '', date: '', id: '', title: '' })
		expect(inserted).not.toBe(null)
		expect(inserted.author).toEqual('')
		expect(db.content().length).toEqual(itemsNumber + 1)
	})
	it('should edit an item if it exists in the db without changing the content count', () => {
		const makeDB = buildMakeDB({ filePath: 'test', fs: fs })
		const db = makeDB()
		const itemsNumber = db.content().length
		const edited = db.edit({ author: '', date: 'new date', id: 'fakeId', title: 'new title' })
		expect(edited).not.toBe(null)
		expect(edited.date).toEqual('new date')
		expect(edited.title).toEqual('new title')
		expect(db.content().length).toEqual(itemsNumber)
	})
	it('should delete an item if it\'s present in the db and will decrease the number of items by one', () => {
		const makeDB = buildMakeDB({ filePath: 'test', fs: fs })
		const db = makeDB()
		const itemsNumber = db.content().length
		const deleted = db.delete('fakeId')
		expect(deleted).not.toBe(null)
		expect(deleted.message).not.toBe(null)
		expect(deleted.message).toEqual('Deleted todo with ID fakeId')
		expect(db.content().length).toEqual(itemsNumber - 1)
	})
	it('should return the content in the db', () => {
		const makeDB = buildMakeDB({ filePath: 'test', fs: fs })
		const db = makeDB()
	})
	it('should return null if an error occoured during insert and preserve the current number of items', () => {
		const makeDB = buildMakeDB({ filePath: 'fail', fs: fs })
		const db = makeDB()
		const itemsNumber = db.content().length
		const inserted = db.insert({ author: '', date: '', id: '', title: '' })
		expect(inserted).toBe(null)
		expect(db.content().length).toEqual(itemsNumber)
	})
	it('should return null if an error occoured during edit', () => {
		const makeDB = buildMakeDB({ filePath: 'fail', fs: fs })
		const db = makeDB()
		const edited = db.edit({ author: '', date: 'new date', id: 'fakeId', title: 'new title' })
		expect(edited).toBe(null)
	})
	it('should return null if an error occoured during delete and preserve the current number of items', () => {
		const makeDB = buildMakeDB({ filePath: 'fail', fs: fs })
		const db = makeDB()
		const itemsNumber = db.content().length
		const deleted = db.delete('fakeId')
		expect(deleted).toBe(null)
		expect(db.content().length).toEqual(itemsNumber)
	})
})
