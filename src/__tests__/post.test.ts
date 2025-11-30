import { test } from 'vitest'
import { buildApp } from '@/app'
import {
	clearCollection,
	parseBody,
	parseError,
	seed
} from '@/config/test.helper'

test('should create a transaction successfully', async (t) => {
	const app = await buildApp()
	const item = {
		date: '2025-11',
		items: [
			{
				name: 'test',
				value: 100,
				persist: false
			}
		]
	}

	const response = await app.inject({
		method: 'POST',
		url: '/transactions',
		body: item
	})

	t.expect(response.statusCode).toBe(201)
	t.expect(response.body).toBeDefined()
	const result = parseBody<{ _id: string }>(response.body)

	t.expect(result.date).toBeDefined()
	t.expect(result.items).toBeDefined()

	t.expect(result._id).toBeDefined()

	t.expect(result.items).toHaveLength(1)
	const returnedItem = result.items[0]

	t.expect(returnedItem.name).toEqual('test')
	t.expect(returnedItem.value).toEqual(100)
	t.expect(returnedItem.persist).toEqual(false)
	t.expect(returnedItem.installments).toBeUndefined()

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})

test('should not allow create a transaction given the same date', async (t) => {
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
				name: 'some thing',
				value: 20,
				persist: false
			}
		]
	}

	const response = await app.inject({
		method: 'POST',
		url: '/transactions',
		body: item
	})

	t.expect(response.statusCode).toBe(400)
	t.expect(response.body).toBeDefined()

	const result = parseError(response.body)

	t.expect(result).toBeDefined()
	t.expect(result.message).toBe('Already exist transaction with this date')

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})

test('should create and get the correct transaction', async (t) => {
	const app = await buildApp()

	const date = '2025-11'
	const item = {
		date: date,
		items: [
			{
				name: 'test',
				value: 100,
				persist: false
			}
		]
	}

	const postResponse = await app.inject({
		method: 'POST',
		url: '/transactions',
		body: item
	})

	t.expect(postResponse.statusCode).toBe(201)

	const getResponse = await app.inject({
		method: 'GET',
		url: `/transactions/${date}`
	})

	t.expect(getResponse.body).toBeDefined()
	const result = parseBody<{ _id: string }>(getResponse.body)

	t.expect(result).toBeDefined()
	t.expect(result.date).toEqual('2025-11')

	t.onTestFinished(async () => {
		await clearCollection()
		app.close()
	})
})
