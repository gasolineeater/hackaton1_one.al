import React, { useState } from 'react';
import { StyleSheet, ScrollView, Dimensions, View, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip, Button, SegmentedButtons, Menu, Divider } from 'react-native-paper';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryLine, VictoryGroup, VictoryPie, VictoryLabel } from 'victory-native';
import { MaterialIcons } from '@expo/vector-icons';

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
  { id: 3, type: 'roaming', message: 'Line +355 69 345 6789 has activated roaming in Italy', severity: 'info' },
];

// Mock data for telecom lines
const telecomLines = [
  { id: 1, number: '+355 69 123 4567', plan: 'Business Premium', dataUsage: 12.5, callMinutes: 320, smsCount: 45 },
  { id: 2, number: '+355 69 234 5678', plan: 'Business Standard', dataUsage: 8.2, callMinutes: 210, smsCount: 28 },
  { id: 3, number: '+355 69 345 6789', plan: 'Business Basic', dataUsage: 5.7, callMinutes: 150, smsCount: 15 },
  { id: 4, number: '+355 69 456 7890', plan: 'Business Premium', dataUsage: 15.3, callMinutes: 280, smsCount: 32 },
];

// Mock data for usage breakdown
const usageBreakdown = {
  data: [
    { x: 'Web', y: 45 },
    { x: 'Video', y: 25 },
    { x: 'Social', y: 20 },
    { x: 'Other', y: 10 },
  ],
  calls: [
    { x: 'Local', y: 65 },
    { x: 'International', y: 15 },
    { x: 'Roaming', y: 10 },
    { x: 'Toll-free', y: 10 },
  ],
};

// Mock data for peak usage times
const peakUsageTimes = [
  { hour: '6am', value: 10 },
  { hour: '9am', value: 45 },
  { hour: '12pm', value: 30 },
  { hour: '3pm', value: 60 },
  { hour: '6pm', value: 85 },
  { hour: '9pm', value: 70 },
  { hour: '12am', value: 25 },
];

