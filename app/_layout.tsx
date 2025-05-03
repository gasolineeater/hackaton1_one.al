import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider as PaperProvider } from 'react-native-paper';
import { OneAlbaniaColors } from '@/constants/OneAlbaniaColors';
import { useAuthStore } from '@/store/authStore';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuthStore();

  // Create custom themes for React Navigation and React Native Paper
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  const paperTheme = {
    ...DefaultTheme,
    dark: colorScheme === 'dark',
    mode: colorScheme === 'dark' ? 'adaptive' : 'exact',
    colors: {
      ...DefaultTheme.colors,
      primary: OneAlbaniaColors.primary,
      accent: OneAlbaniaColors.secondary,
      background: colorScheme === 'dark' ? OneAlbaniaColors.background.dark : OneAlbaniaColors.background.light,
      text: colorScheme === 'dark' ? OneAlbaniaColors.text.dark.primary : OneAlbaniaColors.text.light.primary,
      surface: colorScheme === 'dark' ? OneAlbaniaColors.grey[800] : OneAlbaniaColors.grey[50],
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <PaperProvider theme={paperTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </>
          ) : (
            <Stack.Screen name="login" />
          )}
        </Stack>
      </PaperProvider>
    </ThemeProvider>
  );
}
