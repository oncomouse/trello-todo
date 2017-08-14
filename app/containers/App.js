import React from 'react'
import R from 'ramda'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Map} from 'immutable'
import * as InputActions from 'actions/inputActions'
import Input from 'components/Input'
import Feedback from 'components/Feedback'
import UpdateThing from 'components/Update'

const mapStateToProps = (state, ownProps) => ({
	json: state.get('Input').get('json'),
	error: state.get('Input').get('error'),
	submitted: state.get('Input').get('submitted'),
	count: state.get('Input').get('count')
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	actions: R.mergeAll([
		bindActionCreators(InputActions, dispatch)
	])
})

class App extends React.Component {
	constructor(props) {
		super(props);
	}
	static defaultProps = {
		json: null,
		submitted: false,
		error: false
	}
	static propTypes = {
		actions: PropTypes.objectOf(PropTypes.func).isRequired
	}
	render() {
		return(
			<div className="container">
				<UpdateThing count={this.props.count} submitted={this.props.submitted}/>
				<div className="row">
					<div className="col-md-8 center-block page-header">
						<h1>Trello Todo List</h1>
					</div>
				</div>
				<div className="row">
					<div className="col-md-10 center-block">
						<Feedback error={this.props.error} submitted={this.props.submitted}/>
					</div>
				</div>
				<div className="row">
					<div className="col-md-8 center-block">
						<Input changedAction={this.props.actions.changedAction} submittedAction={this.props.actions.submittedAction}/>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);