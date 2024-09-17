import Realm from "realm";

// Define the Task schema
class Task extends Realm.Object {}
Task.schema = {
  name: 'Task',
  properties: {
    _id: 'string', // Primary key
    date: 'date',
    dur: 'int',
    comp: 'int',
    mon: 'int',
    title: 'string',
    week: 'string[]',
    img: 'string[]',
    status:  'string',// List of strings
  },
  primaryKey: '_id',
};

export default Task;


export class Tasko extends Realm.Object {}
 Tasko.schema = {
  name: 'Task1',
  properties: {
    _id: 'string',
    comp: 'int',
    date: 'date',
    dur: 'int',
    img: 'string[]',
    mon: 'int',
    status: 'string',
    title: 'string',
    week: 'string[]',
  },
  primaryKey: '_id',
};