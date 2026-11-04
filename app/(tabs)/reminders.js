import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { defaultReminderDate, formatWhen } from '../../src/dates';
import { cancelReminder, scheduleReminder } from '../../src/notifications';
import { useList } from '../../src/store';
import { colors } from '../../src/theme';
import { Button, Card, Empty, IconButton, Input, Screen, SectionTitle, styles } from '../../src/ui';

export default function Reminders() {
  const params = useLocalSearchParams();
  const { items, add, remove } = useList('reminders');
  const [title, setTitle] = useState('');
  const [when, setWhen] = useState(defaultReminderDate());

  // Android shows two dialogs: first the date, then the time.
  const pickDateTime = () => {
    DateTimePickerAndroid.open({
      value: when,
      mode: 'date',
      minimumDate: new Date(),
      onChange: (event, date) => {
        if (event.type !== 'set' || !date) return;
        DateTimePickerAndroid.open({
          value: when,
          mode: 'time',
          onChange: (ev2, time) => {
            if (ev2.type !== 'set' || !time) return;
            const d = new Date(date);
            d.setHours(time.getHours(), time.getMinutes(), 0, 0);
            setWhen(d);
          },
        });
      },
    });
  };

  const save = async () => {
    const t = title.trim();
    if (!t) return;
    if (when.getTime() <= Date.now()) {
      Alert.alert('Pick a future time', 'That time has already passed.');
      return;
    }
    const notificationId = await scheduleReminder(t, when);
    if (!notificationId) {
      Alert.alert(
        'Notifications are off',
        'The reminder was saved, but your phone will not alert you. Allow notifications for Expo Go / Memito in Android settings.'
      );
    }
    add({ title: t, at: when.toISOString(), notificationId });
    setTitle('');
    setWhen(defaultReminderDate());
  };

  const del = (r) => {
    cancelReminder(r.notificationId);
    remove(r.id);
  };

  const now = Date.now();
  const sorted = [...items].sort((a, b) => new Date(a.at) - new Date(b.at));
  const upcoming = sorted.filter((r) => new Date(r.at).getTime() > now);
  const past = sorted.filter((r) => new Date(r.at).getTime() <= now).reverse();

  const renderItem = (r, isPast) => (
    <Card key={r.id} style={{ paddingVertical: 12, opacity: isPast ? 0.6 : 1 }}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{r.title}</Text>
          <Text style={styles.sub}>{formatWhen(r.at)}</Text>
        </View>
        <IconButton name="trash-outline" onPress={() => del(r)} />
      </View>
    </Card>
  );

  return (
    <Screen>
      <Card style={{ gap: 12 }}>
        <Input value={title} onChangeText={setTitle} placeholder="Remind me to…" autoFocus={params.new === '1'} />
        <Button title={formatWhen(when.toISOString())} icon="calendar-outline" variant="secondary" onPress={pickDateTime} />
        <Button title="Set reminder" icon="alarm-outline" onPress={save} disabled={!title.trim()} />
      </Card>

      {items.length === 0 ? <Empty icon="alarm-outline" text="No reminders yet." /> : null}

      {upcoming.length > 0 ? <SectionTitle>Upcoming</SectionTitle> : null}
      {upcoming.map((r) => renderItem(r, false))}

      {past.length > 0 ? <SectionTitle>Past</SectionTitle> : null}
      {past.map((r) => renderItem(r, true))}

      <Text style={[styles.sub, { textAlign: 'center', marginTop: 8, color: colors.muted }]}>
        Reminders fire even when the app is closed.
      </Text>
    </Screen>
  );
}
