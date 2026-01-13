const files = {
	INSERT_ONE: 'INSERT INTO files (ref) VALUES (?)',
	GET_ALL: 'SELECT * FROM files',
	GET_ONE: 'SELECT * FROM files WHERE ref = (?)',
	DELETE_ONE: 'DELETE FROM files WHERE ref = (?)'
}

const bills = {
	INSERT_ONE: 'INSERT INTO bills (id, title, amount, tags) values (?, ?, ?, ?)',
	UPDATE_ONE: 'UPDATE bills SET title = ?, amount = ?, tags = ? WHERE id = ?',
	GET_ALL: 'SELECT * FROM bills',
	DELETE_ONE: 'DELETE FROM bills WHERE id = (?)'
}

const users = {
	INSERT_ONE: 'INSERT INTO users (name, amount) values (?, ?)',
	UPDATE_ONE: 'UPDATE users SET amount = ? WHERE id = ?',
	GET_ALL: 'SELECT * FROM users',
	DELETE_ONE: 'DELETE FROM users WHERE id = ?'
}

export const SQL = {
	files,
	bills,
	users
}
