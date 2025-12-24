import { z } from 'zod'
import { RefDateSchema } from '@/valueObjects/refDate'

export const FileRef = z.object({
	ref: RefDateSchema
})

export type TFileRef = z.infer<typeof FileRef>
