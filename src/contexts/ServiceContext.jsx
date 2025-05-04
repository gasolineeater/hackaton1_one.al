import React, { createContext, useState, useContext } from 'react';
import { 
  Language as RoamingIcon,
  Call as CallsIcon,
  Sms as SmsIcon,
  DataUsage as DataIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Block as BlockIcon,
  Wifi as WifiIcon
} from '@mui/icons-material';

// Create the context
const ServiceContext = createContext();

// Mock services data
const mockServices = [
  {
    id: 1,
    name: 'International Roaming',
    description: 'Use your phone services while traveling abroad',
    icon: RoamingIcon,
    enabled: true,
    category: 'connectivity',
    lastChanged: '2023-06-15',
    restrictions: null,
    warningMessage: 'Enabling roaming may incur additional charges based on your destination'
  },
  {
    id: 2,
    name: 'International Calls',
    description: 'Make calls to international numbers',
    icon: CallsIcon,
    enabled: false,
    category: 'connectivity',
    lastChanged: '2023-05-22',
    restrictions: ['Europe', 'North America'],
    warningMessage: 'International call rates vary by country'
  },
  {
    id: 3,
    name: 'Premium SMS',
    description: 'Send and receive premium SMS services',
    icon: SmsIcon,
    enabled: true,
    category: 'messaging',
    lastChanged: '2023-04-10',
    restrictions: null,
    warningMessage: null
  },
  {
    id: 4,
    name: 'Data Sharing',
    description: 'Share your data plan with other devices',
    icon: DataIcon,
    enabled: true,
    category: 'data',
    lastChanged: '2023-06-01',
    restrictions: null,
    warningMessage: null
  },
  {
    id: 5,
    name: 'Call Forwarding',
    description: 'Forward calls to another number',
    icon: CallsIcon,
    enabled: false,
    category: 'voice',
    lastChanged: '2023-03-15',
    restrictions: null,
    warningMessage: null
  },
  {
    id: 6,
    name: 'Caller ID',
    description: 'Show or hide your number when calling',
    icon: SecurityIcon,
    enabled: true,
    category: 'privacy',
    lastChanged: '2023-05-05',
    restrictions: null,
    warningMessage: null
  },
  {
    id: 7,
    name: 'Usage Alerts',
    description: 'Receive alerts when approaching usage limits',
    icon: NotificationsIcon,
    enabled: true,
    category: 'notifications',
    lastChanged: '2023-06-10',
    restrictions: null,
    warningMessage: null
  },
  {
    id: 8,
    name: 'Content Filtering',
    description: 'Block access to certain content categories',
    icon: BlockIcon,
    enabled: false,
    category: 'security',
    lastChanged: '2023-04-20',
    restrictions: null,
    warningMessage: null
  },
  {
    id: 9,
    name: 'WiFi Calling',
    description: 'Make calls over WiFi networks',
    icon: WifiIcon,
    enabled: true,
    category: 'connectivity',
    lastChanged: '2023-05-30',
    restrictions: null,
    warningMessage: null
  }
];

// Mock telecom lines data
const mockTelecomLines = [
  {
    id: 1,
    number: '+355 69 123 4567',
    user: 'John Smith',
    department: 'Sales',
    plan: 'Business Premium',
    status: 'active',
    dataUsage: 12.5,
    dataLimit: 15,
    callMinutes: 320,
    callLimit: 500,
    smsCount: 45,
    smsLimit: 100,
    lastActivity: '2023-06-20'
  },
  {
    id: 2,
    number: '+355 69 234 5678',
    user: 'Maria Johnson',
    department: 'Marketing',
    plan: 'Business Standard',
    status: 'active',
    dataUsage: 8.2,
    dataLimit: 10,
    callMinutes: 210,
    callLimit: 300,
    smsCount: 28,
    smsLimit: 50,
    lastActivity: '2023-06-19'
  },
  {
    id: 3,
    number: '+355 69 345 6789',
    user: 'Robert Brown',
    department: 'IT',
    plan: 'Business Premium',
    status: 'active',
    dataUsage: 5.7,
    dataLimit: 15,
    callMinutes: 150,
    callLimit: 500,
    smsCount: 15,
    smsLimit: 100,
    lastActivity: '2023-06-18'
  },
  {
    id: 4,
    number: '+355 69 456 7890',
    user: 'Sarah Wilson',
    department: 'Finance',
    plan: 'Business Basic',
    status: 'suspended',
    dataUsage: 0,
    dataLimit: 5,
    callMinutes: 0,
    callLimit: 200,
    smsCount: 0,
    smsLimit: 50,
    lastActivity: '2023-06-01'
  },
  {
    id: 5,
    number: '+355 69 567 8901',
    user: 'David Miller',
    department: 'Operations',
    plan: 'Business Standard',
    status: 'active',
    dataUsage: 7.3,
    dataLimit: 10,
    callMinutes: 280,
    callLimit: 300,
    smsCount: 32,
    smsLimit: 50,
    lastActivity: '2023-06-20'
  }
];

// Provider component
export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState(mockServices);
  const [telecomLines, setTelecomLines] = useState(mockTelecomLines);

  // Toggle service enabled status
  const toggleService = (id) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service.id === id
          ? { ...service, enabled: !service.enabled, lastChanged: new Date().toISOString().split('T')[0] }
          : service
      )
    );
    return services.find(service => service.id === id);
  };

  // Add a new telecom line
  const addTelecomLine = (newLine) => {
    const lineWithId = {
      id: Date.now(),
      status: 'active',
      dataUsage: 0,
      callMinutes: 0,
      smsCount: 0,
      lastActivity: new Date().toISOString().split('T')[0],
      ...newLine
    };
    
    setTelecomLines(prevLines => [...prevLines, lineWithId]);
    return lineWithId;
  };

  // Update a telecom line
  const updateTelecomLine = (id, updatedData) => {
    setTelecomLines(prevLines =>
      prevLines.map(line =>
        line.id === id ? { ...line, ...updatedData } : line
      )
    );
    return telecomLines.find(line => line.id === id);
  };

  // Change line status (activate, suspend, etc.)
  const changeLineStatus = (id, newStatus) => {
    return updateTelecomLine(id, { status: newStatus });
  };

  // Delete a telecom line
  const deleteTelecomLine = (id) => {
    setTelecomLines(prevLines =>
      prevLines.filter(line => line.id !== id)
    );
  };

  // Context value
  const value = {
    services,
    telecomLines,
    toggleService,
    addTelecomLine,
    updateTelecomLine,
    changeLineStatus,
    deleteTelecomLine
  };

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>;
};

// Custom hook to use the service context
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
