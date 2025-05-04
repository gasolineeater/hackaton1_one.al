import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, List, Divider, Switch, Button, Chip, IconButton, Menu } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { OneAlbaniaColors } from '@/constants/OneAlbaniaColors';

// Mock data for telecom lines
const telecomLines = [
  {
    id: 1,
    number: '+355 69 123 4567',
    plan: 'Business Premium',
    status: 'active',
    dataUsage: '12.5 GB',
    callMinutes: '320 min',
    smsCount: '45',
    services: {
      roaming: true,
      internationalCalls: true,
      dataCap: '15 GB',
      voiceMail: true,
      callForwarding: false
    }
  },
  {
    id: 2,
    number: '+355 69 234 5678',
    plan: 'Business Standard',
    status: 'active',
    dataUsage: '8.2 GB',
    callMinutes: '210 min',
    smsCount: '28',
    services: {
      roaming: false,
      internationalCalls: true,
      dataCap: '10 GB',
      voiceMail: true,
      callForwarding: true
    }
  },
  {
    id: 3,
    number: '+355 69 345 6789',
    plan: 'Business Basic',
    status: 'active',
    dataUsage: '5.7 GB',
    callMinutes: '150 min',
    smsCount: '15',
    services: {
      roaming: false,
      internationalCalls: false,
      dataCap: '5 GB',
      voiceMail: false,
      callForwarding: false
    }
  },
  {
    id: 4,
    number: '+355 69 456 7890',
    plan: 'Business Premium',
    status: 'active',
    dataUsage: '15.3 GB',
    callMinutes: '280 min',
    smsCount: '32',
    services: {
      roaming: true,
      internationalCalls: true,
      dataCap: '15 GB',
      voiceMail: true,
      callForwarding: true
    }
  },
];

// Mock data for service packages
const servicePackages = {
  roaming: [
    { id: 'r1', name: 'Europe Basic', data: '1 GB', calls: '60 min', price: '€5/day' },
    { id: 'r2', name: 'Europe Plus', data: '3 GB', calls: '120 min', price: '€10/day' },
    { id: 'r3', name: 'Global Basic', data: '500 MB', calls: '30 min', price: '€10/day' },
    { id: 'r4', name: 'Global Plus', data: '1 GB', calls: '60 min', price: '€15/day' },
  ],
  international: [
    { id: 'i1', name: 'Europe Package', calls: '300 min', price: '€15/month' },
    { id: 'i2', name: 'Balkans Package', calls: '500 min', price: '€10/month' },
    { id: 'i3', name: 'USA & Canada', calls: '120 min', price: '€20/month' },
    { id: 'i4', name: 'Global Package', calls: '60 min', price: '€25/month' },
  ],
  dataPacks: [
    { id: 'd1', name: 'Data Boost 1GB', data: '1 GB', validity: '30 days', price: '€5' },
    { id: 'd2', name: 'Data Boost 5GB', data: '5 GB', validity: '30 days', price: '€15' },
    { id: 'd3', name: 'Data Boost 10GB', data: '10 GB', validity: '30 days', price: '€25' },
    { id: 'd4', name: 'Weekend Unlimited', data: 'Unlimited', validity: 'Weekend only', price: '€10' },
  ]
};

