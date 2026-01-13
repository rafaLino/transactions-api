import { type Client, createClient } from '@libsql/client'
import type { TFileRef } from '@/models/fileRef'
import { SQL } from '@/repository/queries'

declare global {
	var dbConnection: Client
}

async function createConnection() {
	console.info('get connection...')
	if (!process.env.DB_URI) {
		console.info('DB_URI not defined!')
		return
	}

	globalThis.dbConnection ??= createClient({
		url: process.env.DB_URI
	})
}

export async function createTable() {
	await createConnection()
	return globalThis.dbConnection.execute(`
		CREATE TABLE IF NOT EXISTS files (
			ref TEXT PRIMARY KEY,
			created_at TEXT DEFAULT current_timestamp
	)`)
}

export async function seed(value: TFileRef) {
	await createConnection()
	await globalThis.dbConnection.execute({
		sql: SQL.files.INSERT_ONE,
		args: [value.ref]
	})

	console.info('seeded! ', value)
}

export async function clearCollection() {
	await createConnection()
	await globalThis.dbConnection.execute(`
		  DELETE FROM files
		`)

	console.info('cleared!')
}

export function parseBody<T = object>(body: string): T {
	return JSON.parse(body)
}

export function parseError(body: string): { message: string } {
	return JSON.parse(body)
}
