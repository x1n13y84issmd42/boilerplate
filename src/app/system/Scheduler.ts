import * as S from 'lib/Scheduler';
import tasks from 'tasks';

export default function() {
	for (let task of tasks) {
		S.add(task);
	}
}
