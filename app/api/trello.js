import {API_KEY} from 'constants/Config'

const statusHelper = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}
const fetchify = (url, args={}) => {
	return fetch(url,args)
		  .then(statusHelper)
	      .then(response => response.json())
}

export const boards = () => fetchify(`https://api.trello.com/1/members/me/boards?fields=name,id&key=${API_KEY}&token=${window.Trello.token()}`)
export const lists = (boardId) => fetchify(`https://api.trello.com/1/boards/${boardId}/lists?fields=name,id&key=${API_KEY}&token=${window.Trello.token()}`)
export const labels = (boardId) => fetchify(`https://api.trello.com/1/boards/${boardId}/labels?fields=name,id&key=${API_KEY}&token=${window.Trello.token()}`)
export const addCard = card => {
	if(card.get('idList') === null) {
		return Promise.reject('Invalid idList supplied to Trello API.')
	}
	if(card.get('idLabels') instanceof Array) {
		card = card.update('idLabels', x=>x.join(','));
	}
	//return Promise.reject('Invalid idList supplied to Trello API.')
	return fetchify(`https://api.trello.com/1/cards?idList=${encodeURI(card.get('idList'))}&idLabels=${encodeURI(card.get('idLabels'))}&name=${encodeURI(card.get('name'))}&due=${encodeURI(card.get('due'))}&desc=${encodeURI(card.get('desc'))}&key=${API_KEY}&token=${window.Trello.token()}`, {method: 'POST'});
}
