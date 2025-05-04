# Testing Guide for ONE Albania SME Dashboard

This document provides instructions for running tests and understanding the testing structure of the ONE Albania SME Dashboard application.

## Testing Setup

The application uses the following testing tools:

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **jest-dom**: Custom DOM element matchers for Jest

## Running Tests

To run the tests, you can use the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

The tests are organized as follows:

### Context Tests

- `src/contexts/AuthContext.test.jsx`: Tests for authentication context
- `src/contexts/NotificationContext.test.jsx`: Tests for notification context
- `src/contexts/ServiceContext.test.jsx`: Tests for service management context

### Component Tests

- `src/components/Login/LoginPage.test.jsx`: Tests for login functionality
- `src/components/Notifications/NotificationsPage.test.jsx`: Tests for notifications page
- `src/components/ServiceManagement/ServiceManagement.test.jsx`: Tests for service management page
- `src/components/Dashboard/Header.test.jsx`: Tests for header component
- `src/components/Logout/LogoutPage.test.jsx`: Tests for logout functionality

### Test Utilities

- `src/utils/test-utils.jsx`: Custom render function with providers for testing

## Test Coverage

The test coverage threshold is set to 70% for:

- Branches
- Functions
- Lines
- Statements

You can view the coverage report by running:

```bash
npm run test:coverage
```

This will generate a coverage report in the `coverage` directory.

## Writing New Tests

When writing new tests:

1. Use the custom render function from `src/utils/test-utils.jsx` to ensure components are wrapped with the necessary providers
2. Follow the existing test patterns for consistency
3. Use descriptive test names that explain what is being tested
4. Test both success and failure scenarios
5. Mock external dependencies as needed

## Mocking

The following browser APIs are mocked for testing:

- `localStorage`
- `matchMedia`
- `IntersectionObserver`
- `ResizeObserver`

If you need to mock additional APIs, add them to the `jest.setup.js` file.

## Troubleshooting

If you encounter issues with tests:

1. Check that all dependencies are installed
2. Ensure that the component being tested is properly exported
3. Verify that the test is using the correct imports
4. Check for any console errors during test execution
5. Try running a specific test file to isolate the issue

## Continuous Integration

Tests are automatically run as part of the CI/CD pipeline. Any pull request with failing tests will not be merged until the tests pass.
