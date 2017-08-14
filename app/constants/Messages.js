export const SUCCESS = (cards) => `Added ${cards} card${cards === 1 ? '' : 's'} to your Todo List`
export const FAILURE = (error) => `There is an error with your todo list:

<pre><code>${error}</code></pre>`