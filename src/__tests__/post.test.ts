import { test, vi } from 'vitest'
import { buildApp } from '@/app'
import {
	clearCollection,
	parseBody,
	parseError,
	seed
} from '@/config/test.helper'
import type { TFileRef } from '@/models/fileRef'

vi.mock('@/repository/bucket', () => ({
	Bucket: {
		put: vi.fn(() => ({ statusCode: 201, ref: '2025-11' }))
	}
}))

test('should create a file successfully', async (t) => {
	const app = await buildApp()
	const item = {
		ref: '2025-11'
	}

	const formData = new FormData()
	formData.append('ref', item.ref)
	formData.append('csv', 'some csv content')

	const response = await app.inject({
		method: 'POST',
		url: '/files',
		body: formData,
		headers: {
			'content-type': 'multipart/form-data'
		}
	})

	t.expect(response.statusCode).toBe(201)

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})

test('should not allow create a file given the same date', async (t) => {
	const app = await buildApp()

	await seed({
		ref: '2025-11'
	})

	const item = {
		ref: '2025-11'
	}

	const response = await app.inject({
		method: 'POST',
		url: '/files',
		body: item
	})

	t.expect(response.statusCode).toBe(400)
	t.expect(response.body).toBeDefined()

	const result = parseError(response.body)

	t.expect(result).toBeDefined()
	t.expect(result.message).toBe('Already exist a file with this ref')

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})

test('should create and get the correct file', async (t) => {
	const app = await buildApp()

	const date = '2025-11'
	const item = {
		ref: date
	}

	const postResponse = await app.inject({
		method: 'POST',
		url: '/files',
		body: item
	})

	t.expect(postResponse.statusCode).toBe(201)

	const getResponse = await app.inject({
		method: 'GET',
		url: `/files/${date}`
	})

	t.expect(getResponse.body).toBeDefined()
	const result = parseBody<TFileRef>(getResponse.body)

	t.expect(result).toBeDefined()
	t.expect(result.ref).toEqual('2025-11')

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})
