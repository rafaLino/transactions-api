import { test, vi } from 'vitest'
import { buildApp } from '@/app'
import { seed } from '@/config/test.helper'

vi.mock('@/repository/bucket', () => ({
	Bucket: {
		remove: vi.fn(() => ({ statusCode: 204 }))
	}
}))

test('should delete a file successfully', async (t) => {
	const app = await buildApp()

	const date = '2025-11'
	await seed({
		ref: date
	})

	const response = await app.inject({
		method: 'DELETE',
		url: `/files/${date}`
	})

	t.expect(response.statusCode).toBe(204)

	t.onTestFinished(() => {
		app.close()
	})
})

test('should not delete given a not found file', async (t) => {
	const app = await buildApp()
	const date = '2025-11'

	const response = await app.inject({
		method: 'DELETE',
		url: `/files/${date}`
	})

	t.expect(response.statusCode).toBe(404)

	t.onTestFinished(() => {
		app.close()
	})
})