export default function ServiceOverviewScreen() {
  const [selectedLine, setSelectedLine] = useState(telecomLines[0]);
  const [expandedSection, setExpandedSection] = useState('lines');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedPackageType, setSelectedPackageType] = useState('');

  // State for service toggles
  const [serviceStates, setServiceStates] = useState(
    telecomLines.reduce((acc, line) => {
      acc[line.id] = { ...line.services };
      return acc;
    }, {})
  );

  const toggleService = (lineId, service) => {
    setServiceStates(prev => ({
      ...prev,
      [lineId]: {
        ...prev[lineId],
        [service]: !prev[lineId][service]
      }
    }));
  };

  const handleLineSelect = (line) => {
    setSelectedLine(line);
    setExpandedSection('services');
  };

  const openPackageMenu = (event, type) => {
    setMenuVisible(true);
    setSelectedPackageType(type);
  };

  const handleAddPackage = (packageId) => {
    // In a real app, this would call an API to add the package
    setMenuVisible(false);
    // Show success message
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Section Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, expandedSection === 'lines' && styles.activeTab]}
            onPress={() => setExpandedSection('lines')}
          >
            <MaterialIcons name="phone-android" size={24} color={expandedSection === 'lines' ? OneAlbaniaColors.primary : OneAlbaniaColors.grey[600]} />
            <ThemedText style={[styles.tabText, expandedSection === 'lines' && styles.activeTabText]}>Lines</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, expandedSection === 'services' && styles.activeTab]}
            onPress={() => setExpandedSection('services')}
          >
            <MaterialIcons name="settings" size={24} color={expandedSection === 'services' ? OneAlbaniaColors.primary : OneAlbaniaColors.grey[600]} />
            <ThemedText style={[styles.tabText, expandedSection === 'services' && styles.activeTabText]}>Services</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, expandedSection === 'packages' && styles.activeTab]}
            onPress={() => setExpandedSection('packages')}
          >
            <MaterialIcons name="add-box" size={24} color={expandedSection === 'packages' ? OneAlbaniaColors.primary : OneAlbaniaColors.grey[600]} />
            <ThemedText style={[styles.tabText, expandedSection === 'packages' && styles.activeTabText]}>Add-ons</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Lines Section */}
        {expandedSection === 'lines' && (
          <>
            <ThemedText type="title" style={styles.sectionTitle}>Active Telecom Lines</ThemedText>

            {telecomLines.map((line) => (
              <Card key={line.id} style={styles.card}>
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View>
                      <Title style={styles.phoneNumber}>{line.number}</Title>
                      <Paragraph style={styles.planName}>{line.plan}</Paragraph>
                    </View>
                    <Button
                      mode="contained"
                      onPress={() => handleLineSelect(line)}
                      style={styles.manageButton}
                      buttonColor={OneAlbaniaColors.primary}
                    >
                      Manage
                    </Button>
                  </View>

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

                  <View style={styles.serviceChips}>
                    {serviceStates[line.id].roaming && (
                      <Chip
                        icon="earth"
                        style={styles.chip}
                        textStyle={{ color: OneAlbaniaColors.primary }}
                      >
                        Roaming
                      </Chip>
                    )}
                    {serviceStates[line.id].internationalCalls && (
                      <Chip
                        icon="phone-outgoing"
                        style={styles.chip}
                        textStyle={{ color: OneAlbaniaColors.primary }}
                      >
                        Int'l Calls
                      </Chip>
                    )}
                    {serviceStates[line.id].voiceMail && (
                      <Chip
                        icon="voicemail"
                        style={styles.chip}
                        textStyle={{ color: OneAlbaniaColors.primary }}
                      >
                        Voicemail
                      </Chip>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}

        {/* Services Management Section */}
        {expandedSection === 'services' && (
          <>
            <View style={styles.lineSelector}>
              <ThemedText type="title" style={styles.sectionTitle}>
                Manage Services: {selectedLine.number}
              </ThemedText>
              <Button
                mode="outlined"
                onPress={() => setExpandedSection('lines')}
                style={styles.backButton}
                textColor={OneAlbaniaColors.primary}
              >
                Back to Lines
              </Button>
            </View>

            <Card style={styles.card}>
              <Card.Content>
                <List.Item
                  title="Roaming"
                  description="Enable international roaming for this line"
                  left={props => <List.Icon {...props} icon="earth" color={OneAlbaniaColors.primary} />}
                  right={() => (
                    <Switch
                      value={serviceStates[selectedLine.id].roaming}
                      onValueChange={() => toggleService(selectedLine.id, 'roaming')}
                      color={OneAlbaniaColors.primary}
                    />
                  )}
                />

                <Divider style={styles.divider} />

                <List.Item
                  title="International Calls"
                  description="Enable international calling for this line"
                  left={props => <List.Icon {...props} icon="phone-outgoing" color={OneAlbaniaColors.primary} />}
                  right={() => (
                    <Switch
                      value={serviceStates[selectedLine.id].internationalCalls}
                      onValueChange={() => toggleService(selectedLine.id, 'internationalCalls')}
                      color={OneAlbaniaColors.primary}
                    />
                  )}
                />

                <Divider style={styles.divider} />

                <List.Item
                  title="Voicemail"
                  description="Enable voicemail service for this line"
                  left={props => <List.Icon {...props} icon="voicemail" color={OneAlbaniaColors.primary} />}
                  right={() => (
                    <Switch
                      value={serviceStates[selectedLine.id].voiceMail}
                      onValueChange={() => toggleService(selectedLine.id, 'voiceMail')}
                      color={OneAlbaniaColors.primary}
                    />
                  )}
                />

                <Divider style={styles.divider} />

                <List.Item
                  title="Call Forwarding"
                  description="Enable call forwarding for this line"
                  left={props => <List.Icon {...props} icon="call-merge" color={OneAlbaniaColors.primary} />}
                  right={() => (
                    <Switch
                      value={serviceStates[selectedLine.id].callForwarding}
                      onValueChange={() => toggleService(selectedLine.id, 'callForwarding')}
                      color={OneAlbaniaColors.primary}
                    />
                  )}
                />
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Data Cap Management</Title>
                <Paragraph style={styles.cardDescription}>
                  Current data cap: {selectedLine.services.dataCap}
                </Paragraph>

                <View style={styles.dataCapOptions}>
                  <Button
                    mode="outlined"
                    onPress={() => {}}
                    style={styles.dataCapButton}
                    textColor={OneAlbaniaColors.primary}
                  >
                    5 GB
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => {}}
                    style={styles.dataCapButton}
                    textColor={OneAlbaniaColors.primary}
                  >
                    10 GB
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => {}}
                    style={styles.dataCapButton}
                    textColor={OneAlbaniaColors.primary}
                  >
                    15 GB
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => {}}
                    style={styles.dataCapButton}
                    textColor={OneAlbaniaColors.primary}
                  >
                    20 GB
                  </Button>
                </View>

                <Button
                  mode="contained"
                  onPress={() => {}}
                  style={styles.applyButton}
                  buttonColor={OneAlbaniaColors.primary}
                >
                  Apply Changes
                </Button>
              </Card.Content>
            </Card>
          </>
        )}

        {/* Add-on Packages Section */}
        {expandedSection === 'packages' && (
          <>
            <ThemedText type="title" style={styles.sectionTitle}>Add Service Packages</ThemedText>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Roaming Packages</Title>
                <Paragraph style={styles.cardDescription}>
                  Add roaming packages for international travel
                </Paragraph>

                <View style={styles.packageList}>
                  {servicePackages.roaming.map(pkg => (
                    <Card key={pkg.id} style={styles.packageCard}>
                      <Card.Content>
                        <Title style={styles.packageTitle}>{pkg.name}</Title>
                        <View style={styles.packageDetails}>
                          <Chip icon="data-matrix" style={styles.packageChip}>{pkg.data}</Chip>
                          <Chip icon="phone" style={styles.packageChip}>{pkg.calls}</Chip>
                        </View>
                        <Paragraph style={styles.packagePrice}>{pkg.price}</Paragraph>
                        <Button
                          mode="contained"
                          onPress={() => {}}
                          style={styles.addPackageButton}
                          buttonColor={OneAlbaniaColors.primary}
                        >
                          Add
                        </Button>
                      </Card.Content>
                    </Card>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>International Calling Packages</Title>
                <Paragraph style={styles.cardDescription}>
                  Add packages for international calls
                </Paragraph>

                <View style={styles.packageList}>
                  {servicePackages.international.map(pkg => (
                    <Card key={pkg.id} style={styles.packageCard}>
                      <Card.Content>
                        <Title style={styles.packageTitle}>{pkg.name}</Title>
                        <View style={styles.packageDetails}>
                          <Chip icon="phone" style={styles.packageChip}>{pkg.calls}</Chip>
                        </View>
                        <Paragraph style={styles.packagePrice}>{pkg.price}</Paragraph>
                        <Button
                          mode="contained"
                          onPress={() => {}}
                          style={styles.addPackageButton}
                          buttonColor={OneAlbaniaColors.primary}
                        >
                          Add
                        </Button>
                      </Card.Content>
                    </Card>
                  ))}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Data Add-on Packages</Title>
                <Paragraph style={styles.cardDescription}>
                  Add extra data packages to your plan
                </Paragraph>

                <View style={styles.packageList}>
                  {servicePackages.dataPacks.map(pkg => (
                    <Card key={pkg.id} style={styles.packageCard}>
                      <Card.Content>
                        <Title style={styles.packageTitle}>{pkg.name}</Title>
                        <View style={styles.packageDetails}>
                          <Chip icon="data-matrix" style={styles.packageChip}>{pkg.data}</Chip>
                          <Chip icon="calendar" style={styles.packageChip}>{pkg.validity}</Chip>
                        </View>
                        <Paragraph style={styles.packagePrice}>{pkg.price}</Paragraph>
                        <Button
                          mode="contained"
                          onPress={() => {}}
                          style={styles.addPackageButton}
                          buttonColor={OneAlbaniaColors.primary}
                        >
                          Add
                        </Button>
                      </Card.Content>
                    </Card>
                  ))}
                </View>
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: OneAlbaniaColors.grey[100],
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  activeTab: {
    backgroundColor: OneAlbaniaColors.grey[200],
    borderBottomWidth: 2,
    borderBottomColor: OneAlbaniaColors.primary,
  },
  tabText: {
    marginLeft: 4,
    fontSize: 14,
    color: OneAlbaniaColors.grey[600],
  },
  activeTabText: {
    color: OneAlbaniaColors.primary,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  manageButton: {
    borderRadius: 4,
  },
  serviceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
    borderColor: OneAlbaniaColors.primary,
  },
  lineSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    borderColor: OneAlbaniaColors.primary,
  },
  cardTitle: {
    fontSize: 18,
    color: OneAlbaniaColors.primary,
    marginBottom: 8,
  },
  cardDescription: {
    marginBottom: 16,
    color: OneAlbaniaColors.grey[600],
  },
  dataCapOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dataCapButton: {
    marginRight: 8,
    marginBottom: 8,
    borderColor: OneAlbaniaColors.primary,
  },
  applyButton: {
    alignSelf: 'flex-end',
  },
  packageList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  packageCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  packageTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  packageDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  packageChip: {
    marginRight: 4,
    marginBottom: 4,
    backgroundColor: OneAlbaniaColors.grey[100],
    height: 28,
  },
  packagePrice: {
    fontWeight: 'bold',
    color: OneAlbaniaColors.primary,
    marginBottom: 8,
  },
  addPackageButton: {
    borderRadius: 4,
    height: 36,
  },
});
