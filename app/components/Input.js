import React from 'react'
import styles from 'stylesheets/components/Input.scss'

export default class Input extends React.Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};
		this.submit = this.submit.bind(this);
		this.change = this.change.bind(this);
	}
	change(ev) {
		this.setState({value: ev.target.value});
		this.props.changedAction(ev.target.value);
		ev.preventDefault();
	}
	submit(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		this.props.submittedAction(this.state.value);
	}
	render() {
		return (
			<form onSubmit={this.submit}>
				<div className="form-group">
					<label htmlFor="todo">This Week's Todo List</label>
					<textarea id="todo" className={`form-control`} rows="20" onChange={this.change} placeholder={`M: 
T: 
W: 
R: 
F: 
S: 
U: `}>	
					</textarea>
				</div>
				<div className="form-group">
					<input className='btn btn-primary' type="submit"/>
				</div>
			</form>
		);
	}
}