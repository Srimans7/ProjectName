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
    _id: "1",
    title: "Repeatable Task",
    date: new Date(),
    week: ["Mon", "Wed", "Fri"], // Assuming today is Saturday
    status: 'active',
    mon: 10,
  },
  {
    _id: "2",
    title: "Non-Repeatable Task",
    date: yesterday,
    week: [],
    status: 'undone',
    mon: 20,
  },
  {
    _id: "9",
    title: "Non-Repeatable Task- incomplete",
    date: yesterday,
    week: [],
    status: 'today-',
    mon: 90,
  },
  {
    _id: "3",
    title: "Future Non-Repeatable Task",
    date: tomorrow,
    week: [],
    status: 'undone',
    mon: 30,
  },
  {
    _id: "4",
    title: "Ver Task",
    date: yesterday,
    week: [],
    status: 'ver',
    mon: 40,
  },
  {
    _id: "5",
    title: "Inactive Repeatable Task",
    date: new Date(),
    week: ["Sat"],
    status: 'inactive',
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

  it('should handle repeatable tasks and schedule notifications', () => {
    const currentDate = new Date('2024-09-21T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    useTaskManager();

    expect(scheduleNotification).toHaveBeenCalledWith(
      "Repeatable Task",
      expect.any(Date)
    );
    expect(realm.objects).toHaveBeenCalled();
    expect(realm.write).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(setDb(mockRealmData));
  });

  it('should handle non-repeatable tasks that are in the past', () => {
    const currentDate = new Date('2024-09-21T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    useTaskManager();

    expect(realm.delete).toHaveBeenCalledWith(mockRealmData[1]); // Deletes non-repeatable past task
  });

  it('should not delete non-repeatable tasks that are scheduled for the future', () => {
    const currentDate = new Date('2024-09-21T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    useTaskManager();

    expect(realm.delete).not.toHaveBeenCalledWith(mockRealmData[2]); // Task scheduled for the future
  });

  it('should handle tasks with status "ver" and reactivate if repeatable', () => {
    const currentDate = new Date('2024-09-21T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    useTaskManager();

    expect(mockRealmData[3].status).toBe('active'); // Ver task should be set to 'active'
  });

  it('should delete non-repeatable tasks with status "ver"', () => {
    const currentDate = new Date('2024-09-21T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    useTaskManager();

    expect(realm.delete).toHaveBeenCalledWith(mockRealmData[3]); // Non-repeatable "ver" task should be deleted
  });

  it('should activate inactive repeatable tasks', () => {
    const currentDate = new Date('2024-09-21T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    useTaskManager();

    expect(mockRealmData[4].status).toBe('active'); // Inactive repeatable task should be activated
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
