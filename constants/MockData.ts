import { OneAlbaniaColors } from './OneAlbaniaColors';

// Mock data for telecom lines
export const telecomLines = [
  { id: 1, number: '+355 69 123 4567', plan: 'Business Premium', status: 'active', dataUsage: '12.5 GB', callMinutes: '320 min', smsCount: '45' },
  { id: 2, number: '+355 69 234 5678', plan: 'Business Standard', status: 'active', dataUsage: '8.2 GB', callMinutes: '210 min', smsCount: '28' },
  { id: 3, number: '+355 69 345 6789', plan: 'Business Basic', status: 'active', dataUsage: '5.7 GB', callMinutes: '150 min', smsCount: '15' },
  { id: 4, number: '+355 69 456 7890', plan: 'Business Premium', status: 'active', dataUsage: '15.3 GB', callMinutes: '280 min', smsCount: '32' },
];

// Mock data for usage history
export const usageHistory = [
  { month: 'Jan', data: 35, calls: 12, sms: 8 },
  { month: 'Feb', data: 28, calls: 10, sms: 6 },
  { month: 'Mar', data: 42, calls: 15, sms: 9 },
  { month: 'Apr', data: 38, calls: 14, sms: 7 },
  { month: 'May', data: 45, calls: 16, sms: 10 },
  { month: 'Jun', data: 50, calls: 18, sms: 12 },
];

// Mock data for cost breakdown
export const costBreakdown = [
  { name: 'Data', value: 45, color: OneAlbaniaColors.primary },
  { name: 'Calls', value: 30, color: OneAlbaniaColors.secondary },
  { name: 'SMS', value: 10, color: OneAlbaniaColors.info },
  { name: 'Roaming', value: 15, color: OneAlbaniaColors.warning },
];

// Mock data for monthly bills
export const monthlyBills = [
  { month: 'January', amount: 175, status: 'paid' },
  { month: 'February', amount: 182, status: 'paid' },
  { month: 'March', amount: 168, status: 'paid' },
  { month: 'April', amount: 175, status: 'unpaid' },
];

// Mock data for usage alerts
export const usageAlerts = [
  { id: 1, type: 'data', message: 'Line +355 69 123 4567 has reached 80% of data limit', severity: 'warning' },
  { id: 2, type: 'calls', message: 'Line +355 69 234 5678 has exceeded call minutes limit', severity: 'error' },
];

// Mock data for quick stats
export const quickStats = [
  { title: 'Active Lines', value: '4', icon: 'phone-in-talk', color: OneAlbaniaColors.primary },
  { title: 'Data Usage', value: '42.5 GB', icon: 'data-usage', color: OneAlbaniaColors.secondary },
  { title: 'Monthly Cost', value: '€175', icon: 'euro-symbol', color: OneAlbaniaColors.success },
  { title: 'Active Alerts', value: '2', icon: 'warning', color: OneAlbaniaColors.warning },
];

// Mock data for promotional banners
export const promotionalBanners = [
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

// Mock user data
export const userData = {
  name: 'John Smith',
  company: 'Smith Enterprises Ltd.',
  email: 'john.smith@smithenterprises.com',
  phone: '+355 69 123 4567',
  address: 'Rruga Myslym Shyri, Tirana, Albania',
  accountNumber: 'ONE-12345-B',
  plan: 'Business Premium',
};
