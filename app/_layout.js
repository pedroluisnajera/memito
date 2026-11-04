import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import '../src/notifications';
import { StoreProvider } from '../src/store';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerShadowVisible: false,
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="parking" options={{ title: 'Where I parked' }} />
      </Stack>
    </StoreProvider>
  );
}
