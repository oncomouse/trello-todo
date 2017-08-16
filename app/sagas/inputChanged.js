import {put, takeEvery} from 'redux-saga/effects'
import {INPUT_CHANGED_ACTION} from 'constants/ActionTypes'
import parser from 'utilities/parser'
import {validAction, errorAction} from 'actions/inputActions'
import {FAILURE} from 'constants/Messages'

function* inputChangedSaga(action) {
	let json = {};
	let error = null;
	try {
		json = parser(action.payload.input);
	} catch(e) {
		error = e;
	}
	if(error === null && Object.keys(json).length === 0) {
		error = 'Invalid ToDo List Format';
	}
	if (error !== null) {
		yield put(errorAction(FAILURE(error)));
	} else {
		yield put(validAction(json));
	}
}

export default function* observeInput() {
	yield takeEvery(INPUT_CHANGED_ACTION, inputChangedSaga)
}