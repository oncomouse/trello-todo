import inputSubmittedSaga from 'sagas/inputSubmitted'
import inputChangedSaga from 'sagas/inputChanged'

export default () => [
	inputSubmittedSaga(),
	inputChangedSaga()
]