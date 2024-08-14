import React, { createContext, useContext, useEffect, useState } from 'react';
import Realm from 'realm';
import Task from './components/model'; // Adjust the import based on your model location

const RealmContext = createContext(null);

export const useRealm = () => {
  return useContext(RealmContext);
};

export const RealmProvider = ({ children }) => {
  const [realm, setRealm] = useState(null);
  const app = new Realm.App({ id: "app-tdeydcy" });
  const credentials = Realm.Credentials.emailPassword('s.sriman.2002@gmail.com', 'victoria@69');

  useEffect(() => {
    const connect = async () => {
      try {
        const user = await app.logIn(credentials);

        const realmInstance = await Realm.open({
          schema: [Task],
          sync: { user: app.currentUser, flexible: true },
        });

        await realmInstance.subscriptions.update((subs) => {
          const tasks = realmInstance.objects(Task);
          subs.add(tasks);
        });

        setRealm(realmInstance);
      } catch (err) {
        console.error("Failed to log in or open realm", err);
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
