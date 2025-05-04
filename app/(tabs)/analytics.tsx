import React from 'react';
import { StyleSheet, ScrollView, Dimensions, View } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLine, VictoryGroup } from 'victory-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { OneAlbaniaColors } from '@/constants/OneAlbaniaColors';

// Mock data for usage history
const usageHistory = [
  { month: 'Jan', data: 35, calls: 12, sms: 8 },
  { month: 'Feb', data: 28, calls: 10, sms: 6 },
  { month: 'Mar', data: 42, calls: 15, sms: 9 },
  { month: 'Apr', data: 38, calls: 14, sms: 7 },
  { month: 'May', data: 45, calls: 16, sms: 10 },
  { month: 'Jun', data: 50, calls: 18, sms: 12 },
];

// Mock data for usage alerts
const usageAlerts = [
  { id: 1, type: 'data', message: 'Line +355 69 123 4567 has reached 80% of data limit', severity: 'warning' },
  { id: 2, type: 'calls', message: 'Line +355 69 234 5678 has exceeded call minutes limit', severity: 'error' },
];

export default function AnalyticsScreen() {
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.sectionTitle}>Usage Trends</ThemedText>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Data Usage (GB)</Title>
            <VictoryChart
              theme={VictoryTheme.material}
              width={screenWidth - 64}
              height={220}
              domainPadding={20}
            >
              <VictoryAxis
                tickValues={usageHistory.map((_, i) => i)}
                tickFormat={usageHistory.map(point => point.month)}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(x) => `${x} GB`}
              />
              <VictoryBar
                data={usageHistory}
                x="month"
                y="data"
                style={{
                  data: { fill: OneAlbaniaColors.primary }
                }}
              />
            </VictoryChart>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Call Minutes & SMS</Title>
            <VictoryChart
              theme={VictoryTheme.material}
              width={screenWidth - 64}
              height={220}
            >
              <VictoryAxis
                tickValues={usageHistory.map((_, i) => i)}
                tickFormat={usageHistory.map(point => point.month)}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={(x) => `${x}`}
              />
              <VictoryGroup>
                <VictoryLine
                  data={usageHistory}
                  x="month"
                  y="calls"
                  style={{
                    data: { stroke: OneAlbaniaColors.secondary, strokeWidth: 3 }
                  }}
                />
                <VictoryLine
                  data={usageHistory}
                  x="month"
                  y="sms"
                  style={{
                    data: { stroke: OneAlbaniaColors.info, strokeWidth: 3 }
                  }}
                />
              </VictoryGroup>
            </VictoryChart>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: OneAlbaniaColors.secondary }]} />
                <Paragraph>Call Minutes</Paragraph>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: OneAlbaniaColors.info }]} />
                <Paragraph>SMS</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <ThemedText type="title" style={styles.sectionTitle}>Usage Alerts</ThemedText>
        
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
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
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
});