export default function AnalyticsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedLine, setSelectedLine] = useState(telecomLines[0]);
  const [selectedBreakdown, setSelectedBreakdown] = useState('data');
  const [timeRange, setTimeRange] = useState('6months');
  const [menuVisible, setMenuVisible] = useState(false);

  const handleLineSelect = (line) => {
    setSelectedLine(line);
    setSelectedView('lineDetails');
  };

  const getChipColor = (severity) => {
    switch(severity) {
      case 'error': return OneAlbaniaColors.error;
      case 'warning': return OneAlbaniaColors.warning;
      case 'info': return OneAlbaniaColors.info;
      default: return OneAlbaniaColors.primary;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SegmentedButtons
        value={selectedView}
        onValueChange={setSelectedView}
        buttons={[
          { value: 'overview', label: 'Overview' },
          { value: 'lineDetails', label: 'Line Details' },
          { value: 'breakdown', label: 'Breakdown' }
        ]}
        style={styles.segmentedButtons}
      />

      <ScrollView>
        {selectedView === 'overview' && (
          <>
            <View style={styles.headerRow}>
              <ThemedText type="title" style={styles.sectionTitle}>Usage Trends</ThemedText>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisible(true)}
                    style={styles.timeRangeButton}
                    icon="calendar"
                  >
                    {timeRange === '6months' ? 'Last 6 Months' :
                     timeRange === '3months' ? 'Last 3 Months' : 'Last Month'}
                  </Button>
                }
              >
                <Menu.Item onPress={() => {setTimeRange('1month'); setMenuVisible(false);}} title="Last Month" />
                <Menu.Item onPress={() => {setTimeRange('3months'); setMenuVisible(false);}} title="Last 3 Months" />
                <Menu.Item onPress={() => {setTimeRange('6months'); setMenuVisible(false);}} title="Last 6 Months" />
              </Menu>
            </View>

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

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Peak Usage Times</Title>
                <VictoryChart
                  theme={VictoryTheme.material}
                  width={screenWidth - 64}
                  height={220}
                  domainPadding={20}
                >
                  <VictoryAxis
                    tickValues={peakUsageTimes.map((_, i) => i)}
                    tickFormat={peakUsageTimes.map(point => point.hour)}
                  />
                  <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => `${x}%`}
                  />
                  <VictoryLine
                    data={peakUsageTimes}
                    x="hour"
                    y="value"
                    style={{
                      data: { stroke: OneAlbaniaColors.primary, strokeWidth: 3 }
                    }}
                  />
                </VictoryChart>
                <Paragraph style={styles.chartDescription}>
                  Peak usage occurs between 6PM and 9PM. Consider scheduling large data transfers outside these hours.
                </Paragraph>
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
                        { borderColor: getChipColor(alert.severity) }
                      ]}
                      textStyle={{
                        color: getChipColor(alert.severity)
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
          </>
        )}

        {selectedView === 'lineDetails' && (
          <>
            <View style={styles.headerRow}>
              <ThemedText type="title" style={styles.sectionTitle}>Line Details</ThemedText>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisible(true)}
                    style={styles.lineSelectButton}
                    icon="phone-android"
                  >
                    {selectedLine.number.substring(selectedLine.number.length - 4)}
                  </Button>
                }
              >
                {telecomLines.map(line => (
                  <Menu.Item
                    key={line.id}
                    onPress={() => {
                      setSelectedLine(line);
                      setMenuVisible(false);
                    }}
                    title={line.number}
                  />
                ))}
              </Menu>
            </View>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.lineTitle}>{selectedLine.number}</Title>
                <Paragraph style={styles.linePlan}>{selectedLine.plan}</Paragraph>

                <Divider style={styles.divider} />

                <View style={styles.usageStatsContainer}>
                  <View style={styles.usageStat}>
                    <MaterialIcons name="data-usage" size={24} color={OneAlbaniaColors.primary} />
                    <View style={styles.usageStatText}>
                      <Paragraph style={styles.usageStatLabel}>Data Usage</Paragraph>
                      <ThemedText type="subtitle" style={styles.usageStatValue}>{selectedLine.dataUsage} GB</ThemedText>
                    </View>
                  </View>

                  <View style={styles.usageStat}>
                    <MaterialIcons name="phone" size={24} color={OneAlbaniaColors.primary} />
                    <View style={styles.usageStatText}>
                      <Paragraph style={styles.usageStatLabel}>Call Minutes</Paragraph>
                      <ThemedText type="subtitle" style={styles.usageStatValue}>{selectedLine.callMinutes} min</ThemedText>
                    </View>
                  </View>

                  <View style={styles.usageStat}>
                    <MaterialIcons name="message" size={24} color={OneAlbaniaColors.primary} />
                    <View style={styles.usageStatText}>
                      <Paragraph style={styles.usageStatLabel}>SMS Count</Paragraph>
                      <ThemedText type="subtitle" style={styles.usageStatValue}>{selectedLine.smsCount}</ThemedText>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Monthly Usage Trend</Title>
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
                <Paragraph style={styles.chartDescription}>
                  This line's data usage has increased by 42% over the last 6 months.
                </Paragraph>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Usage Recommendations</Title>
                <View style={styles.recommendationItem}>
                  <MaterialIcons name="lightbulb" size={24} color={OneAlbaniaColors.warning} style={styles.recommendationIcon} />
                  <Paragraph style={styles.recommendationText}>
                    Based on usage patterns, upgrading to Business Premium Plus could save €15/month.
                  </Paragraph>
                </View>
                <View style={styles.recommendationItem}>
                  <MaterialIcons name="lightbulb" size={24} color={OneAlbaniaColors.warning} style={styles.recommendationIcon} />
                  <Paragraph style={styles.recommendationText}>
                    Setting a data cap of 15GB would prevent overages and optimize costs.
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>
          </>
        )}

        {selectedView === 'breakdown' && (
          <>
            <View style={styles.headerRow}>
              <ThemedText type="title" style={styles.sectionTitle}>Usage Breakdown</ThemedText>
              <SegmentedButtons
                value={selectedBreakdown}
                onValueChange={setSelectedBreakdown}
                buttons={[
                  { value: 'data', label: 'Data' },
                  { value: 'calls', label: 'Calls' }
                ]}
                style={styles.breakdownButtons}
              />
            </View>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>
                  {selectedBreakdown === 'data' ? 'Data Usage Breakdown' : 'Call Minutes Breakdown'}
                </Title>
                <View style={styles.pieChartContainer}>
                  <VictoryPie
                    data={selectedBreakdown === 'data' ? usageBreakdown.data : usageBreakdown.calls}
                    colorScale={[
                      OneAlbaniaColors.primary,
                      OneAlbaniaColors.secondary,
                      OneAlbaniaColors.info,
                      OneAlbaniaColors.grey[400]
                    ]}
                    width={screenWidth - 64}
                    height={250}
                    innerRadius={70}
                    labelRadius={({ innerRadius }) => innerRadius + 30}
                    style={{ labels: { fill: "black", fontSize: 14, fontWeight: "bold" } }}
                    labels={({ datum }) => `${datum.y}%`}
                  />
                </View>

                <View style={styles.breakdownLegend}>
                  {(selectedBreakdown === 'data' ? usageBreakdown.data : usageBreakdown.calls).map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          {
                            backgroundColor: [
                              OneAlbaniaColors.primary,
                              OneAlbaniaColors.secondary,
                              OneAlbaniaColors.info,
                              OneAlbaniaColors.grey[400]
                            ][index]
                          }
                        ]}
                      />
                      <Paragraph>{item.x} ({item.y}%)</Paragraph>
                    </View>
                  ))}
                </View>

                <Paragraph style={styles.chartDescription}>
                  {selectedBreakdown === 'data'
                    ? 'Web browsing accounts for nearly half of all data usage across your business lines.'
                    : 'Local calls make up the majority of your call minutes, with international calls at 15%.'}
                </Paragraph>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Optimization Opportunities</Title>
                {selectedBreakdown === 'data' ? (
                  <>
                    <View style={styles.recommendationItem}>
                      <MaterialIcons name="lightbulb" size={24} color={OneAlbaniaColors.warning} style={styles.recommendationIcon} />
                      <Paragraph style={styles.recommendationText}>
                        Consider a video optimization plan to reduce streaming data usage by up to 40%.
                      </Paragraph>
                    </View>
                    <View style={styles.recommendationItem}>
                      <MaterialIcons name="lightbulb" size={24} color={OneAlbaniaColors.warning} style={styles.recommendationIcon} />
                      <Paragraph style={styles.recommendationText}>
                        Implementing Wi-Fi offloading could reduce mobile data consumption by 25%.
                      </Paragraph>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.recommendationItem}>
                      <MaterialIcons name="lightbulb" size={24} color={OneAlbaniaColors.warning} style={styles.recommendationIcon} />
                      <Paragraph style={styles.recommendationText}>
                        Adding the International Calling Package would reduce costs by €25/month.
                      </Paragraph>
                    </View>
                    <View style={styles.recommendationItem}>
                      <MaterialIcons name="lightbulb" size={24} color={OneAlbaniaColors.warning} style={styles.recommendationIcon} />
                      <Paragraph style={styles.recommendationText}>
                        Using VoIP for international calls could save up to 60% on calling costs.
                      </Paragraph>
                    </View>
                  </>
                )}
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
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
    marginVertical: 4,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeRangeButton: {
    borderColor: OneAlbaniaColors.primary,
  },
  lineSelectButton: {
    borderColor: OneAlbaniaColors.primary,
  },
  chartDescription: {
    marginTop: 8,
    fontStyle: 'italic',
    color: OneAlbaniaColors.grey[600],
  },
  lineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: OneAlbaniaColors.primary,
  },
  linePlan: {
    fontSize: 14,
    color: OneAlbaniaColors.grey[600],
  },
  divider: {
    marginVertical: 12,
  },
  usageStatsContainer: {
    marginTop: 8,
  },
  usageStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  usageStatText: {
    marginLeft: 12,
  },
  usageStatLabel: {
    fontSize: 14,
    color: OneAlbaniaColors.grey[600],
  },
  usageStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  recommendationIcon: {
    marginRight: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  breakdownButtons: {
    width: 150,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  breakdownLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },
});
