import { z } from 'zod'
import { YearMonthSchema } from '@/valueObjects/yearMonthDate'

export const BodySchema = z.object({
	date: YearMonthSchema,
	items: z.array(
		z.object({
			name: z.string(),
			value: z.number(),
			persist: z.boolean().optional(),
			installments: z
				.object({
					current: z.number(),
					total: z.number()
				})
				.optional()
		})
	)
})
export const DateParamSchema = z.object({
	date: YearMonthSchema
})

export const IdParamSchema = z.object({
	id: z.string()
})

export const DateBodySchema = z.object({
	date: YearMonthSchema
})
