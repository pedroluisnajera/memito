// HOME: one box to capture anything, plus a summary of today.
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { formatAgo, formatWhen } from '../../src/dates';
import { guessCategory, looksLikeUrl, normalizeUrl } from '../../src/links';
import { useList, useParking } from '../../src/store';
import { colors } from '../../src/theme';
import { Button, Card, Chip, ChipRow, Input, Screen, SectionTitle, styles } from '../../src/ui';

const TYPES = [
  { key: 'note', label: 'Note', icon: 'document-text-outline' },
  { key: 'task', label: 'Task', icon: 'checkbox-outline' },
  { key: 'link', label: 'Link', icon: 'link-outline' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 19) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const router = useRouter();
  const notes = useList('notes');
  const tasks = useList('tasks');
  const links = useList('links');
  const reminders = useList('reminders');
  const { parking } = useParking();

  const [text, setText] = useState('');
  const [type, setType] = useState('note');
  const [savedMsg, setSavedMsg] = useState('');

  const onChangeText = (t) => {
    setText(t);
    if (looksLikeUrl(t)) setType('link'); // pasted a link? switch automatically
  };

  const save = () => {
    const value = text.trim();
    if (!value) return;
    if (type === 'task') {
      tasks.add({ title: value, done: false });
      setSavedMsg('Added to Tasks');
    } else if (type === 'link') {
      const url = normalizeUrl(value);
      const category = guessCategory(url);
      links.add({ url, title: '', category });
      setSavedMsg(`Saved to Links · ${category}`);
    } else {
      notes.add({ text: value });
      setSavedMsg('Saved to Notes');
    }
    setText('');
    setType('note');
    setTimeout(() => setSavedMsg(''), 2500);
  };

  const openTasks = tasks.items.filter((t) => !t.done);
  const now = Date.now();
  const nextReminder = [...reminders.items]
    .filter((r) => new Date(r.at).getTime() > now)
    .sort((a, b) => new Date(a.at) - new Date(b.at))[0];

  return (
    <Screen>
      <Text style={{ fontSize: 26, fontWeight: '700', color: colors.ink }}>{greeting()} 👋</Text>
      <Text style={[styles.sub, { marginTop: -6 }]}>What do you want to remember?</Text>

      <Card style={{ gap: 12 }}>
        <Input
          value={text}
          onChangeText={onChangeText}
          placeholder="Type or paste anything…"
          multiline
        />
        <ChipRow>
          {TYPES.map((t) => (
            <Chip key={t.key} label={t.label} icon={t.icon} selected={type === t.key} onPress={() => setType(t.key)} />
          ))}
        </ChipRow>
        <Button title="Save" icon="add" onPress={save} disabled={!text.trim()} />
        {savedMsg ? (
          <Text style={{ color: colors.success, textAlign: 'center', fontWeight: '600' }}>✓ {savedMsg}</Text>
        ) : null}
      </Card>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Button title="Reminder" icon="alarm-outline" variant="secondary" style={{ flex: 1 }} onPress={() => router.push('/reminders?new=1')} />
        <Button title="I parked" icon="car-outline" variant="secondary" style={{ flex: 1 }} onPress={() => router.push('/parking')} />
      </View>

      <SectionTitle>Today</SectionTitle>

      {parking ? (
        <Card onPress={() => router.push('/parking')}>
          <View style={styles.row}>
            <Ionicons name="car" size={24} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Car parked {formatAgo(parking.savedAt)}</Text>
              <Text style={styles.sub} numberOfLines={1}>{parking.note || 'Tap for directions'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </View>
        </Card>
      ) : null}

      <Card onPress={() => router.push('/reminders')}>
        <View style={styles.row}>
          <Ionicons name="alarm-outline" size={24} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{nextReminder ? nextReminder.title : 'No upcoming reminders'}</Text>
            {nextReminder ? <Text style={styles.sub}>{formatWhen(nextReminder.at)}</Text> : null}
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>
      </Card>

      <Card onPress={() => router.push('/tasks')}>
        <View style={styles.row}>
          <Ionicons name="checkbox-outline" size={24} color={colors.accent} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {openTasks.length === 0 ? 'All tasks done 🎉' : `${openTasks.length} open task${openTasks.length === 1 ? '' : 's'}`}
            </Text>
            {openTasks[0] ? <Text style={styles.sub} numberOfLines={1}>Next: {openTasks[0].title}</Text> : null}
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>
      </Card>
    </Screen>
  );
}
