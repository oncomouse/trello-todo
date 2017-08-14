import {UPDATE_ACTION, INPUT_CHANGED_ACTION, INPUT_VALID_ACTION, INPUT_ERROR_ACTION, INPUT_PROCESSED_ACTION, INPUT_SUBMITTED_ACTION} from 'constants/ActionTypes'

export const changedAction = (input) => ({
	type: INPUT_CHANGED_ACTION, 
	payload: {
		input
	}
})
export const submittedAction = (input) => ({
	type: INPUT_SUBMITTED_ACTION,
	payload: {
		input
	}
})
export const validAction = (json) => ({
	type: INPUT_VALID_ACTION,
	payload: {
		json
	}
}) 
export const errorAction = (error) => ({
	type: INPUT_ERROR_ACTION,
	payload: {
		error
	}
})
export const processedAction = (message) => ({
	type: INPUT_PROCESSED_ACTION,
	payload: {
		message
	}
})
export const updateAction = (count) => ({
	type: UPDATE_ACTION,
	payload: {
		count
	}
})