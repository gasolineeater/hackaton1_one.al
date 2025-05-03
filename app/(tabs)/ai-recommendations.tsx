import React from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, List, Divider } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { OneAlbaniaColors } from '@/constants/OneAlbaniaColors';

// Mock data for AI recommendations
const aiRecommendations = [
  {
    id: "rec1",
    title: "Upgrade to Business Premium",
    description: "Based on your data usage patterns, upgrading to Business Premium would save you €10 per month.",
    savingsAmount: 10,
    priority: "high"
  },
  {
    id: "rec2",
    title: "Enable Data Caps",
    description: "Setting data caps on 3 lines would prevent overages and save approximately €15 per month.",
    savingsAmount: 15,
    priority: "medium"
  },
  {
    id: "rec3",
    title: "Optimize International Calls",
    description: "Your team makes frequent calls to Italy. Adding the Italy package would reduce costs by €8 per month.",
    savingsAmount: 8,
    priority: "medium"
  },
  {
    id: "rec4",
    title: "Consolidate Business Lines",
    description: "Merging 2 underutilized lines could save your business €22 per month.",
    savingsAmount: 22,
    priority: "high"
  }
];

export default function AIRecommendationsScreen() {
  const totalSavings = aiRecommendations.reduce((total, rec) => total + rec.savingsAmount, 0);
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Total Savings Card */}
        <Card style={[styles.card, styles.savingsCard]}>
          <Card.Content style={styles.savingsContent}>
            <View style={styles.savingsIconContainer}>
              <MaterialIcons name="lightbulb" size={40} color={OneAlbaniaColors.primary} />
            </View>
            <View style={styles.savingsTextContainer}>
              <ThemedText type="subtitle">Potential Monthly Savings</ThemedText>
              <ThemedText style={styles.savingsAmount}>€{totalSavings}</ThemedText>
              <Paragraph style={styles.savingsDescription}>
                Our AI has analyzed your usage patterns and identified several opportunities to optimize your services and reduce costs.
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
        
        <ThemedText type="title" style={styles.sectionTitle}>Personalized Recommendations</ThemedText>
        
        {/* Recommendations List */}
        {aiRecommendations.map((recommendation) => (
          <Card key={recommendation.id} style={styles.card}>
            <Card.Content>
              <View style={styles.recommendationHeader}>
                <MaterialIcons 
                  name="lightbulb" 
                  size={24} 
                  color={recommendation.priority === 'high' ? OneAlbaniaColors.error : OneAlbaniaColors.primary} 
                />
                <ThemedText type="subtitle" style={styles.recommendationTitle}>
                  {recommendation.title}
                </ThemedText>
              </View>
              
              <Paragraph style={styles.recommendationDescription}>
                {recommendation.description}
              </Paragraph>
              
              <View style={styles.tagsContainer}>
                <Chip 
                  mode="outlined" 
                  style={styles.savingsChip}
                  textStyle={{ color: OneAlbaniaColors.success }}
                  icon="currency-eur"
                >
                  Save €{recommendation.savingsAmount}/month
                </Chip>
                
                <Chip 
                  mode="outlined" 
                  style={[
                    styles.priorityChip,
                    { borderColor: recommendation.priority === 'high' ? OneAlbaniaColors.error : OneAlbaniaColors.primary }
                  ]}
                  textStyle={{ 
                    color: recommendation.priority === 'high' ? OneAlbaniaColors.error : OneAlbaniaColors.primary 
                  }}
                >
                  {recommendation.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                </Chip>
              </View>
              
              <View style={styles.actionButtons}>
                <Button 
                  mode="outlined" 
                  style={styles.detailsButton}
                  textColor={OneAlbaniaColors.primary}
                >
                  Details
                </Button>
                <Button 
                  mode="contained" 
                  style={styles.applyButton}
                  buttonColor={OneAlbaniaColors.primary}
                >
                  Apply
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
        
        {/* How It Works Section */}
        <ThemedText type="title" style={styles.sectionTitle}>How It Works</ThemedText>
        
        <Card style={styles.card}>
          <Card.Content>
            <List.Item
              title="Usage Analysis"
              description="We analyze your historical usage patterns across all lines and services."
              left={props => <List.Icon {...props} icon="chart-line" color={OneAlbaniaColors.primary} />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Pattern Recognition"
              description="Our AI identifies trends, anomalies, and optimization opportunities."
              left={props => <List.Icon {...props} icon="lightbulb" color={OneAlbaniaColors.primary} />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Cost Optimization"
              description="We compare your usage with available plans to find the most cost-effective options."
              left={props => <List.Icon {...props} icon="currency-eur" color={OneAlbaniaColors.primary} />}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Personalized Suggestions"
              description="You receive tailored recommendations based on your specific business needs."
              left={props => <List.Icon {...props} icon="check-circle" color={OneAlbaniaColors.primary} />}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  savingsCard: {
    backgroundColor: OneAlbaniaColors.primaryLight,
  },
  savingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  savingsTextContainer: {
    flex: 1,
  },
  savingsAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 4,
  },
  savingsDescription: {
    color: '#fff',
    opacity: 0.9,
  },
  sectionTitle: {
    marginBottom: 16,
    marginTop: 8,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationTitle: {
    marginLeft: 12,
    flex: 1,
  },
  recommendationDescription: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  savingsChip: {
    marginRight: 8,
    marginBottom: 8,
    borderColor: OneAlbaniaColors.success,
  },
  priorityChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  detailsButton: {
    marginRight: 8,
    borderColor: OneAlbaniaColors.primary,
  },
  applyButton: {
    // Default styles from React Native Paper
  },
  listItem: {
    paddingVertical: 8,
  },
});
