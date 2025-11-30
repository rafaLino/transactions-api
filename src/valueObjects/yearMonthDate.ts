import { UTCDate } from '@date-fns/utc'
import { z } from 'zod'

export const YearMonthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)
export type TYearMonth = z.infer<typeof YearMonthSchema>

export class YearMonthDate {
	private date: UTCDate

	constructor(date: TYearMonth) {
		const result = YearMonthSchema.safeParse(date)
		if (!result.success) throw Error(result.error.message)

		this.date = new UTCDate(result.data)
	}

	static New(date: YearMonthDate) {
		const dateString = date.toString()
		return new YearMonthDate(dateString)
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
