// Mock data for ONE Albania SME Dashboard

// Telecom lines data
export const telecomLines = [
  {
    id: "line1",
    phoneNumber: "+355 69 123 4567",
    assignedTo: "John Smith",
    plan: "Business Premium",
    monthlyLimit: 20,
    currentUsage: 12.5,
    status: "active"
  },
  {
    id: "line2",
    phoneNumber: "+355 69 234 5678",
    assignedTo: "Maria Johnson",
    plan: "Business Standard",
    monthlyLimit: 10,
    currentUsage: 9.8,
    status: "active"
  },
  {
    id: "line3",
    phoneNumber: "+355 69 345 6789",
    assignedTo: "Robert Brown",
    plan: "Business Economy",
    monthlyLimit: 5,
    currentUsage: 4.2,
    status: "active"
  },
  {
    id: "line4",
    phoneNumber: "+355 69 456 7890",
    assignedTo: "Sarah Wilson",
    plan: "Business Premium",
    monthlyLimit: 20,
    currentUsage: 5.7,
    status: "active"
  },
  {
    id: "line5",
    phoneNumber: "+355 69 567 8901",
    assignedTo: "David Miller",
    plan: "Business Standard",
    monthlyLimit: 10,
    currentUsage: 10.3,
    status: "suspended"
  }
];

// Usage history data
export const usageHistory = [
  {
    month: "Jan",
    data: 8.2,
    calls: 5.1,
    sms: 0.7
  },
  {
    month: "Feb",
    data: 7.8,
    calls: 4.8,
    sms: 0.6
  },
  {
    month: "Mar",
    data: 9.1,
    calls: 5.3,
    sms: 0.8
  },
  {
    month: "Apr",
    data: 8.7,
    calls: 5.0,
    sms: 0.7
  },
  {
    month: "May",
    data: 10.2,
    calls: 5.5,
    sms: 0.9
  },
  {
    month: "Jun",
    data: 11.5,
    calls: 6.2,
    sms: 1.1
  }
];

// Service plans data
export const servicePlans = [
  {
    id: "plan1",
    name: "Business Economy",
    data: 5,
    calls: "Unlimited",
    sms: 100,
    price: 15,
    features: ["Basic Support", "Standard Data Speed"]
  },
  {
    id: "plan2",
    name: "Business Standard",
    data: 10,
    calls: "Unlimited",
    sms: 200,
    price: 25,
    features: ["Priority Support", "High Data Speed", "International Calls (10 countries)"]
  },
  {
    id: "plan3",
    name: "Business Premium",
    data: 20,
    calls: "Unlimited",
    sms: "Unlimited",
    price: 40,
    features: ["24/7 Premium Support", "Maximum Data Speed", "International Calls (50 countries)", "Roaming Package"]
  },
  {
    id: "plan4",
    name: "Business Ultimate",
    data: "Unlimited",
    calls: "Unlimited",
    sms: "Unlimited",
    price: 60,
    features: ["Dedicated Account Manager", "Maximum Data Speed", "International Calls (Worldwide)", "Premium Roaming Package", "Device Insurance"]
  }
];

// AI Recommendations data
export const aiRecommendations = [
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
    title: "Unused Line Detected",
    description: "Line +355 69 567 8901 has minimal usage for 3 months. Consider suspending to save €25 per month.",
    savingsAmount: 25,
    priority: "high"
  }
];

// Cost breakdown data
export const costBreakdown = [
  { name: "Data", value: 45 },
  { name: "Calls", value: 30 },
  { name: "SMS", value: 5 },
  { name: "Roaming", value: 15 },
  { name: "Services", value: 5 }
];

// Service status data
export const serviceStatus = [
  {
    id: "service1",
    name: "International Calls",
    status: "enabled",
    lastModified: "2023-05-15"
  },
  {
    id: "service2",
    name: "Roaming",
    status: "disabled",
    lastModified: "2023-06-02"
  },
  {
    id: "service3",
    name: "Premium Support",
    status: "enabled",
    lastModified: "2023-04-10"
  },
  {
    id: "service4",
    name: "Data Sharing",
    status: "enabled",
    lastModified: "2023-05-22"
  },
  {
    id: "service5",
    name: "Content Filtering",
    status: "disabled",
    lastModified: "2023-03-18"
  }
];

// Usage alerts data
export const usageAlerts = [
  {
    id: "alert1",
    lineId: "line2",
    type: "data",
    message: "90% of data limit reached",
    timestamp: "2023-06-10T14:23:00",
    severity: "warning"
  },
  {
    id: "alert2",
    lineId: "line5",
    type: "billing",
    message: "Payment overdue by 3 days",
    timestamp: "2023-06-08T09:15:00",
    severity: "critical"
  },
  {
    id: "alert3",
    lineId: "line3",
    type: "data",
    message: "80% of data limit reached",
    timestamp: "2023-06-09T18:45:00",
    severity: "info"
  },
  {
    id: "alert4",
    lineId: "line1",
    type: "roaming",
    message: "Roaming activated in Italy",
    timestamp: "2023-06-07T11:30:00",
    severity: "info"
  }
];
