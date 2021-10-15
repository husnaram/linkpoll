export const ApiCreatedResponseSchema = (desc: string) => {
	return {
		description: desc,
		schema: {
			type: 'object',
			properties: {
				code: { type: 'number' },
				status: { type: 'string' },
				data: { type: 'UserEntity' },
			},
			example: {
				code: 201,
				status: "success",
				data: {
					"username": "werty",
					"email": "contact@werty.com",
					"profile_color": null,
					"avatar_filename": null,
					"id": 4,
					"created_at": "2021-10-15T02:03:41.695Z",
					"updated_at": "2021-10-15T02:03:41.695Z"
				}
			},
		},
	}
}