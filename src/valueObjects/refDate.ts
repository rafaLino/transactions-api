import { UTCDate } from '@date-fns/utc'
import { z } from 'zod'

export const RefDateSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)
export type TYearMonth = z.infer<typeof RefDateSchema>

export class RefDate {
	private readonly date: UTCDate

	constructor(date: TYearMonth) {
		const result = RefDateSchema.safeParse(date)
		if (!result.success) throw new Error(result.error.message)

		this.date = new UTCDate(result.data)
	}

	static Copy(date: RefDate) {
		const dateString = date.toString()
		return new RefDate(dateString)
	}

	increaseMonth() {
		this.date.setMonth(this.date.getMonth() + 1, 1)
	}

	decreaseMonth() {
		this.date.setMonth(this.date.getMonth() - 1, 1)
	}

	toString() {
		return this.date.toISOString().slice(0, 7)
	}

	toLocaleString(type?: 'iso' | 'string') {
		if (type === 'iso') return this.toISOString()

		return this.toString()
	}

	toISOString() {
		return this.date.toISOString()
	}
}
