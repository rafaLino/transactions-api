import { LibsqlError } from '@libsql/client'

export function GetErrorMessage(error: unknown) {
	if (error instanceof LibsqlError) {
		if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY')
			return 'Already exist a file with this ref'

		return error.message
	}

	return error instanceof Error ? error.message : 'Internal Server Error!'
}
