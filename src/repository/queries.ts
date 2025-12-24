const INSERT_ONE = 'INSERT INTO files (ref) VALUES (?)'

const GET_ALL = 'SELECT * FROM files'

const GET_ONE = 'SELECT * FROM files WHERE ref = (?)'

const DELETE_ONE = 'DELETE FROM files WHERE ref = (?)'

export const SQL = {
	INSERT_ONE,
	GET_ALL,
	GET_ONE,
	DELETE_ONE
}
