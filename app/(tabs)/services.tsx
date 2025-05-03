import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, List, Divider } from 'react-native-paper';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { OneAlbaniaColors } from '@/constants/OneAlbaniaColors';

// Mock data for telecom lines
const telecomLines = [
  { id: 1, number: '+355 69 123 4567', plan: 'Business Premium', status: 'active', dataUsage: '12.5 GB', callMinutes: '320 min', smsCount: '45' },
  { id: 2, number: '+355 69 234 5678', plan: 'Business Standard', status: 'active', dataUsage: '8.2 GB', callMinutes: '210 min', smsCount: '28' },
  { id: 3, number: '+355 69 345 6789', plan: 'Business Basic', status: 'active', dataUsage: '5.7 GB', callMinutes: '150 min', smsCount: '15' },
  { id: 4, number: '+355 69 456 7890', plan: 'Business Premium', status: 'active', dataUsage: '15.3 GB', callMinutes: '280 min', smsCount: '32' },
];

export default function ServiceOverviewScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.sectionTitle}>Active Telecom Lines</ThemedText>
        
        {telecomLines.map((line) => (
          <Card key={line.id} style={styles.card}>
            <Card.Content>
              <Title style={styles.phoneNumber}>{line.number}</Title>
              <Paragraph style={styles.planName}>{line.plan}</Paragraph>
              
              <Divider style={styles.divider} />
              
              <List.Section>
                <List.Item 
                  title="Data Usage" 
                  description={line.dataUsage}
                  left={props => <List.Icon {...props} icon="data-matrix" color={OneAlbaniaColors.primary} />}
                />
                <List.Item 
                  title="Call Minutes" 
                  description={line.callMinutes}
                  left={props => <List.Icon {...props} icon="phone" color={OneAlbaniaColors.primary} />}
                />
                <List.Item 
                  title="SMS Count" 
                  description={line.smsCount}
                  left={props => <List.Icon {...props} icon="message-text" color={OneAlbaniaColors.primary} />}
                />
              </List.Section>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: OneAlbaniaColors.primary,
  },
  planName: {
    fontSize: 14,
    color: OneAlbaniaColors.grey[600],
  },
  divider: {
    marginVertical: 12,
  },
});
