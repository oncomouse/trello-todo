import {takeEvery, put, call, select} from 'redux-saga/effects'
import {INPUT_SUBMITTED_ACTION, INPUT_CHANGED_ACTION} from 'constants/ActionTypes'
import {updateAction, errorAction, processedAction, validAction} from 'actions/inputActions'
import {TODO_BOARD_NAME, TODO_LIST_NAME, RESEARCH_LABEL_NAME, FUN_LABEL_NAME, TEACHING_LABEL_NAME, SERVICE_LABEL_NAME, HOME_LABEL_NAME} from 'constants/Config'
import {SUCCESS, FAILURE} from 'constants/Messages'
import * as API from 'api/trello'
import R from 'ramda'
import Card from 'models/Card'
import parser from 'utilities/parser'

function* inputSubmittedSaga(action) {
	// Check that state is not in an input error:
	// If not, send object to API and signal a successful processing:
	const submitted = yield select(state => state.get('Input').get('submitted'));
	let error = false;
	if(submitted !== false) {
		yield put(errorAction(`You are attempting to submit again, after having already created the actions you need for the week.`));
		error = true;
	}
	if(error === false) {
		try {
			parser(action.payload.input);
		} catch(e) {
			error = e;
		}
	}
	if(error === false) {
		const json = yield select(state => state.get('Input').get('json'));
		if(json !== null && json.size > 0) {
			// Do Trello Stuff:
			const boards = yield call(API.boards);
			const boardId = R.filter(R.propEq('name', TODO_BOARD_NAME), boards)[0].id;
			const lists = yield call(API.lists, boardId);
			const labels = yield call(API.labels, boardId);
			const idList = R.filter(R.propEq('name', TODO_LIST_NAME), lists)[0].id;
			const labelIDs = {
				[RESEARCH_LABEL_NAME]: R.filter(R.propEq('name', RESEARCH_LABEL_NAME), labels)[0].id,
				[FUN_LABEL_NAME]: R.filter(R.propEq('name', FUN_LABEL_NAME), labels)[0].id,
				[TEACHING_LABEL_NAME]: R.filter(R.propEq('name', TEACHING_LABEL_NAME), labels)[0].id,
				[SERVICE_LABEL_NAME]: R.filter(R.propEq('name', SERVICE_LABEL_NAME), labels)[0].id,
				[HOME_LABEL_NAME]: R.filter(R.propEq('name', HOME_LABEL_NAME), labels)[0].id
			}
			let count = 0;
			const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday2'];
			for(let i = 0; i < week.length; i++) {
				const day = week[i];
				const dayTodoList = json.get(day);
				for(let i = 0; i < dayTodoList.size; i++) {
					const item = dayTodoList.get(i);
					
					const card = item.set('idLabels', labelIDs[item.get('label')]).set('idList', idList);
					//console.log(`Adding a card due ${card.get('due')}`)
					yield put(updateAction(count))
					yield call(API.addCard, card);
					
					count++;
				}
			}
			yield put(processedAction(SUCCESS(count)));
		}
	}
}

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
	yield takeEvery(INPUT_SUBMITTED_ACTION, inputSubmittedSaga);
	yield takeEvery(INPUT_CHANGED_ACTION, inputChangedSaga)
}