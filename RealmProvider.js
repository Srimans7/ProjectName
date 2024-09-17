import React, { createContext, useContext, useEffect, useState } from 'react';
import Realm from 'realm';
import Task from './components/model';
import {Tasko} from './components/model';
import { Alert } from 'react-native';
 // Adjust the import based on your model location

const RealmContext = createContext(null);

export const useRealm = () => {
  return useContext(RealmContext);
};

export const RealmProvider = ({ children }) => {
  const [realm, setRealm] = useState(null);
  const app = new Realm.App({ id: "app-tdeydcy", baseUrl: "https://services.cloud.mongodb.com" });
  const credentials = Realm.Credentials.emailPassword('s.sriman.2002@gmail.com', 'victoria@69');

  useEffect(() => {
    const connect = async () => {
      try {
        const user = await app.logIn(credentials);

        const realmInstance = await Realm.open({
          schema: [Task, Tasko],
          sync: { user: app.currentUser, flexible: true },
        });
        console.log("Schemas in Realm:", realmInstance.schema);
        await realmInstance.subscriptions.update((subs) => {
          const tasks = realmInstance.objects(Task);
          const taskss = realmInstance.objects(Tasko);
          subs.add(tasks);
          subs.add(taskss);
        });

        setRealm(realmInstance);
      } catch (err) {
        console.error("Failed to log in or open realm", err);
        Alert("realm failed:", err);
      }
    };

    connect();

    // Cleanup Realm instance on unmount
    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  return (
    <RealmContext.Provider value={realm}>
      {children}
    </RealmContext.Provider>
  );
};
