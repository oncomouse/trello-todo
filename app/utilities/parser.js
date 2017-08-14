import {List, Map, Record} from 'immutable'
import {TODO_BOARD_NAME, TODO_LIST_NAME, RESEARCH_LABEL_NAME, FUN_LABEL_NAME, TEACHING_LABEL_NAME, SERVICE_LABEL_NAME, HOME_LABEL_NAME} from 'constants/Config'
import R from 'ramda'
import chrono from 'chrono-node'
import Card from 'models/Card'

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
			const [,,label,name,,times] = line.match(/^((Writing|Research|Home|Teaching|Service)\:){0,1}(.*?)(\ \(([0-9]+)\)){0,1}$/);
			
			if(currentDay === 'sunday') {
				currentActivity = currentActivity.set('due', chrono.parseDate('today at 11:59PM'));
			} else if(currentDay === 'sunday2') {
				currentActivity = currentActivity.set('due', chrono.parseDate('next sunday at 11:59PM'));
			} else {
				currentActivity = currentActivity.set('due', chrono.parseDate(`this ${currentDay} at 11:59PM`));
			}
			
			currentActivity = currentActivity.set('name', name);
			if(typeof times !== 'undefined') {
				currentActivity = currentActivity.set('times', parseInt(times))
			}
			
			if(label === 'Research' || label === 'Writing') {
				currentActivity = currentActivity.set('name', `${label} Sprint (45 Minutes)`);
				currentActivity = currentActivity.set('desc', `- ${name}\n`);
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
					case 'Writing':
						currentActivity = currentActivity.set('label', RESEARCH_LABEL_NAME);
						break;
					case 'Research':
						currentActivity = currentActivity.set('label', RESEARCH_LABEL_NAME);
						break;
					case 'Home':
						currentActivity = currentActivity.set('label', HOME_LABEL_NAME);
						break;
					case 'Teaching':
						currentActivity = currentActivity.set('label', TEACHING_LABEL_NAME);
						break;
					case 'Service':
						currentActivity = currentActivity.set('label', SERVICE_LABEL_NAME);
						break;
				}
			}
			
		} else if(line.match(/^\s+-/)) {
			const description = `line\n`;
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