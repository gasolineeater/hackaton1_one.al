# ONE Albania SME Dashboard - Windows Installation Guide

This guide provides step-by-step instructions for setting up the ONE Albania SME Dashboard project on Windows using PowerShell.

## 👥 Team Members

- **Elvi Zekaj** - Frontend Developer
- **Aldin Zendeli** - UI/UX Designer
- **Guido Andreini** - Backend Developer
- **Lorenzo Agnello** - Project Manager

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your Windows machine:

1. **Node.js and npm**
   - Download and install from [nodejs.org](https://nodejs.org/)
   - Verify installation by running:
     ```powershell
     node --version
     npm --version
     ```

2. **Git**
   - Download and install from [git-scm.com](https://git-scm.com/download/win)
   - Verify installation by running:
     ```powershell
     git --version
     ```

3. **Visual Studio Code** (recommended)
   - Download and install from [code.visualstudio.com](https://code.visualstudio.com/)

## 🚀 Installation Steps

### 1. Clone the Repository

Open PowerShell and run the following commands:

```powershell
# Navigate to your desired directory
cd C:\Projects  # Change this to your preferred location

# Clone the repository
git clone https://github.com/gasolineeater/hackaton1_one.al.git

# Navigate into the project directory
cd hackaton1_one.al
```

### 2. Install Dependencies

```powershell
# Install project dependencies
npm install
```

### 3. Start the Development Server

```powershell
# Start the development server
npm run dev
```

The terminal will display a URL (typically http://localhost:5173). Open this URL in your browser to view the application.

## 🔧 Troubleshooting Common Issues

### Issue: 'npm' is not recognized as a command

**Solution:**
1. Ensure Node.js is installed correctly
2. Add Node.js to your PATH:
   ```powershell
   $env:Path += ";C:\Program Files\nodejs"  # Adjust path if needed
   ```
3. Restart PowerShell and try again

### Issue: Git clone fails with SSL certificate error

**Solution:**
```powershell
# Temporarily disable SSL verification
git config --global http.sslVerify false

# Clone the repository
git clone https://github.com/gasolineeater/hackaton1_one.al.git

# Re-enable SSL verification (important for security)
git config --global http.sslVerify true
```

### Issue: Port 5173 already in use

**Solution:**
1. Find the process using the port:
   ```powershell
   netstat -ano | findstr :5173
   ```
2. Terminate the process:
   ```powershell
   taskkill /PID <PID> /F
   ```
3. Try starting the server again

### Issue: Node modules installation fails

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules folder and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall dependencies
npm install
```

## 🧪 Testing the Application

### Manual Testing

1. Open the application in your browser
2. Navigate through different sections using the sidebar
3. Test responsive design by resizing your browser window
4. Verify that all charts and data visualizations load correctly

### Browser Developer Tools

1. Press F12 to open developer tools
2. Check the Console tab for any errors
3. Use the Network tab to monitor API requests
4. Test responsive design using the device emulation feature

## 📱 Viewing on Mobile Devices

### Using Windows Device Emulation

1. Open the application in Chrome or Edge
2. Press F12 to open developer tools
3. Click on the "Toggle device toolbar" icon or press Ctrl+Shift+M
4. Select a mobile device from the dropdown menu

### Using Your Actual Mobile Device

1. Ensure your computer and mobile device are on the same network
2. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
3. Note the IPv4 Address (e.g., 192.168.1.100)
4. In the Vite configuration, update the server settings:
   ```javascript
   // vite.config.js
   export default defineConfig({
     server: {
       host: '0.0.0.0'
     },
     // other config...
   })
   ```
5. Restart the development server
6. On your mobile device, open the browser and navigate to:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```

## 📝 Git Setup for Windows

### Setting Up Git Identity

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Setting Up SSH Keys (Optional)

1. Generate SSH key:
   ```powershell
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```
2. Start the SSH agent:
   ```powershell
   # Start the ssh-agent in the background
   Get-Service ssh-agent | Set-Service -StartupType Automatic
   Start-Service ssh-agent
   ```
3. Add your SSH key to the agent:
   ```powershell
   ssh-add $env:USERPROFILE\.ssh\id_ed25519
   ```
4. Copy your public key:
   ```powershell
   Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | clip
   ```
5. Add the key to your GitHub account

## 🔄 Updating the Project

To get the latest changes from the repository:

```powershell
# Ensure you're in the project directory
cd C:\Projects\hackaton1_one.al  # Adjust path as needed

# Fetch the latest changes
git pull origin master

# Install any new dependencies
npm install
```

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Git Documentation](https://git-scm.com/doc)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Material UI Documentation](https://mui.com/getting-started/installation/)

## 🆘 Getting Help

If you encounter any issues not covered in this guide, please contact:
- For frontend issues: Elvi Zekaj
- For UI/UX issues: Aldin Zendeli
- For backend issues: Guido Andreini
- For project management: Lorenzo Agnello
