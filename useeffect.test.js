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

const mockRealmData = [
  {
    _id: "1",
    title: "Repeatable Task",
    date: new Date(),
    week: ["Mon", "Wed", "Fri"],
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

  it('should handle repeatable and non-repeatable tasks correctly', () => {
    const currentDate = new Date('2024-09-21T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    useTaskManager();

    expect(realm.delete).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });
});
