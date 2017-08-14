import {Map} from 'immutable'
import createReducer from 'utilities/createReducer'
import {INPUT_VALID_ACTION, INPUT_ERROR_ACTION, INPUT_PROCESSED_ACTION, UPDATE_ACTION} from 'constants/ActionTypes'
import {REHYDRATE} from 'redux-persist/constants'

const initialState = Map({
	json: null,
	error: false,
	submitted: false,
	count: null
});
const actionMaps = {
	[INPUT_VALID_ACTION]: (state, action) => {
		state = state.set('json', action.payload.json);
		state = state.set('error', false)
		return state;
	},
	[INPUT_ERROR_ACTION]: (state, action) => {
		state = state.set('json', null);
		state = state.set('error', action.payload.error);
		return state;
	},
	[INPUT_PROCESSED_ACTION]: (state,action) => {
		state = state.set('error', false);
		state = state.set('submitted', action.payload.message);
		return state;
	},
	[UPDATE_ACTION]: (state, action) => {
		state = state.set('count', action.payload.count);
		return state;
	}
}

export default createReducer(initialState, actionMaps);