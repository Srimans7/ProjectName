import React, { createContext, useContext, useEffect, useState } from 'react';
import Realm from 'realm';
import Task from './components/model';
import { Tasko } from './components/model';
import { Alert } from 'react-native';
import ForegroundService from '@supersami/rn-foreground-service';

const RealmContext = createContext(null);

export const useRealm = () => {
  return useContext(RealmContext);
};

export const RealmProvider = ({ children }) => {
  const [realm, setRealm] = useState(null);
  const app = new Realm.App({ id: "app-tdeydcy", baseUrl: "https://services.cloud.mongodb.com" });
  const credentials = Realm.Credentials.emailPassword('s.sriman.2002@gmail.com', 'victoria@69');

  useEffect(() => {
    const startForegroundService = async () => {
      try {
        await ForegroundService.start({
          id: 144,
          title: 'Realm Sync',
          message: 'Syncing data with server...',
          visibility: 'public',
          importance: 'high',
          serviceType: 'dataSync', // Add the correct service type here
        });
        console.log("Foreground service started");
      } catch (error) {
        console.log("Failed to start foreground service", error);
      }
    };

    const connectRealm = async () => {
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
        console.error("Failed to log in or open Realm", err);
        Alert.alert("Realm Error", `Failed to connect to Realm: ${err.message}`);
      }
    };

    // Start the foreground service and connect to Realm
    startForegroundService();
    connectRealm();

    // Cleanup: Stop the foreground service and close Realm when the component is unmounted
    return () => {
      if (realm) {
        realm.close();
      }
      ForegroundService.stop();  // Stop the foreground service when the app is terminated
    };
  }, [realm]);

  return (
    <RealmContext.Provider value={realm}>
      {children}
    </RealmContext.Provider>
  );
};
