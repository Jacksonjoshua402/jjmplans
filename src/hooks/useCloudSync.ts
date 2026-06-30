import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveToCloud, loadFromCloud, deleteFromCloud } from '../lib/firebase';

/**
 * Keeps a piece of state synced to localStorage (always, for instant offline access)
 * and to Firestore under the signed-in user's account (when logged in).
 *
 * On login, cloud data (if present) overwrites local state once ("hydration").
 * After that, any change to the state is pushed to the cloud (debounced).
 */
export function useCloudSyncedState<T>(
  key: string,
  loadLocal: () => T,
  saveLocal: (value: T) => void
) {
  const { user } = useAuth();
  const [state, setState] = useState<T>(loadLocal);
  const hydratedForUid = useRef<string | null>(null);
  const skipNextCloudSave = useRef(false);

  // Pull from cloud once per login (per uid), overwriting local state if cloud has data.
  useEffect(() => {
    if (!user) return;
    if (hydratedForUid.current === user.uid) return;

    let cancelled = false;
    (async () => {
      try {
        const cloudVal = await loadFromCloud(user.uid, key);
        if (!cancelled && cloudVal !== null) {
          skipNextCloudSave.current = true;
          setState(cloudVal as T);
        }
      } catch (e) {
        console.warn(`Cloud load failed for ${key}:`, e);
      } finally {
        if (!cancelled) hydratedForUid.current = user.uid;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, key]);

  // Always persist to localStorage as an offline-friendly cache.
  useEffect(() => {
    saveLocal(state);
  }, [state, saveLocal]);

  // Push to cloud (debounced) whenever state changes, once hydrated for this user.
  useEffect(() => {
    if (!user) return;
    if (hydratedForUid.current !== user.uid) return;
    if (skipNextCloudSave.current) {
      skipNextCloudSave.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      saveToCloud(user.uid, key, state).catch((e) =>
        console.warn(`Cloud save failed for ${key}:`, e)
      );
    }, 800);
    return () => clearTimeout(timeout);
  }, [state, user, key]);

  const resetCloud = () => {
    if (user) {
      deleteFromCloud(user.uid, key).catch((e) =>
        console.warn(`Cloud delete failed for ${key}:`, e)
      );
    }
  };

  return [state, setState, resetCloud] as const;
}
