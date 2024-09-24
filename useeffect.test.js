import { useTaskManager } from './useeffect.js';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { scheduleNotification } from './notify';
import { useRealm } from './RealmProvider';
import { setDb } from './redux/actions';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('./notify', () => ({
  scheduleNotification: jest.fn(),
}));

jest.mock('./RealmProvider', () => ({
  useRealm: jest.fn(),
}));

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const mockRealmData = [
  {
    _id: "5",
    title: "Inactive Repeatable Task",
    date: new Date(),
    week: ["Sat"],
    status: 'active',
    mon: 50,
  },
  {
    _id: "7",
    title: "Repeatable Task",
    date: new Date(),
    week: ["Tue","wed"],
    status: 'active',
    mon: 50,
  },
];

describe('useTaskManager', () => {
  let realm;
  let dispatch;

  beforeEach(() => {
    realm = {
      objects: jest.fn(() => mockRealmData),
      objectForPrimaryKey: jest.fn(() => ({ mon: 0 })),
      write: jest.fn((callback) => callback()),
      delete: jest.fn(),
    };

    useRealm.mockReturnValue(realm);
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);
    scheduleNotification.mockClear();
  });

  it('should schedule notifications only once per day for repeatable tasks', () => {
    const currentDate = new Date('2024-09-24T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    useTaskManager();
    expect(scheduleNotification).toHaveBeenCalledWith(
      "Repeatable Task",
      expect.any(Date)
    );

    // Simulate running the task manager again on the same day (after 12 hours)
    jest.advanceTimersByTime(12 * 60 * 60 * 1000); // 12 hours later
    useTaskManager();

    // Ensure that scheduleNotification is still only called once
    expect(scheduleNotification).toHaveBeenCalledTimes(1);

    // Simulate the passage of one day and call again
    jest.advanceTimersByTime(1 * 60 * 60 * 1000); // Advance by 24 hours
    useTaskManager();

    // Ensure that scheduleNotification is called again only after a full day
    expect(scheduleNotification).toHaveBeenCalledTimes(1);
  });

  it('should not schedule notification for non-scheduled repeatable tasks', () => {
    const currentDate = new Date('2024-09-21T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    useTaskManager();

    expect(scheduleNotification).not.toHaveBeenCalledWith(
      "Future Non-Repeatable Task",
      expect.any(Date)
    ); // Shouldn't schedule notification for future non-repeatable tasks
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });
});
