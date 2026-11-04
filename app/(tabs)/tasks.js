import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useList } from '../../src/store';
import { colors } from '../../src/theme';
import { Button, Card, Empty, IconButton, Input, Screen, SectionTitle, styles } from '../../src/ui';

export default function Tasks() {
  const { items, add, update, remove } = useList('tasks');
  const [title, setTitle] = useState('');

  const save = () => {
    if (!title.trim()) return;
    add({ title: title.trim(), done: false });
    setTitle('');
  };

  const open = items.filter((t) => !t.done);
  const done = items.filter((t) => t.done);

  const renderTask = (t) => (
    <Card key={t.id} style={{ paddingVertical: 12 }}>
      <View style={styles.row}>
        <Pressable onPress={() => update(t.id, { done: !t.done })} hitSlop={10}>
          <Ionicons name={t.done ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={t.done ? colors.success : colors.muted} />
        </Pressable>
        <Text style={[styles.title, { flex: 1 }, t.done && { textDecorationLine: 'line-through', color: colors.muted }]}>
          {t.title}
        </Text>
        <IconButton name="trash-outline" onPress={() => remove(t.id)} />
      </View>
    </Card>
  );

  return (
    <Screen>
      <View style={styles.row}>
        <Input value={title} onChangeText={setTitle} placeholder="New task…" style={{ flex: 1 }} onSubmitEditing={save} returnKeyType="done" />
        <Button icon="add" onPress={save} disabled={!title.trim()} style={{ paddingHorizontal: 14 }} />
      </View>

      {items.length === 0 ? <Empty icon="checkbox-outline" text="No tasks yet. Add one above." /> : null}

      {open.map(renderTask)}

      {done.length > 0 ? (
        <>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <SectionTitle>Done ({done.length})</SectionTitle>
            <Pressable onPress={() => done.forEach((t) => remove(t.id))}>
              <Text style={{ color: colors.accent, fontWeight: '600', marginTop: 8 }}>Clear</Text>
            </Pressable>
          </View>
          {done.map(renderTask)}
        </>
      ) : null}
    </Screen>
  );
}
