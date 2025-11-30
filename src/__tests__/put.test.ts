import { test } from 'vitest'
import { buildApp } from '@/app'
import { clearCollection, parseError, seed } from '@/config/test.helper'

test('should update a transaction successfully', async (t) => {
	const app = await buildApp()

	await seed({
		date: '2025-11',
		items: [
			{
				name: 'test',
				value: 100,
				persist: false
			}
		]
	})

	const item = {
		date: '2025-11',
		items: [
			{
				name: 'changed name',
				value: 20,
				persist: false
			}
		]
	}

	const response = await app.inject({
		method: 'PUT',
		url: '/transactions',
		body: item
	})

	t.expect(response.statusCode).toBe(204)

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})

test('should not update given a not found transaction', async (t) => {
	const app = await buildApp()

	const item = {
		date: '2025-11',
		items: [
			{
				name: 'not found name',
				value: 20,
				persist: false
			}
		]
	}

	const response = await app.inject({
		method: 'PUT',
		url: '/transactions',
		body: item
	})

	t.expect(response.statusCode).toBe(404)

	const result = parseError(response.body)

	t.expect(result).toBeDefined()
	t.expect(result.message).toBe('Transaction not found')

	t.onTestFinished(async () => {
		app.close()
	})
})
