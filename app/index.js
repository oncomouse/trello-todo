import {AppContainer} from 'react-hot-loader'
import ReactDOM from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import configStore from 'store/configStore'
import App from 'containers/App'
import DevTools from 'containers/DevTools'
import 'stylesheets/global.scss'
import jQuery from 'jquery'
import {API_KEY} from 'constants/Config'

// Load Trello API:
window.jQuery = jQuery;
const script = document.createElement('script');
script.src = `https://api.trello.com/1/client.js?key=${API_KEY}`;
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

const output = document.getElementById('react');

// Wait for Trello to load:
const wait = setInterval(() => {
	if(typeof window.Trello !== 'undefined') {
		clearInterval(wait);
		window.Trello.authorize({
			type: 'popup',
			name: 'Getting Started Application',
			scope: {
				read: 'true',
				write: 'true' },
			expiration: 'never',
			success: () => {
				const store = configStore();

				// React Hot Loading!
				const render = Component => ReactDOM.render(
					<Provider store={store}>
						<AppContainer>
							<div>
								<Component/>
								{process.env.NODE_ENV === 'production' ? null : <DevTools/>}
							</div>
						</AppContainer>
					</Provider>
				, output);
				render(App);
				if (module.hot) module.hot.accept(['containers/App', 'containers/DevTools'], () => render(App));
			},
			error: () => {
				ReactDom.render(
					<div className="container"><div className="row"><div className="col-md-6 center-block"><h1>Error! You did not login successfully!</h1>
					<p>Please reload and try again.</p></div></div></div>
				, output)
			}
		});
	}
}, 100);