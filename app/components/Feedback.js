import React from 'react'
import styles from 'stylesheets/components/Feedback.scss'

export default (props) => (
	<div>
		<div className={`${props.submitted !== false ? 'bg-primary' : styles.hidden} ${styles.output} text-white`}>
			<p dangerouslySetInnerHTML={{__html: props.submitted !== false ? props.submitted : ''}}/>
		</div>
		<div className={`${props.error !== false ? 'bg-danger' : styles.hidden} ${styles.output} text-white`}>
			<p dangerouslySetInnerHTML={{__html: props.error !== false ? props.error : ''}}/>
		</div>
	</div>
)