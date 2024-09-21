// __tests__/useTaskManager.test.js

import { useTaskManager } from './useeffect.js';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { scheduleNotification } from './notify';
import { useRealm } from './RealmProvider';
import { setDb } from './redux/actions';

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

const yesterday = new Date(); // Create a copy of today's date
yesterday.setDate(yesterday.getDate() - 1)

const mockRealmData = [
  {
    _id: "1",
    title: "Repeatable Task",
    date: new Date(), // Task is set for today
    week: ["Mon", "Wed", "Fri"], // Assuming today is Saturday
    status: 'active',
    mon: 10,
  },
  {
    _id: "2",
    title: "Non-Repeatable Task",
    date: yesterday, // Task is set for yesterday
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
    // Mock current date to a fixed point (21st September 2024, which is Saturday)
    const currentDate = new Date('2024-09-21T00:00:00.000Z');
    jest.useFakeTimers('modern').setSystemTime(currentDate);

    // Call the useTaskManager function
    useTaskManager();

    // Check if `delete` was called at all
    expect(realm.delete).toHaveBeenCalled();


  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });
});
