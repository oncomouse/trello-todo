import {Record} from 'immutable'
import {HOME_LABEL_NAME} from '../constants/Config'
import chrono from 'chrono-node'

export default class Card extends Record({name: '', desc: '', idLabels: '', idList: null, label: HOME_LABEL_NAME, due: chrono.parseDate('next week'), times: 1}) {}