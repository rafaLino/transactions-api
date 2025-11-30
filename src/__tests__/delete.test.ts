import { test } from 'vitest'
import { buildApp } from '@/app'
import { clearCollection, seed } from '@/config/test.helper'

test('should delete a transaction successfully', async (t) => {
	const app = await buildApp()

	const date = '2025-11'
	await seed({
		date: date,
		items: [
			{
				name: 'test',
				value: 100,
				persist: false
			}
		]
	})

	const response = await app.inject({
		method: 'DELETE',
		url: `/transactions/${date}`
	})

	t.expect(response.statusCode).toBe(204)

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})

test('should not delete given a not found transaction', async (t) => {
	const app = await buildApp()
	const date = '2025-11'

	const response = await app.inject({
		method: 'DELETE',
		url: `/transactions/${date}`
	})

	t.expect(response.statusCode).toBe(404)

	t.onTestFinished(async () => {
		app.close()
	})
})
