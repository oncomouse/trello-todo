import {List, Map, Record} from 'immutable'
import {TODO_BOARD_NAME, TODO_LIST_NAME, RESEARCH_LABEL_NAME, FUN_LABEL_NAME, TEACHING_LABEL_NAME, SERVICE_LABEL_NAME, HOME_LABEL_NAME, TWENTY_FOUR_HOUR_TIME} from 'constants/Config'
import R from 'ramda'
import chrono from 'chrono-node'
import Card from 'models/Card'

const log = (...args) => {
	if(process.env.NODE_ENV !== 'production') {
		console.log(args)
	}
}

export default input => {
	let json = Map();
	let currentDay = null;
	let currentActivity = null;
	let seenSunday = false;
	input.split(/\n/g).forEach(line => {
		line = line.replace(/\n/,'')
		let m = null;
		if(m = line.match(/^(U|M|T|W|R|F|S)\:\s*$/)) {
			if(currentDay !== null && currentActivity !== null) {
				R.times(() => json = json.update(currentDay, x => x.push(currentActivity)), currentActivity.get('times'));
			}
			switch(m[1]) {
				case 'U':
					if(!seenSunday) {
						currentDay = 'sunday';
						seenSunday = true;
					} else {
						currentDay = 'sunday2';
					}
					break;
				case 'M':
					currentDay = 'monday';
					break;
				case 'T':
					currentDay = 'tuesday';
					break;
				case 'W':
					currentDay = 'wednesday';
					break;
				case 'R':
					currentDay = 'thursday';
					break;
				case 'F':
					currentDay = 'friday';
					break;
				case 'S':
					currentDay = 'saturday';
					break;
			}
			currentActivity = null;
			json = json.set(currentDay, List());
		} else if(line.match(/^-/)) {
			// Attach Previous Activity:
			if(currentActivity !== null) {
				R.times(() => json = json.update(currentDay, x => x.push(currentActivity)), currentActivity.get('times'));
			}
			// Figure out activity
			currentActivity = new Card();
			line = line.replace(/^-\s+/,'');
			let [,,label,name,,times] = line.match(/^((Writing|Fun|Research|Reading|Home|Teaching|Service)\:){0,1}\s*(.*?)(\ \(([0-9]+)\)){0,1}$/);
			log(label, name, times);
			// Hack because "Writing: (3)" does not produce label = "Writing", name = "", and times = 3 as it should
			if(times === undefined && name.match(/\([0-9]\)/) !== null) {
				times = parseInt(name.replace(/[()]/g,''));
				name = '';
			}
			let time = 'at 11:59PM';
			if (m = name.match(/ at ([0-9:]+)(am|pm){0,1}/i)) {
				let amOrPm = m[2];
				if (!TWENTY_FOUR_HOUR_TIME) {
					const hour = parseInt(m[1].slice(0,2));
					if(amOrPm === undefined) {
						if(hour > 7 && hour < 12) {
							amOrPm = 'am'
						} else {
							amOrPm = 'pm'
						}
					}
				}
				time = `at ${m[1]}${amOrPm}`
			}
			
			let chronoPass = `this ${currentDay} ${time}`;
			if(currentDay === 'sunday') {
				chronoPass = `today ${time}`
			} else if(currentDay === 'sunday2') {
				chronoPass = `next sunday ${time}`;
			}
			currentActivity = currentActivity.set('due', chrono.parseDate(chronoPass));
			
			currentActivity = currentActivity.set('name', name);
			if(typeof times !== 'undefined') {
				currentActivity = currentActivity.set('times', parseInt(times))
			}
			
			if(label === 'Research' || label === 'Writing' || label === 'Reading') {
				currentActivity = currentActivity.set('name', `${label} Sprint (45 Minutes)`);
				if(name !== '') {
					currentActivity = currentActivity.set('desc', `- ${name}\n`);
				}
			}
			
			// Handle Label:
			if(name.match(/weekly meeting/i)) {
				currentActivity = currentActivity.set('label', HOME_LABEL_NAME);
			} else if(name.match(/meeting/i)) {
				currentActivity = currentActivity.set('label', SERVICE_LABEL_NAME);
			} else if(name.match(/(title|course prep|class prep)/i)) {
				currentActivity = currentActivity.set('label', TEACHING_LABEL_NAME);
			} else if(typeof label !== undefined) {
				switch(label) {
					case 'Research':
					case 'Writing':
					case 'Reading':
						currentActivity = currentActivity.set('label', RESEARCH_LABEL_NAME);
						break;
					case 'Home':
						currentActivity = currentActivity.set('label', HOME_LABEL_NAME);
						break;
					case 'Teaching':
						currentActivity = currentActivity.set('label', TEACHING_LABEL_NAME);
						break;
						FUN_LABEL_NAME
					case 'Fun':
						currentActivity = currentActivity.set('label', FUN_LABEL_NAME);
						break;
					case 'Service':
						currentActivity = currentActivity.set('label', SERVICE_LABEL_NAME);
						break;
				}
			}
			
		} else if(line.match(/^\s+-/)) {
			const description = `${line}\n`;
			currentActivity = currentActivity.update('desc', x=>x + description);
		} else {
			throw `The following line has a syntax error:

${line}`;
		}
	})
	if(currentActivity !== null) {
		R.times(() => json = json.update(currentDay, x => x.push(currentActivity)), currentActivity.get('times'));
	}
	return json;
}