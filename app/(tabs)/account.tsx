import React from 'react';
import { StyleSheet, ScrollView, View, Image, Alert, ActivityIndicator } from 'react-native';
import { Card, Title, Paragraph, Button, List, Avatar, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { OneAlbaniaColors } from '@/constants/OneAlbaniaColors';
import { useAuthStore } from '@/store/authStore';

export default function AccountScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: () => {
            logout();
            router.replace('/login');
          },
          style: "destructive"
        }
      ]
    );
  };

  if (!user) {
    return (
      <ThemedView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={OneAlbaniaColors.primary} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <Avatar.Text
            size={80}
            label={user.name.split(' ').map(n => n[0]).join('')}
            style={styles.avatar}
            color="#fff"
            backgroundColor={OneAlbaniaColors.primary}
          />
          <View style={styles.profileInfo}>
            <ThemedText type="title">{user.name}</ThemedText>
            <ThemedText>{user.company}</ThemedText>
            <ThemedText style={styles.accountNumber}>Account: {user.accountNumber}</ThemedText>
          </View>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Contact Information</Title>
            <List.Item
              title="Email"
              description={user.email}
              left={props => <List.Icon {...props} icon="email" color={OneAlbaniaColors.primary} />}
            />
            <Divider />
            <List.Item
              title="Phone"
              description={user.phone}
              left={props => <List.Icon {...props} icon="phone" color={OneAlbaniaColors.primary} />}
            />
            <Divider />
            <List.Item
              title="Address"
              description={user.address}
              left={props => <List.Icon {...props} icon="map-marker" color={OneAlbaniaColors.primary} />}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Account Settings</Title>
            <List.Item
              title="Notifications"
              description="Manage your notification preferences"
              left={props => <List.Icon {...props} icon="bell" color={OneAlbaniaColors.primary} />}
              right={props => <MaterialIcons {...props} name="chevron-right" size={24} color={OneAlbaniaColors.grey[500]} />}
              onPress={() => {}}
              style={styles.settingsItem}
            />
            <Divider />
            <List.Item
              title="Security"
              description="Password and authentication settings"
              left={props => <List.Icon {...props} icon="shield" color={OneAlbaniaColors.primary} />}
              right={props => <MaterialIcons {...props} name="chevron-right" size={24} color={OneAlbaniaColors.grey[500]} />}
              onPress={() => {}}
              style={styles.settingsItem}
            />
            <Divider />
            <List.Item
              title="Billing Preferences"
              description="Manage payment methods and billing options"
              left={props => <List.Icon {...props} icon="credit-card" color={OneAlbaniaColors.primary} />}
              right={props => <MaterialIcons {...props} name="chevron-right" size={24} color={OneAlbaniaColors.grey[500]} />}
              onPress={() => {}}
              style={styles.settingsItem}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Support</Title>
            <List.Item
              title="Contact Support"
              description="Get help from our customer service team"
              left={props => <List.Icon {...props} icon="headset" color={OneAlbaniaColors.primary} />}
              right={props => <MaterialIcons {...props} name="chevron-right" size={24} color={OneAlbaniaColors.grey[500]} />}
              onPress={() => {}}
              style={styles.settingsItem}
            />
            <Divider />
            <List.Item
              title="FAQs"
              description="Frequently asked questions"
              left={props => <List.Icon {...props} icon="help-circle" color={OneAlbaniaColors.primary} />}
              right={props => <MaterialIcons {...props} name="chevron-right" size={24} color={OneAlbaniaColors.grey[500]} />}
              onPress={() => {}}
              style={styles.settingsItem}
            />
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          style={styles.logoutButton}
          textColor={OneAlbaniaColors.error}
          icon="logout"
          onPress={handleLogout}
        >
          Log Out
        </Button>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  accountNumber: {
    marginTop: 4,
    fontSize: 12,
    color: OneAlbaniaColors.grey[600],
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: OneAlbaniaColors.primary,
  },
  settingsItem: {
    paddingVertical: 8,
  },
  logoutButton: {
    marginVertical: 24,
    borderColor: OneAlbaniaColors.error,
    borderWidth: 1,
  },
});
