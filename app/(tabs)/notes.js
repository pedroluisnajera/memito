import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { formatAgo } from '../../src/dates';
import { useList } from '../../src/store';
import { Button, Card, Empty, IconButton, Input, Screen, styles } from '../../src/ui';

export default function Notes() {
  const { items, add, remove } = useList('notes');
  const [text, setText] = useState('');

  const save = () => {
    if (!text.trim()) return;
    add({ text: text.trim() });
    setText('');
  };

  const confirmDelete = (n) =>
    Alert.alert('Delete note?', n.text.slice(0, 80), [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(n.id) },
    ]);

  return (
    <Screen>
      <Card style={{ gap: 10 }}>
        <Input value={text} onChangeText={setText} placeholder="Write a note…" multiline />
        <Button title="Save note" icon="add" onPress={save} disabled={!text.trim()} />
      </Card>

      {items.length === 0 ? <Empty icon="document-text-outline" text="No notes yet." /> : null}

      {items.map((n) => (
        <Card key={n.id} style={{ paddingVertical: 12 }}>
          <View style={[styles.row, { alignItems: 'flex-start' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { fontWeight: '400', lineHeight: 22 }]}>{n.text}</Text>
              <Text style={styles.sub}>{formatAgo(n.createdAt)}</Text>
            </View>
            <IconButton name="trash-outline" onPress={() => confirmDelete(n)} />
          </View>
        </Card>
      ))}
    </Screen>
  );
}
