import { useState } from 'react';
import { Alert, Linking, Text, View } from 'react-native';
import { formatAgo } from '../../src/dates';
import { CATEGORIES, guessCategory, hostname, looksLikeUrl, normalizeUrl } from '../../src/links';
import { useList } from '../../src/store';
import { colors } from '../../src/theme';
import { Button, Card, Chip, ChipRow, Empty, IconButton, Input, Screen, styles } from '../../src/ui';

export default function Links() {
  const { items, add, remove } = useList('links');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Other');
  const [filter, setFilter] = useState('All');

  const onUrl = (t) => {
    setUrl(t);
    if (looksLikeUrl(t)) setCategory(guessCategory(normalizeUrl(t)));
  };

  const save = () => {
    if (!url.trim()) return;
    add({ url: normalizeUrl(url), title: title.trim(), category });
    setUrl('');
    setTitle('');
    setCategory('Other');
  };

  const confirmDelete = (l) =>
    Alert.alert('Delete link?', l.title || hostname(l.url), [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(l.id) },
    ]);

  const shown = filter === 'All' ? items : items.filter((l) => l.category === filter);
  const count = (c) => items.filter((l) => l.category === c).length;

  return (
    <Screen>
      <Card style={{ gap: 10 }}>
        <Input value={url} onChangeText={onUrl} placeholder="Paste a link…" autoCapitalize="none" keyboardType="url" />
        <Input value={title} onChangeText={setTitle} placeholder="Title (optional)" />
        <ChipRow>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </ChipRow>
        <Button title="Save link" icon="add" onPress={save} disabled={!url.trim()} />
      </Card>

      <ChipRow>
        <Chip label={`All (${items.length})`} selected={filter === 'All'} onPress={() => setFilter('All')} />
        {CATEGORIES.filter((c) => count(c) > 0).map((c) => (
          <Chip key={c} label={`${c} (${count(c)})`} selected={filter === c} onPress={() => setFilter(c)} />
        ))}
      </ChipRow>

      {shown.length === 0 ? <Empty icon="link-outline" text="No links here yet." /> : null}

      {shown.map((l) => (
        <Card key={l.id} style={{ paddingVertical: 12 }} onPress={() => Linking.openURL(l.url).catch(() => Alert.alert('Could not open this link'))}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={2}>{l.title || hostname(l.url)}</Text>
              <Text style={styles.sub} numberOfLines={1}>
                <Text style={{ color: colors.accent, fontWeight: '600' }}>{l.category}</Text> · {formatAgo(l.createdAt)} · {l.url}
              </Text>
            </View>
            <IconButton name="trash-outline" onPress={() => confirmDelete(l)} />
          </View>
        </Card>
      ))}
    </Screen>
  );
}
