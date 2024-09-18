// useTaskManager.js
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useRealm } from './RealmProvider';
import { setDb } from './redux/actions';
import { scheduleNotification } from './notify';


  const realm = useRealm();



  const convertUTCtoIST = (utcDate) => {
    const date = new Date(utcDate);
    const offset = 5 * 60 + 30; // IST offset: +5 hours and 30 minutes
    const istDate = new Date(date.getTime() - offset * 60 * 1000);
    return istDate;
  };

  const getCurrentDateInDDMMYY = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}${month}${year}`;
  };

  const extractDateFromStatus = (status) => {
    const dateString = status.substring(6);
    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4, 6);
    const date = new Date(`20${year}-${month}-${day}`);
    return date;
  };

  // Event handlers



  // Function to update existing tasks
 export const useTaskManager = () => {
    console.log('updateTasks called');
    const today = moment().startOf('day');

    if (!realm) return { sum: 0, tasks: [] };

    const tasks = realm.objects('Task');
    const prevSum = realm.objectForPrimaryKey('Task', "1724230688403-kv2er3pcj").mon;
    let localSum = prevSum;

    realm.write(() => {
        tasks.forEach(task => {
            const taskDate = moment(task.date);
            const isRepeatable = task.week && task.week.length > 0;
            const currentDayOfWeek = moment().format('ddd');
            const isScheduledToday = task.status.startsWith('today-') && extractDateFromStatus(task.status).getTime() === today.toDate().getTime();

            // Ensure repeatable tasks are updated for today and scheduled only once
            if (isRepeatable && task.week.includes(currentDayOfWeek) && !isScheduledToday) {
                if (task.status === 'active') {
                    task.status = `today-${getCurrentDateInDDMMYY()}`;
                    scheduleNotification(task.title, new Date(convertUTCtoIST(task.date)));
                } else if (task.status === 'undone') {
                    localSum += task.mon;
                    task.status = `today-${getCurrentDateInDDMMYY()}`;
                    scheduleNotification(task.title, new Date(convertUTCtoIST(task.date)));
                }
                // Removed condition to change "done" tasks to "today" again on the same day
            }

            // Handle task status changes
            if (task.status === 'ver') {
                if (isRepeatable) {
                    task.status = 'active';
                } else {
                    realm.delete(task);
                }
            } else if (taskDate.isBefore(today)) {
                if (task.status === 'today' || task.status === 'undone') {
                    localSum += task.mon;
                    if (isRepeatable) {
                        task.status = 'active';
                    } else {
                        realm.delete(task);
                    }
                }
            } else if (taskDate.isSame(today, 'day')) {
                if (task.status === 'undone' && !isScheduledToday) {
                    task.status = 'today';
                    scheduleNotification(task.title, new Date(convertUTCtoIST(task.date)));
                } else if (task.status === 'inactive') {
                    task.status = 'active';
                }
            }

            // Update the 'mon' value in the task with the specified primary key
            realm.objectForPrimaryKey('Task', "1724230688403-kv2er3pcj").mon = localSum;
        });
    });

    useDispatch(setDb(tasks));
  

};

