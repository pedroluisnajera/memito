// Local reminders: the phone itself fires the notification, no server needed.
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Show reminders even when the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensurePermission() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

// Returns the notification id (needed to cancel it later), or null if it failed.
export async function scheduleReminder(title, date) {
  try {
    const ok = await ensurePermission();
    if (!ok) return null;
    return await Notifications.scheduleNotificationAsync({
      content: { title: 'Memito reminder', body: title, sound: 'default' },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: 'reminders',
      },
    });
  } catch (e) {
    console.warn('Could not schedule reminder', e);
    return null;
  }
}

export async function cancelReminder(notificationId) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // already fired or gone
  }
}
