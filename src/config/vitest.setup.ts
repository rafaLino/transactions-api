import { afterAll, beforeAll } from 'vitest'
import { clearCollection } from './test.helper'

beforeAll(() => {
	process.env.MODE = 'TEST'
	process.env.DB_URI = `file:sqlite.db`
	process.env.DB_TOKEN = 'test'
	process.env.ALLOWED_ORIGIN = '*'
})

afterAll(async () => {
	await clearCollection()
})
