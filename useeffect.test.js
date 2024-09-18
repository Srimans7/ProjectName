// __tests__/useTaskManager.test.js

import { useTaskManager } from './useeffect';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { scheduleNotification } from './notify';
import { useRealm } from './RealmProvider';

// Mock useDispatch
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

// Mock scheduleNotification
jest.mock('./notify', () => ({
  scheduleNotification: jest.fn(),
}));

// Mock useRealm
jest.mock('./RealmProvider', () => ({
  useRealm: jest.fn(),
}));

const mockRealmData = [
  {
    _id: "1",
    title: "Repeatable Task",
    date: new Date(),
    week: ["Mon", "Wed", "Fri"], // Assuming today is Wednesday
    status: 'active',
    mon: 10,
  },
  {
    _id: "2",
    title: "Non-Repeatable Task",
    date: moment().subtract(1, 'days').toDate(), // Yesterday's date
    week: [], // Non-repeatable
    status: 'undone',
    mon: 20,
  },
];

describe('useTaskManager', () => {
  let realm;
  let dispatch;

  beforeEach(() => {
    // Set up mock realm
    realm = {
      objects: jest.fn(() => mockRealmData),
      objectForPrimaryKey: jest.fn(() => ({ mon: 0 })),
      write: jest.fn((callback) => callback()),
      delete: jest.fn(),
    };

    // Mock useRealm to return the mock realm
    useRealm.mockReturnValue(realm);

    // Mock dispatch
    dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    // Clear mocks before each test
    scheduleNotification.mockClear();
  });

  it('should handle repeatable and non-repeatable tasks correctly', () => {
    // Mock current date to a fixed point
    jest.spyOn(Date, 'now').mockImplementation(() => new Date('2023-09-13T00:00:00Z').getTime());

    // Call the useTaskManager function
    useTaskManager();

    // Check if notifications are scheduled correctly
    expect(scheduleNotification).toHaveBeenCalledTimes(1);
    expect(scheduleNotification).toHaveBeenCalledWith(
      "Repeatable Task",
      expect.any(Date)
    );

    // Verify non-repeatable task is deleted after its date has passed
    expect(realm.delete).toHaveBeenCalledWith(mockRealmData[1]);

    // Verify localSum is updated
    expect(realm.objectForPrimaryKey).toHaveBeenCalledWith('Task', "1724230688403-kv2er3pcj");
    expect(realm.objectForPrimaryKey('Task', "1724230688403-kv2er3pcj").mon).toBe(20);

    // Verify dispatch is called to update the Redux store
    expect(dispatch).toHaveBeenCalledWith(setDb(mockRealmData));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
});
