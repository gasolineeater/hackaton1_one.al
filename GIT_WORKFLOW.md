# Git Workflow for ONE Albania SME Dashboard Hackathon

This document outlines the recommended Git workflow for our hackathon project. Following these guidelines will help us maintain a clean, organized repository and make collaboration easier.

## Remote Repository

Our code is hosted on [GitHub/GitLab/Bitbucket] at the following URL:
```
https://[platform].com/[username]/one-albania-sme-dashboard
```

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://[platform].com/[username]/one-albania-sme-dashboard.git
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

## Commit Message Guidelines

Each commit should represent a single logical change and have a clear, descriptive message. Use the following format:

```
<type>: <short summary>
```

Types:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

## Example Commit History

Here's an example of a good commit history for our project:

1. `Initial project setup with Vite and React`
2. `feat: Add project documentation and README`
3. `feat: Create mock data for telecom services`
4. `feat: Implement dashboard layout components`
5. `feat: Add sidebar navigation with routing`
6. `feat: Create header with notifications`
7. `feat: Implement dashboard home with charts`
8. `feat: Add service overview component`
9. `feat: Create cost control placeholder`
10. `feat: Add service management placeholder`
11. `feat: Implement analytics placeholder`
12. `feat: Create AI recommendations component`
13. `feat: Add architecture diagram`
14. `docs: Add hackathon guide for team members`
15. `fix: Resolve routing issues`
16. `style: Improve responsive layout`
17. `refactor: Optimize chart rendering`

## Branching Strategy

1. **Main Branch**: `main` or `master`
   - Always contains stable, deployable code
   - Never commit directly to this branch during the hackathon

2. **Feature Branches**: `feature/feature-name`
   - Create a new branch for each feature
   - Example: `feature/service-overview`

3. **Fix Branches**: `fix/issue-description`
   - For bug fixes
   - Example: `fix/chart-rendering`

## Workflow Steps

1. **Start a new feature**
   ```bash
   git checkout master
   git pull
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit frequently**
   ```bash
   # Make some changes
   git add <changed-files>
   git commit -m "feat: Implement specific functionality"
   ```

3. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**
   - Create a PR on GitHub/GitLab
   - Request review from teammates
   - Describe what the PR does

5. **Review and merge**
   - After approval, merge the PR
   - Delete the feature branch after merging

## Tips for Hackathon Success

1. **Commit Early and Often**
   - Make small, focused commits
   - Don't wait until you have a large set of changes

2. **Write Clear Commit Messages**
   - Be specific about what changed
   - Make it easy for teammates to understand your work

3. **Pull Regularly**
   - Keep your local repository updated
   - Resolve conflicts early

4. **Communicate About Merge Conflicts**
   - Alert the team if you're working on files others are changing
   - Coordinate complex merges

5. **Use Pull Requests for Code Review**
   - Even in a hackathon, quick code reviews can catch issues
   - Use PRs as a communication tool

## Example Git Commands for Common Tasks

### Check Status
```bash
git status
```

### Create a New Branch
```bash
git checkout -b feature/new-feature
```

### Stage Changes
```bash
git add file1.js file2.js
# Or stage all changes
git add .
```

### Commit Changes
```bash
git commit -m "feat: Add user authentication"
```

### Push to Remote
```bash
git push origin feature/new-feature
```

### Pull Latest Changes
```bash
git pull origin master
```

### Merge from Master
```bash
git checkout feature/your-feature
git merge master
```

### View Commit History
```bash
git log
# Or for a more compact view
git log --oneline
```

Remember, good Git practices will help us work efficiently as a team and avoid wasting time on version control issues during the hackathon!
