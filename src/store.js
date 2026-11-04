// The app's "database": everything is saved on the phone with AsyncStorage.
// Think of each list (tasks, notes...) as a table that is saved automatically on every change.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const KEYS = {
  tasks: 'memito.tasks',
  reminders: 'memito.reminders',
  links: 'memito.links',
  notes: 'memito.notes',
  parking: 'memito.parking',
};

const EMPTY = { tasks: [], reminders: [], links: [], notes: [], parking: null };

const StoreContext = createContext(null);

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(EMPTY);
  const [ready, setReady] = useState(false);

  // Load everything once when the app opens.
  useEffect(() => {
    (async () => {
      try {
        const pairs = await AsyncStorage.multiGet(Object.values(KEYS));
        const loaded = { ...EMPTY };
        for (const [name, key] of Object.entries(KEYS)) {
          const raw = pairs.find((p) => p[0] === key)?.[1];
          if (raw) {
            try {
              loaded[name] = JSON.parse(raw);
            } catch {
              // ignore a corrupted value and keep the empty default
            }
          }
        }
        setData(loaded);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Change one collection and save it to the phone.
  const set = useCallback((name, updater) => {
    setData((prev) => {
      const value = typeof updater === 'function' ? updater(prev[name]) : updater;
      AsyncStorage.setItem(KEYS[name], JSON.stringify(value)).catch(() => {});
      return { ...prev, [name]: value };
    });
  }, []);

  return <StoreContext.Provider value={{ data, set, ready }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}

// Generic add / update / remove for a list such as "tasks" or "notes".
export function useList(name) {
  const { data, set } = useStore();

  const add = (item) => {
    const full = { id: newId(), createdAt: new Date().toISOString(), ...item };
    set(name, (list) => [full, ...list]);
    return full;
  };
  const update = (id, patch) => set(name, (list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const remove = (id) => set(name, (list) => list.filter((i) => i.id !== id));

  return { items: data[name], add, update, remove };
}

// Parking is a single value (one car), not a list.
export function useParking() {
  const { data, set } = useStore();
  return {
    parking: data.parking,
    save: (spot) => set('parking', { ...spot, savedAt: new Date().toISOString() }),
    clear: () => set('parking', null),
  };
}
