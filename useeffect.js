import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useRealm } from './RealmProvider.js';
import { setDb } from './redux/actions.js';
import { scheduleNotification } from './notify.js';

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

export const useTaskManager = () => {
    const realm = useRealm();
    const dispatch = useDispatch();

    const today = moment().startOf('day');
    if (!realm) return { sum: 0, tasks: [] };

    const tasks = realm.objects('Task');
    const prevSum = realm.objectForPrimaryKey('Task', "1724230688403-kv2er3pcj").mon;
    let localSum = prevSum;

    const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    };

    const isBeforeDay = (date1, date2) => {
        return date1.getMonth() <= date2.getMonth() &&
               date1.getDate() < date2.getDate();
    };

    realm.write(() => {
        tasks.forEach(task => {
            const taskDate = moment(task.date);
            const isRepeatable = task.week && task.week.length > 0;
            const currentDayOfWeek = moment().format('ddd');
            const isScheduledToday = task.status.startsWith('today-') && extractDateFromStatus(task.status).getTime() === today.toDate().getTime();

            console.log(`Processing task: ${task.title}, date: ${taskDate.toString()}`);
            console.log(`Repeatable: ${isRepeatable}, Status: ${task.status}`);

            if (isRepeatable && task.week.includes(currentDayOfWeek) && !isScheduledToday) {
                if (task.status !== 'active') {
                    localSum += task.mon;
                }
                task.status = `today-${getCurrentDateInDDMMYY()}`;
                scheduleNotification(task.title, new Date(convertUTCtoIST(task.date)));
            }

            if (task.status === 'ver') {
                if (isRepeatable) {
                    task.status = 'active';
                } else {
                    realm.delete(task);
                }
            } else if (isBeforeDay(taskDate.toDate(), today.toDate())) {
                if (task.status.startsWith('today') || task.status === "undone") {
                    localSum += task.mon;
                    if (isRepeatable) {
                        task.status = 'active';
                    } else {
                        realm.delete(task);
                    }
                }
            } else if (isSameDay(taskDate.toDate(), today.toDate())) {
                if (task.status === 'undone') {
                    task.status = `today-${getCurrentDateInDDMMYY()}`;
                } else if (task.status === 'inactive') {
                    task.status = 'active';
                }
            }

            realm.objectForPrimaryKey('Task', "1724230688403-kv2er3pcj").mon = localSum;
        });
    });

    dispatch(setDb(tasks));
};
