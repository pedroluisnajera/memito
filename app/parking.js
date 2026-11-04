// WHERE I PARKED: saves GPS location + optional photo and note.
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Text, View } from 'react-native';
import { formatAgo, formatWhen } from '../src/dates';
import { useParking } from '../src/store';
import { colors, radius } from '../src/theme';
import { Button, Card, Input, Screen, styles } from '../src/ui';

export default function Parking() {
  const { parking, save, clear } = useParking();
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera permission needed', 'Allow camera access to add a photo of your spot.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled && result.assets?.[0]) setPhoto(result.assets[0].uri);
  };

  const saveSpot = async () => {
    setBusy(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Location permission needed', 'Allow location access so Memito can remember where you parked.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      save({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        note: note.trim(),
        photo,
      });
      setNote('');
      setPhoto(null);
    } catch (e) {
      Alert.alert('Could not get your location', 'Make sure GPS is on and try again.');
    } finally {
      setBusy(false);
    }
  };

  const navigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${parking.latitude},${parking.longitude}&travelmode=walking`;
    Linking.openURL(url);
  };

  const confirmClear = () =>
    Alert.alert('Clear parking spot?', 'Do this when you have picked up your car.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);

  // A spot is saved: show it.
  if (parking) {
    return (
      <Screen>
        <Card style={{ gap: 12, alignItems: 'center' }}>
          <Ionicons name="car" size={48} color={colors.accent} />
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.ink }}>Parked {formatAgo(parking.savedAt)}</Text>
          <Text style={styles.sub}>{formatWhen(parking.savedAt)}</Text>
          {parking.note ? <Text style={[styles.title, { textAlign: 'center' }]}>“{parking.note}”</Text> : null}
          {parking.accuracy ? <Text style={styles.sub}>GPS accuracy ±{Math.round(parking.accuracy)} m</Text> : null}
        </Card>
        {parking.photo ? (
          <Image source={{ uri: parking.photo }} style={{ width: '100%', aspectRatio: 3 / 4, borderRadius: radius.md }} />
        ) : null}
        <Button title="Walk me to my car" icon="navigate" onPress={navigate} />
        <Button title="I picked up my car" icon="checkmark" variant="secondary" onPress={confirmClear} />
      </Screen>
    );
  }

  // No spot yet: form to save one.
  return (
    <Screen>
      <Card style={{ gap: 12 }}>
        <Text style={styles.title}>Save where you parked</Text>
        <Text style={styles.sub}>Your current GPS location will be saved. Add a note or photo to find it faster.</Text>
        <Input value={note} onChangeText={setNote} placeholder="e.g. Level 3, spot B12, near elevator" />
        {photo ? (
          <Image source={{ uri: photo }} style={{ width: '100%', height: 200, borderRadius: radius.sm }} />
        ) : null}
        <Button title={photo ? 'Retake photo' : 'Add photo'} icon="camera-outline" variant="secondary" onPress={takePhoto} />
      </Card>
      {busy ? (
        <View style={{ alignItems: 'center', gap: 8 }}>
          <ActivityIndicator color={colors.accent} />
          <Text style={styles.sub}>Getting your location…</Text>
        </View>
      ) : (
        <Button title="I parked here" icon="location" onPress={saveSpot} />
      )}
    </Screen>
  );
}
