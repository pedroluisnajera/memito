import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '../../src/theme';

const icon = (name) => ({ color, size }) => <Ionicons name={name} color={color} size={size} />;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700', color: colors.ink },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Memito', tabBarLabel: 'Home', tabBarIcon: icon('home-outline') }} />
      <Tabs.Screen name="tasks" options={{ title: 'Tasks', tabBarIcon: icon('checkbox-outline') }} />
      <Tabs.Screen name="reminders" options={{ title: 'Reminders', tabBarIcon: icon('alarm-outline') }} />
      <Tabs.Screen name="links" options={{ title: 'Links', tabBarIcon: icon('link-outline') }} />
      <Tabs.Screen name="notes" options={{ title: 'Notes', tabBarIcon: icon('document-text-outline') }} />
    </Tabs>
  );
}
