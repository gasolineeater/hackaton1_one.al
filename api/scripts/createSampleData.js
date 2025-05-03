import { Customer, Service, Subscription, User } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

async function createSampleData() {
  try {
    console.log('Creating sample data...');
    
    // Create sample services
    const services = await Service.bulkCreate([
      {
        name: 'Business Mobile',
        description: 'Mobile service package for businesses',
        type: 'mobile',
        price: 15.99,
        features: JSON.stringify(['Unlimited calls', '10GB data', 'International roaming']),
        setupFee: 10.00
      },
      {
        name: 'Business Internet',
        description: 'High-speed internet for businesses',
        type: 'internet',
        price: 49.99,
        features: JSON.stringify(['100Mbps speed', 'Static IP', '24/7 support']),
        setupFee: 25.00
      },
      {
        name: 'Cloud Storage',
        description: 'Secure cloud storage solution',
        type: 'cloud',
        price: 29.99,
        features: JSON.stringify(['1TB storage', 'Automatic backup', 'File sharing']),
        setupFee: 0.00
      },
      {
        name: 'Fixed Line',
        description: 'Business phone line',
        type: 'fixed',
        price: 19.99,
        features: JSON.stringify(['Unlimited local calls', 'Voicemail', 'Call forwarding']),
        setupFee: 15.00
      },
      {
        name: 'IoT Connectivity',
        description: 'Connectivity for IoT devices',
        type: 'iot',
        price: 9.99,
        features: JSON.stringify(['Device management', 'Data analytics', 'Security monitoring']),
        setupFee: 5.00
      }
    ]);
    
    console.log(`Created ${services.length} sample services`);
    
    // Create sample customers
    const customers = await Customer.bulkCreate([
      {
        companyName: 'ABC Corporation',
        contactPerson: 'John Smith',
        email: 'john@abccorp.com',
        phone: '+355 69 123 4567',
        address: 'Rruga Myslym Shyri, Tirana',
        businessType: 'retail',
        employeeCount: 50,
        status: 'active'
      },
      {
        companyName: 'XYZ Technologies',
        contactPerson: 'Maria Johnson',
        email: 'maria@xyztech.com',
        phone: '+355 69 765 4321',
        address: 'Bulevardi Dëshmorët e Kombit, Tirana',
        businessType: 'technology',
        employeeCount: 120,
        status: 'active'
      },
      {
        companyName: 'Green Farms',
        contactPerson: 'Arben Hoxha',
        email: 'arben@greenfarms.al',
        phone: '+355 69 222 3333',
        address: 'Rruga Sami Frashëri, Tirana',
        businessType: 'agriculture',
        employeeCount: 35,
        status: 'active'
      }
    ]);
    
    console.log(`Created ${customers.length} sample customers`);
    
    // Create sample subscriptions
    const subscriptions = [];
    
    // ABC Corporation subscriptions
    subscriptions.push(await Subscription.create({
      customerId: customers[0].id,
      serviceId: services[0].id, // Business Mobile
      startDate: new Date('2023-01-15'),
      status: 'active',
      quantity: 25,
      monthlyCost: services[0].price * 25,
      setupFee: services[0].setupFee,
      billingCycle: 'monthly',
      autoRenew: true
    }));
    
    subscriptions.push(await Subscription.create({
      customerId: customers[0].id,
      serviceId: services[1].id, // Business Internet
      startDate: new Date('2023-01-15'),
      status: 'active',
      quantity: 1,
      monthlyCost: services[1].price,
      setupFee: services[1].setupFee,
      billingCycle: 'monthly',
      autoRenew: true
    }));
    
    // XYZ Technologies subscriptions
    subscriptions.push(await Subscription.create({
      customerId: customers[1].id,
      serviceId: services[0].id, // Business Mobile
      startDate: new Date('2023-02-01'),
      status: 'active',
      quantity: 80,
      monthlyCost: services[0].price * 80,
      setupFee: services[0].setupFee,
      billingCycle: 'monthly',
      autoRenew: true
    }));
    
    subscriptions.push(await Subscription.create({
      customerId: customers[1].id,
      serviceId: services[1].id, // Business Internet
      startDate: new Date('2023-02-01'),
      status: 'active',
      quantity: 2,
      monthlyCost: services[1].price * 2,
      setupFee: services[1].setupFee,
      billingCycle: 'monthly',
      autoRenew: true
    }));
    
    subscriptions.push(await Subscription.create({
      customerId: customers[1].id,
      serviceId: services[2].id, // Cloud Storage
      startDate: new Date('2023-03-15'),
      status: 'active',
      quantity: 1,
      monthlyCost: services[2].price,
      setupFee: services[2].setupFee,
      billingCycle: 'monthly',
      autoRenew: true
    }));
    
    // Green Farms subscriptions
    subscriptions.push(await Subscription.create({
      customerId: customers[2].id,
      serviceId: services[0].id, // Business Mobile
      startDate: new Date('2023-04-01'),
      status: 'active',
      quantity: 15,
      monthlyCost: services[0].price * 15,
      setupFee: services[0].setupFee,
      billingCycle: 'monthly',
      autoRenew: true
    }));
    
    subscriptions.push(await Subscription.create({
      customerId: customers[2].id,
      serviceId: services[4].id, // IoT Connectivity
      startDate: new Date('2023-04-15'),
      status: 'active',
      quantity: 50,
      monthlyCost: services[4].price * 50,
      setupFee: services[4].setupFee,
      billingCycle: 'monthly',
      autoRenew: true
    }));
    
    console.log(`Created ${subscriptions.length} sample subscriptions`);
    
    // Create sample users (one for each customer)
    const users = [];
    
    // Admin user (already created by createAdmin.js)
    
    // ABC Corporation user
    users.push(await User.create({
      username: 'johnsmith',
      email: 'john@abccorp.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Smith',
      role: 'manager',
      customerId: customers[0].id,
      position: 'IT Manager',
      department: 'IT'
    }));
    
    // XYZ Technologies user
    users.push(await User.create({
      username: 'mariaj',
      email: 'maria@xyztech.com',
      password: 'Password123!',
      firstName: 'Maria',
      lastName: 'Johnson',
      role: 'manager',
      customerId: customers[1].id,
      position: 'CTO',
      department: 'Technology'
    }));
    
    // Green Farms user
    users.push(await User.create({
      username: 'arben',
      email: 'arben@greenfarms.al',
      password: 'Password123!',
      firstName: 'Arben',
      lastName: 'Hoxha',
      role: 'user',
      customerId: customers[2].id,
      position: 'Operations Manager',
      department: 'Operations'
    }));
    
    console.log(`Created ${users.length} sample users`);
    
    console.log('Sample data creation complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
}

// Run the function
createSampleData();
