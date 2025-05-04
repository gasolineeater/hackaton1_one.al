import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
import ServiceManagement from './ServiceManagement';
import { ServiceProvider } from '../../contexts/ServiceContext';
import { NotificationProvider } from '../../contexts/NotificationContext';

describe('ServiceManagement', () => {
  test('renders service categories correctly', () => {
    render(
      <NotificationProvider>
        <ServiceProvider>
          <ServiceManagement />
        </ServiceProvider>
      </NotificationProvider>
    );

    // Check that the page title is rendered
    expect(screen.getByText(/service management/i)).toBeInTheDocument();
    
    // Check that service categories are rendered
    expect(screen.getByText(/connectivity services/i)).toBeInTheDocument();
    expect(screen.getByText(/messaging services/i)).toBeInTheDocument();
    
    // Check that at least one service is rendered
    const services = screen.getAllByRole('switch');
    expect(services.length).toBeGreaterThan(0);
  });

  test('toggles service state', async () => {
    render(
      <NotificationProvider>
        <ServiceProvider>
          <ServiceManagement />
        </ServiceProvider>
      </NotificationProvider>
    );

    // Find a service switch
    const switches = screen.getAllByRole('switch');
    const serviceSwitch = switches[0];
    
    // Get the initial state
    const initialChecked = serviceSwitch.checked;
    
    // Toggle the switch
    fireEvent.click(serviceSwitch);
    
    // Check that the switch state has changed
    expect(serviceSwitch.checked).toBe(!initialChecked);
    
    // Check that a success message is shown
    await waitFor(() => {
      expect(screen.getByText(/has been (enabled|disabled)/i)).toBeInTheDocument();
    });
  });

  test('shows confirmation dialog for services with warnings', async () => {
    render(
      <NotificationProvider>
        <ServiceProvider>
          <ServiceManagement />
        </ServiceProvider>
      </NotificationProvider>
    );

    // Find a service with a warning message
    // This is a bit tricky without knowing the exact structure, but we can try to find a service
    // that mentions "roaming" or "international" which typically have warnings
    const roamingService = screen.getByText(/international roaming/i, { exact: false });
    if (roamingService) {
      // Find the switch for this service
      const serviceCard = roamingService.closest('.MuiCard-root');
      const serviceSwitch = serviceCard.querySelector('input[type="checkbox"]');
      
      // If the service is disabled, toggle it to trigger the warning
      if (!serviceSwitch.checked) {
        fireEvent.click(serviceSwitch);
        
        // Check that the confirmation dialog is shown
        await waitFor(() => {
          expect(screen.getByText(/confirm service change/i)).toBeInTheDocument();
        });
        
        // Confirm the change
        fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
        
        // Check that the service is now enabled
        expect(serviceSwitch.checked).toBe(true);
        
        // Check that a success message is shown
        await waitFor(() => {
          expect(screen.getByText(/has been enabled/i)).toBeInTheDocument();
        });
      }
    }
  });

  test('shows service history', () => {
    render(
      <NotificationProvider>
        <ServiceProvider>
          <ServiceManagement />
        </ServiceProvider>
      </NotificationProvider>
    );

    // Find a history button
    const historyButtons = screen.getAllByLabelText(/history/i);
    if (historyButtons.length > 0) {
      // Click the first history button
      fireEvent.click(historyButtons[0]);
      
      // Check that the history dialog is shown
      expect(screen.getByText(/service history/i)).toBeInTheDocument();
      
      // Check that at least one history entry is shown
      expect(screen.getByRole('list')).toBeInTheDocument();
      
      // Close the dialog
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      
      // Check that the dialog is closed
      expect(screen.queryByText(/service history/i)).not.toBeInTheDocument();
    }
  });

  test('displays active/inactive status correctly', () => {
    render(
      <NotificationProvider>
        <ServiceProvider>
          <ServiceManagement />
        </ServiceProvider>
      </NotificationProvider>
    );

    // Find all service switches
    const switches = screen.getAllByRole('switch');
    
    // Check each switch
    switches.forEach(serviceSwitch => {
      // Get the service card
      const serviceCard = serviceSwitch.closest('.MuiCard-root');
      
      // Check if the service is enabled
      if (serviceSwitch.checked) {
        // Check that the service card shows "Enabled"
        expect(serviceCard).toHaveTextContent(/enabled/i);
        
        // Check that the service card has an "Active" chip
        expect(serviceCard).toHaveTextContent(/active/i);
      } else {
        // Check that the service card shows "Disabled"
        expect(serviceCard).toHaveTextContent(/disabled/i);
        
        // Check that the service card does not have an "Active" chip
        expect(serviceCard).not.toHaveTextContent(/active/i);
      }
    });
  });
});
