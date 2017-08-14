import React from 'react'
import styles from 'stylesheets/components/Update.scss'

export default (props) => (
	<div className={`${props.count !== null ? styles.shown : styles.hidden} bg-primary ${(props.submitted !== false) ? styles.hidden : ''}`}>
		<p><strong>Updating...</strong></p>
		<p>Posted {props.count} {props.count === 1 ? 'story' : 'stories'}.</p>
	</div>
)