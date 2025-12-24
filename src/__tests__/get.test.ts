import { test } from 'vitest'
import { buildApp } from '@/app'
import { clearCollection, parseBody, seed } from '@/config/test.helper'
import type { TFileRef } from '@/models/fileRef'

test('should return a file successfully', async (t) => {
	const app = await buildApp()
	const item: TFileRef = {
		ref: '2025-11'
	}
	await seed(item)

	const response = await app.inject({
		method: 'GET',
		url: '/files/2025-11'
	})

	t.expect(response.statusCode).toBe(200)

	t.expect(response.body).toBeDefined()
	const result = parseBody<TFileRef & { created_at: string }>(response.body)

	t.expect(result.ref).toBeDefined()
	t.expect(result.created_at).toBeDefined()

	t.expect(result.ref).toEqual(item.ref)

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})

test('should return not found when not found file', async (t) => {
	const app = await buildApp()

	const response = await app.inject({
		method: 'GET',
		url: '/files/2025-11'
	})

	t.expect(response.statusCode).toBe(404)
	t.onTestFinished(() => app.close())
})

test('should return internal error given a bad date', async (t) => {
	const app = await buildApp()

	const response = await app.inject({
		method: 'GET',
		url: '/files/something-weird'
	})

	t.expect(response.statusCode).toBe(400)

	t.onTestFinished(() => app.close())
})

test('should return all files successfully', async (t) => {
	const app = await buildApp()
	const item: TFileRef = {
		ref: '2025-11'
	}
	await seed(item)

	const response = await app.inject({
		method: 'GET',
		url: '/files'
	})

	t.expect(response.statusCode).toBe(200)

	t.expect(response.body).toBeDefined()
	const results = parseBody<Array<TFileRef & { created_at: string }>>(
		response.body
	)

	t.expect(results).toBeDefined()

	t.expect(results).toHaveLength(1)

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})
