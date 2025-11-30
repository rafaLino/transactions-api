import { test } from 'vitest'
import { buildApp } from '@/app'
import {
	clearCollection,
	parseBody,
	parseError,
	seed
} from '@/config/test.helper'
import type { ITransaction } from '@/interfaces'

test('should return a transaction successfully', async (t) => {
	const app = await buildApp()
	const item: ITransaction = {
		date: '2025-11',
		items: [
			{
				name: 'test',
				value: 100,
				persist: false
			}
		]
	}
	await seed(item)

	const response = await app.inject({
		method: 'GET',
		url: '/transactions/2025-11'
	})

	t.expect(response.statusCode).toBe(200)

	t.expect(response.body).toBeDefined()
	const result = parseBody<{ total: number }>(response.body)

	t.expect(result.date).toBeDefined()
	t.expect(result.total).toBeDefined()
	t.expect(result.items).toBeDefined()

	t.expect(result.total).toBe(100)
	t.expect(result.date).toEqual(item.date)

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

test('should return not found whem not found transaction', async (t) => {
	const app = await buildApp()

	const response = await app.inject({
		method: 'GET',
		url: '/transactions/2025-11'
	})

	t.expect(response.statusCode).toBe(404)
	t.expect(response.body).toBeDefined()

	const result = parseError(response.body)

	t.expect(result.message).toBe('Transaction not found')

	t.onTestFinished(() => app.close())
})

test('should return internal error given a bad date', async (t) => {
	const app = await buildApp()

	const response = await app.inject({
		method: 'GET',
		url: '/transactions/something-weird'
	})

	t.expect(response.statusCode).toBe(400)

	t.onTestFinished(() => app.close())
})
