import { test } from 'vitest'
import { buildApp } from '@/app'
import { clearCollection, parseBody, seed } from '@/config/test.helper'

test('should copy transaction successfully', async (t) => {
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
		date: '2025-11'
	}

	const response = await app.inject({
		method: 'POST',
		url: '/transactions/next',
		body: item
	})

	t.expect(response.statusCode).toBe(201)
	t.expect(response.body).toBeDefined()
	const result = parseBody<{ _id: string }>(response.body)

	t.expect(result.date).toBe('2025-12')

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})
