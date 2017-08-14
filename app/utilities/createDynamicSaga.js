import {take, fork, cancel, all} from 'redux-saga/effects'

export const START_SAGAS = Symbol('START_SAGAS');
export function createDynamicSaga (changeActionType, startingSagas) {
  function* _start (sagas) {
    try {
		yield all(sagas)
    } catch (e) {
      console.error('error', e)
    }
  }
  return function* dynamicSaga () {
    let action
    let rootTask = yield fork(_start, startingSagas)
    while (action = yield take(changeActionType)) {
      yield cancel(rootTask)
      rootTask = yield fork(_start, action.sagas)
    }
  }
}