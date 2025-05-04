import React from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, ProgressBar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { OneAlbaniaColors } from '@/constants/OneAlbaniaColors';

// Mock data for quick stats
const quickStats = [
  { title: 'Active Lines', value: '4', icon: 'phone-in-talk', color: OneAlbaniaColors.primary },
  { title: 'Data Usage', value: '42.5 GB', icon: 'data-usage', color: OneAlbaniaColors.secondary },
  { title: 'Monthly Cost', value: '€175', icon: 'euro-symbol', color: OneAlbaniaColors.success },
  { title: 'Active Alerts', value: '2', icon: 'warning', color: OneAlbaniaColors.warning },
];

// Mock data for promotional banners
const promotionalBanners = [
  {
    id: 1,
    title: "Summer Business Offer",
    description: "Get 50% extra data on all business plans this summer!",
    buttonText: "Learn More",
    color: OneAlbaniaColors.primary
  },
  {
    id: 2,
    title: "New Business Ultimate Plan",
    description: "Unlimited data, calls, and premium support for your business",
    buttonText: "Explore Plan",
    color: OneAlbaniaColors.secondary
  },
];

// Mock data for usage alerts
const usageAlerts = [
  { id: 1, type: 'data', message: 'Line +355 69 123 4567 has reached 80% of data limit', severity: 'warning' },
  { id: 2, type: 'calls', message: 'Line +355 69 234 5678 has exceeded call minutes limit', severity: 'error' },
];

export default function DashboardScreen() {
  const [currentBanner, setCurrentBanner] = React.useState(0);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % promotionalBanners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Welcome Banner */}
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <ThemedText type="title">Welcome to ONE Albania</ThemedText>
            <ThemedText>Your SME Dashboard</ThemedText>
          </Card.Content>
        </Card>
        
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {quickStats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <Card.Content style={styles.statContent}>
                <MaterialIcons name={stat.icon} size={24} color={stat.color} />
                <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
                <ThemedText style={styles.statTitle}>{stat.title}</ThemedText>
              </Card.Content>
            </Card>
          ))}
        </View>
        
        {/* Promotional Banner */}
        <Card style={[styles.promoCard, { backgroundColor: promotionalBanners[currentBanner].color }]}>
          <Card.Content>
            <ThemedText style={styles.promoTitle}>{promotionalBanners[currentBanner].title}</ThemedText>
            <ThemedText style={styles.promoDescription}>{promotionalBanners[currentBanner].description}</ThemedText>
            <Button 
              mode="contained" 
              style={styles.promoButton}
              buttonColor="#fff"
              textColor={promotionalBanners[currentBanner].color}
            >
              {promotionalBanners[currentBanner].buttonText}
            </Button>
          </Card.Content>
        </Card>
        
        {/* Usage Progress */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Data Usage</Title>
            <View style={styles.usageRow}>
              <Paragraph>42.5 GB used of 50 GB</Paragraph>
              <Paragraph>85%</Paragraph>
            </View>
            <ProgressBar progress={0.85} color={OneAlbaniaColors.primary} style={styles.progressBar} />
          </Card.Content>
        </Card>
        
        {/* Alerts */}
        <ThemedText type="title" style={styles.sectionTitle}>Alerts</ThemedText>
        
        {usageAlerts.map(alert => (
          <Card key={alert.id} style={styles.card}>
            <Card.Content>
              <View style={styles.alertHeader}>
                <Chip 
                  mode="outlined" 
                  style={[
                    styles.alertChip,
                    { borderColor: alert.severity === 'warning' ? OneAlbaniaColors.warning : OneAlbaniaColors.error }
                  ]}
                  textStyle={{ 
                    color: alert.severity === 'warning' ? OneAlbaniaColors.warning : OneAlbaniaColors.error 
                  }}
                >
                  {alert.severity.toUpperCase()}
                </Chip>
                <Chip 
                  mode="outlined" 
                  style={styles.typeChip}
                >
                  {alert.type.toUpperCase()}
                </Chip>
              </View>
              <Paragraph style={styles.alertMessage}>{alert.message}</Paragraph>
            </Card.Content>
          </Card>
        ))}
        
        {/* Quick Actions */}
        <ThemedText type="title" style={styles.sectionTitle}>Quick Actions</ThemedText>
        
        <View style={styles.actionsContainer}>
          <Card style={styles.actionCard} onPress={() => {}}>
            <Card.Content style={styles.actionContent}>
              <MaterialIcons name="add-circle" size={32} color={OneAlbaniaColors.primary} />
              <ThemedText style={styles.actionText}>Add Line</ThemedText>
            </Card.Content>
          </Card>
          
          <Card style={styles.actionCard} onPress={() => {}}>
            <Card.Content style={styles.actionContent}>
              <MaterialIcons name="payment" size={32} color={OneAlbaniaColors.primary} />
              <ThemedText style={styles.actionText}>Pay Bill</ThemedText>
            </Card.Content>
          </Card>
          
          <Card style={styles.actionCard} onPress={() => {}}>
            <Card.Content style={styles.actionContent}>
              <MaterialIcons name="support-agent" size={32} color={OneAlbaniaColors.primary} />
              <ThemedText style={styles.actionText}>Support</ThemedText>
            </Card.Content>
          </Card>
          
          <Card style={styles.actionCard} onPress={() => {}}>
            <Card.Content style={styles.actionContent}>
              <MaterialIcons name="settings" size={32} color={OneAlbaniaColors.primary} />
              <ThemedText style={styles.actionText}>Settings</ThemedText>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: OneAlbaniaColors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 8,
  },
  statContent: {
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statTitle: {
    fontSize: 12,
    color: OneAlbaniaColors.grey[600],
  },
  promoCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  promoDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  promoButton: {
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop: 8,
  },
  alertHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  alertChip: {
    marginRight: 8,
  },
  typeChip: {
    borderColor: OneAlbaniaColors.primary,
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 8,
  },
  actionContent: {
    alignItems: 'center',
    padding: 16,
  },
  actionText: {
    marginTop: 8,
    fontWeight: '500',
  },
});
