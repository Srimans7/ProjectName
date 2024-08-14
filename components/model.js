import Realm from "realm";

// Define the Task schema
class Task extends Realm.Object {}
Task.schema = {
  name: 'Task',
  properties: {
    _id: 'string', // Primary key
    date: 'date',
    percentage: 'int',
    title: 'string',
    week: 'string[]',
    img: 'string[]',
    status:  'string',// List of strings
  },
  primaryKey: '_id',
};

export default Task;
