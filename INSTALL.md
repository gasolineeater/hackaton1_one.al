# ONE Albania SME Dashboard - Installation Guide

This guide provides instructions for installing, running, and testing the ONE Albania SME Dashboard project.

## 👥 Team Members

- **Elvi Zekaj** - Frontend Developer
- **Aldin Zendeli** - UI/UX Designer
- **Guido Andreini** - Backend Developer
- **Lorenzo Agnello** - Project Manager

## 📋 Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Git

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:gasolineeater/hackaton1_one.al.git
   cd hackaton1_one.al
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to http://localhost:5173

## 🧪 Testing

- Test your components in different screen sizes
- Verify that all interactions work as expected
- Check for console errors
- Ensure accessibility (keyboard navigation, screen reader support)

## 🆘 Troubleshooting

### Common Issues

1. **Dependencies not installing**
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Development server not starting**
   - Check for port conflicts
   - Verify that all dependencies are installed
   - Check for syntax errors in recent changes

3. **Component not rendering**
   - Check the console for errors
   - Verify that the component is properly imported
   - Check that props are correctly passed

4. **Styling issues**
   - Use the browser inspector to identify CSS conflicts
   - Check for missing theme properties
   - Verify responsive breakpoints

## 📱 Responsive Testing

Our dashboard should work well on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

Use your browser's developer tools to test different screen sizes and ensure the UI adapts correctly.

## 🔍 Code Quality Checks

Before submitting your code, make sure to:

1. **Check for console errors**
   - Open the browser's developer console (F12)
   - Verify there are no errors or warnings

2. **Verify functionality**
   - Test all interactive elements
   - Ensure data is displayed correctly
   - Check that navigation works as expected

3. **Review code style**
   - Follow the established patterns in the codebase
   - Keep components focused and reusable
   - Use meaningful variable and function names
