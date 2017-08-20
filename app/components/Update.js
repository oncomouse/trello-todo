import React from 'react'
import styles from 'stylesheets/components/Update.scss'

export default (props) => (
	<div className={`${props.count !== null ? styles.shown : styles.hidden} bg-primary ${(props.submitted !== false) ? styles.hidden : ''}`}>
		<p><strong>Updating...</strong></p>
		<p>Posted {props.count} card{props.count === 1 ? '' : 's'}.</p>
	</div>
)