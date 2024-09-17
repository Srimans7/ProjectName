// useeffect.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useTaskManager } from './useeffect';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { scheduleNotification } from './notify';

// Mock dispatch
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock scheduleNotification
jest.mock('./notify', () => ({
  scheduleNotification: jest.fn(),
}));

// Mock RealmProvider
jest.mock('./RealmProvider', () => ({
  useRealm: jest.fn(() => ({
    write: jest.fn((callback) => callback()),
    objects: jest.fn(() => mockRealmData),
    objectForPrimaryKey: jest.fn((type, id) => mockRealmData.find(task => task._id === id)),
  })),
}));

const mockRealmData = [
  {
    _id: "1724230688403-kv2er3pcj",
    date: new Date(),
    week: ["Mon", "Wed", "Fri"], // Assuming today is Wednesday
    status: 'done', // Task marked as done today
    mon: 10,
  },
  {
    _id: "1724230688404-abc123def",
    date: moment().subtract(1, 'days').toDate(), // Yesterday's date
    week: ["Tue", "Thu"], // Yesterday was Tuesday
    status: 'undone',
    mon: 20,
  },
  // Add more mock data if needed
];

describe('useTaskManager Hook', () => {
  let dispatch;

  beforeEach(() => {
    // Reset mocks before each test
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    scheduleNotification.mockClear();
  });

  it('should update the repeat task statuses correctly and schedule only once a day', () => {
    const { result } = renderHook(() => useTaskManager());

    act(() => {
      result.current.updateTasks();
    });

    // Removed the second call to updateTasks()
    const { sum, tasks } = result.current.updateTasks(); // Obtain sum and tasks from a single call

    tasks.forEach(task => {
      if (task.week.includes(moment().format('ddd'))) {
        // Check task status
        if (task.status.startsWith('today-')) {
          // Assuming the notification should be scheduled at task.date
          expect(scheduleNotification).toHaveBeenCalledWith(
            task.title,
            expect.any(Date) // We can use expect.any(Date) to verify that a Date object is passed
          );
        }
      }

      // Ensure sum is updated correctly
      if (task.status === 'undone' || task.status.startsWith('today-')) {
        expect(sum).toBeGreaterThan(0);
      }

      // Check that a task marked as "done" is not updated again on the same day
      if (task.status === 'done') {
        expect(scheduleNotification).not.toHaveBeenCalledWith(
          task.title,
          expect.any(Date)
        );
      }
    });

    // Ensure notifications are called only once for each task
    const notificationCalls = scheduleNotification.mock.calls;
    const uniqueTaskNotifications = new Set(notificationCalls.map(call => call[0])); // call[0] is task.title
    expect(uniqueTaskNotifications.size).toBe(notificationCalls.length);

    // Ensure dispatch is called to update the Redux store
    expect(dispatch).toHaveBeenCalledTimes(2); // Now it should match correctly
  });
});
