import React from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { VictoryPie, VictoryLabel } from 'victory-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { OneAlbaniaColors } from '@/constants/OneAlbaniaColors';

// Mock data for cost breakdown
const costBreakdown = [
  { name: 'Data', value: 45, color: OneAlbaniaColors.primary },
  { name: 'Calls', value: 30, color: OneAlbaniaColors.secondary },
  { name: 'SMS', value: 10, color: OneAlbaniaColors.info },
  { name: 'Roaming', value: 15, color: OneAlbaniaColors.warning },
];

// Mock data for monthly bills
const monthlyBills = [
  { month: 'January', amount: 175, status: 'paid' },
  { month: 'February', amount: 182, status: 'paid' },
  { month: 'March', amount: 168, status: 'paid' },
  { month: 'April', amount: 175, status: 'unpaid' },
];

export default function CostControlScreen() {
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.sectionTitle}>Cost Breakdown</ThemedText>
        
        <Card style={styles.card}>
          <Card.Content style={styles.chartContainer}>
            <VictoryPie
              data={costBreakdown}
              x="name"
              y="value"
              width={screenWidth * 0.8}
              height={220}
              colorScale={costBreakdown.map(item => item.color)}
              innerRadius={40}
              labelRadius={({ innerRadius }) => innerRadius + 30}
              labelComponent={
                <VictoryLabel
                  style={{ fill: '#333', fontSize: 12 }}
                  text={({ datum }) => `${datum.name}\n${datum.value}%`}
                />
              }
            />
          </Card.Content>
        </Card>
        
        <ThemedText type="title" style={styles.sectionTitle}>Monthly Bills</ThemedText>
        
        {monthlyBills.map((bill, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <View style={styles.billRow}>
                <View>
                  <Title style={styles.billMonth}>{bill.month}</Title>
                  <Paragraph style={styles.billAmount}>€{bill.amount}</Paragraph>
                </View>
                <View style={styles.statusContainer}>
                  <ThemedText 
                    style={[
                      styles.statusText, 
                      {color: bill.status === 'paid' ? OneAlbaniaColors.success : OneAlbaniaColors.warning}
                    ]}
                  >
                    {bill.status.toUpperCase()}
                  </ThemedText>
                  {bill.status === 'unpaid' && (
                    <Button 
                      mode="contained" 
                      style={styles.payButton}
                      buttonColor={OneAlbaniaColors.primary}
                    >
                      Pay Now
                    </Button>
                  )}
                </View>
              </View>
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
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billMonth: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  billAmount: {
    fontSize: 16,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  payButton: {
    borderRadius: 4,
  },
});
