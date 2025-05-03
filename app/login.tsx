import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button, Checkbox, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { OneAlbaniaColors } from '@/constants/OneAlbaniaColors';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Show error message if login fails
    if (error) {
      setSnackbarVisible(true);
    }
  }, [error]);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    await login(email, password);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/one-albania-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ThemedText type="title" style={styles.title}>ONE Albania</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>SME Dashboard</ThemedText>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            outlineColor={OneAlbaniaColors.grey[400]}
            activeOutlineColor={OneAlbaniaColors.primary}
            left={<TextInput.Icon icon="email" color={OneAlbaniaColors.grey[600]} />}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={isLoading}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            mode="outlined"
            style={styles.input}
            outlineColor={OneAlbaniaColors.grey[400]}
            activeOutlineColor={OneAlbaniaColors.primary}
            left={<TextInput.Icon icon="lock" color={OneAlbaniaColors.grey[600]} />}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                color={OneAlbaniaColors.grey[600]}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            disabled={isLoading}
          />

          <View style={styles.optionsRow}>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => setRememberMe(!rememberMe)}
                color={OneAlbaniaColors.primary}
              />
              <ThemedText style={styles.rememberMeText}>Remember me</ThemedText>
            </View>

            <TouchableOpacity>
              <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            style={styles.loginButton}
            buttonColor={OneAlbaniaColors.primary}
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>

          <View style={styles.supportContainer}>
            <ThemedText style={styles.supportText}>Need help? Contact our support team</ThemedText>
            <Button
              mode="text"
              textColor={OneAlbaniaColors.primary}
              onPress={() => {}}
            >
              Contact Support
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => {
          setSnackbarVisible(false);
          clearError();
        }}
        action={{
          label: 'OK',
          onPress: () => {
            setSnackbarVisible(false);
            clearError();
          },
        }}
        style={{ backgroundColor: OneAlbaniaColors.error }}
      >
        {error}
      </Snackbar>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: OneAlbaniaColors.primary,
  },
  subtitle: {
    fontSize: 18,
    color: OneAlbaniaColors.grey[600],
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 8,
  },
  forgotPasswordText: {
    color: OneAlbaniaColors.primary,
  },
  loginButton: {
    marginBottom: 24,
    paddingVertical: 6,
  },
  supportContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  supportText: {
    textAlign: 'center',
    marginBottom: 8,
    color: OneAlbaniaColors.grey[600],
  },
});
