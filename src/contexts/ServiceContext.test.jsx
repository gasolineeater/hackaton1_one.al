import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServiceProvider, useServices } from './ServiceContext';

// Test component that uses the service context
const TestComponent = () => {
  const { 
    services, 
    telecomLines, 
    toggleService, 
    addTelecomLine, 
    updateTelecomLine, 
    changeLineStatus, 
    deleteTelecomLine 
  } = useServices();

  return (
    <div>
      <div data-testid="service-count">{services.length}</div>
      <div data-testid="line-count">{telecomLines.length}</div>
      
      <h2>Services</h2>
      <ul>
        {services.map(service => (
          <li key={service.id} data-testid={`service-${service.id}`}>
            {service.name} - {service.enabled ? 'Enabled' : 'Disabled'}
            <button 
              data-testid={`toggle-service-${service.id}`} 
              onClick={() => toggleService(service.id)}
            >
              Toggle
            </button>
          </li>
        ))}
      </ul>
      
      <h2>Telecom Lines</h2>
      <ul>
        {telecomLines.map(line => (
          <li key={line.id} data-testid={`line-${line.id}`}>
            {line.number} - {line.status}
            <button 
              data-testid={`suspend-line-${line.id}`} 
              onClick={() => changeLineStatus(line.id, 'suspended')}
            >
              Suspend
            </button>
            <button 
              data-testid={`activate-line-${line.id}`} 
              onClick={() => changeLineStatus(line.id, 'active')}
            >
              Activate
            </button>
            <button 
              data-testid={`delete-line-${line.id}`} 
              onClick={() => deleteTelecomLine(line.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      <button 
        data-testid="add-line" 
        onClick={() => addTelecomLine({
          number: '+355 69 999 8888',
          user: 'Test User',
          department: 'Test Department',
          plan: 'Business Basic',
          dataLimit: 5,
          callLimit: 200,
          smsLimit: 50
        })}
      >
        Add Line
      </button>
    </div>
  );
};

describe('ServiceContext', () => {
  test('provides initial services and telecom lines', () => {
    render(
      <ServiceProvider>
        <TestComponent />
      </ServiceProvider>
    );

    // Check that initial services are provided
    expect(screen.getByTestId('service-count')).not.toHaveTextContent('0');
    
    // Check that initial telecom lines are provided
    expect(screen.getByTestId('line-count')).not.toHaveTextContent('0');
  });

  test('toggleService function toggles service enabled status', () => {
    render(
      <ServiceProvider>
        <TestComponent />
      </ServiceProvider>
    );

    // Get the first service
    const services = screen.getAllByTestId(/^service-\d+$/);
    if (services.length > 0) {
      // Get the service ID
      const serviceId = services[0].dataset.testid.split('-')[1];
      
      // Get the initial enabled status
      const initialStatus = services[0].textContent.includes('Enabled');
      
      // Click the toggle button
      fireEvent.click(screen.getByTestId(`toggle-service-${serviceId}`));
      
      // Check that the status has toggled
      const newStatus = screen.getByTestId(`service-${serviceId}`).textContent.includes('Enabled');
      expect(newStatus).toBe(!initialStatus);
    }
  });

  test('addTelecomLine function adds a new telecom line', () => {
    render(
      <ServiceProvider>
        <TestComponent />
      </ServiceProvider>
    );

    // Get the initial line count
    const initialCount = parseInt(screen.getByTestId('line-count').textContent);
    
    // Click the add line button
    fireEvent.click(screen.getByTestId('add-line'));
    
    // Check that the line count has increased
    expect(screen.getByTestId('line-count')).toHaveTextContent(String(initialCount + 1));
    
    // Check that the new line is in the DOM
    expect(screen.getByText(/\+355 69 999 8888/)).toBeInTheDocument();
  });

  test('changeLineStatus function changes line status', () => {
    render(
      <ServiceProvider>
        <TestComponent />
      </ServiceProvider>
    );

    // Get the first active line
    const activeLines = screen.getAllByText(/active/);
    if (activeLines.length > 0) {
      // Get the line ID
      const lineElement = activeLines[0].closest('li');
      const lineId = lineElement.dataset.testid.split('-')[1];
      
      // Click the suspend button
      fireEvent.click(screen.getByTestId(`suspend-line-${lineId}`));
      
      // Check that the status has changed to suspended
      expect(lineElement).toHaveTextContent('suspended');
      
      // Click the activate button
      fireEvent.click(screen.getByTestId(`activate-line-${lineId}`));
      
      // Check that the status has changed back to active
      expect(lineElement).toHaveTextContent('active');
    }
  });

  test('deleteTelecomLine function removes a telecom line', () => {
    render(
      <ServiceProvider>
        <TestComponent />
      </ServiceProvider>
    );

    // Get the initial line count
    const initialCount = parseInt(screen.getByTestId('line-count').textContent);
    
    // Get the first line
    const lines = screen.getAllByTestId(/^line-\d+$/);
    if (lines.length > 0) {
      // Get the line ID
      const lineId = lines[0].dataset.testid.split('-')[1];
      
      // Click the delete button
      fireEvent.click(screen.getByTestId(`delete-line-${lineId}`));
      
      // Check that the line count has decreased
      expect(screen.getByTestId('line-count')).toHaveTextContent(String(initialCount - 1));
      
      // Check that the line is no longer in the DOM
      expect(screen.queryByTestId(`line-${lineId}`)).not.toBeInTheDocument();
    }
  });
});
