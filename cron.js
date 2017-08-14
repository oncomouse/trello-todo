/*****
  This script takes a Trello Board and a Lists on that board that, at
  execution time, need to have their dueComplete fields marked "true".

  I use this script to mark as done the items I have moved to my done lists
  so that they do not show up as past due each morning.

  Cron script to run is:
    0 0 * * * cd WORKING_DIR; npm run cron > /dev/null 2>&1
*/
const R = require('ramda');
const fetch = require('isomorphic-fetch');
const {API_TOKEN, API_KEY} = require('./cronAuth');

const TODO_BOARD_NAME = 'To Do List';
const DONE_LISTS = ['Done (Day)', 'Done (Week)'];

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

const boards = () => fetchify(`https://api.trello.com/1/members/me/boards?fields=name,id&key=${API_KEY}&token=${API_TOKEN}`)
const lists = (boardId) => fetchify(`https://api.trello.com/1/boards/${boardId}/lists?fields=name,id&key=${API_KEY}&token=${API_TOKEN}`)
const cards = (listId) => fetchify(`https://api.trello.com/1/lists/${listId}/cards?fields=id&key=${API_KEY}&token=${API_TOKEN}`)
const updateCard = (cardId) => fetchify(`https://api.trello.com/1/cards/${cardId}?dueComplete=true&key=${API_KEY}&token=${API_TOKEN}`, {method: 'PUT'});

boards().then(boards => {
	const boardId = R.filter(R.propEq('name', TODO_BOARD_NAME), boards)[0].id;
	lists(boardId).then(lists => {
		const listIds = R.compose(
			R.pluck('id'),
			R.filter(item => R.contains(R.prop('name', item), DONE_LISTS))
		)(lists);
		const promises = listIds.map(id => cards(id));
		Promise.all(promises).then(cards => {
			const cardIds = R.compose(
				R.pluck('id'),
				R.flatten
			)(cards)
			const promises = cardIds.map(id => updateCard(id));
			Promise.all(promises).then(() => {
				console.log(`${cardIds.length} card${cardIds.length === 1 ? '' : 's'} updated.`)
			})
		})
	})
})