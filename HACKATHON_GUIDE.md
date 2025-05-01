# ONE Albania SME Dashboard - Hackathon Guide

This guide provides quick instructions for team members during the hackathon.

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd one-albania-sme-dashboard
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

## 📋 Project Structure

- `src/components/Dashboard/` - Main dashboard layout and home page
- `src/components/ServiceOverview/` - Service and line management
- `src/components/CostControl/` - Budget and cost management (placeholder)
- `src/components/ServiceManagement/` - Service configuration (placeholder)
- `src/components/Analytics/` - Usage analytics (placeholder)
- `src/components/AIRecommendations/` - AI-powered suggestions
- `src/data/` - Mock data for development
- `src/hooks/` - Custom React hooks
- `src/services/` - API service layer (to be implemented)
- `src/utils/` - Utility functions

## 🛠️ Development Workflow

### Task Assignment

1. **Dashboard Enhancements**
   - Improve visualizations
   - Add filtering capabilities
   - Implement responsive fixes

2. **Service Overview**
   - Complete CRUD operations for lines
   - Add sorting and filtering
   - Implement plan comparison

3. **Cost Control**
   - Implement budget setting interface
   - Create cost analytics visualizations
   - Add threshold alerts

4. **Service Management**
   - Build service activation/deactivation UI
   - Create configuration panels
   - Implement batch operations

5. **Analytics**
   - Develop detailed reports
   - Create custom chart components
   - Add export functionality

6. **AI Recommendations**
   - Enhance recommendation algorithm
   - Improve UI for suggestions
   - Add implementation tracking

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Keep components modular
   - Add comments for complex logic

3. **Commit regularly**
   ```bash
   git add .
   git commit -m "Descriptive message about changes"
   ```

4. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a pull request**
   - Describe your changes
   - Reference any related issues
   - Request review from teammates

## 🧪 Testing

- Test your components in different screen sizes
- Verify that all interactions work as expected
- Check for console errors
- Ensure accessibility (keyboard navigation, screen reader support)

## 📱 Responsive Design

Our dashboard should work well on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

Use Material UI's responsive utilities:
```jsx
<Grid item xs={12} md={6} lg={4}>
  {/* Content that adapts to screen size */}
</Grid>
```

## 🎨 Design Guidelines

- Follow the ONE Albania brand colors (primary red: #e41e26)
- Use Material UI components for consistency
- Keep the interface clean and uncluttered
- Focus on data visualization and actionable insights
- Ensure good contrast for readability

## 🏆 Judging Criteria Focus

Remember that our project will be judged on:
1. **Innovative ideas and business value**
2. **System design and architecture**
3. **Implementation of core functionalities**
4. **User-friendly UI/UX**
5. **Teamwork**

Focus your efforts on these areas to maximize our chances of success!

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

## 📞 Communication

- Use our team chat for quick questions
- Document important decisions
- Share progress updates regularly
- Ask for help when stuck - don't waste time on blockers!

Good luck, and let's build something amazing! 🚀
