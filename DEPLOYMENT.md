# ONE Albania SME Dashboard Deployment Guide

This guide provides instructions for deploying the ONE Albania SME Dashboard backend to different environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Database Migration](#database-migration)
6. [Monitoring Setup](#monitoring-setup)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker and Docker Compose
- Node.js 18 or higher (for local development)
- MySQL 8.0 or higher
- Access to GitHub repository
- Access to deployment servers
- Required API keys (Gemini API, ONE Albania API, etc.)

## Environment Setup

### Environment Variables

The application uses environment-specific configuration files:

- `.env.development` - Local development environment
- `.env.test` - Testing environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

To set up a new environment:

1. Copy the appropriate template:
   ```bash
   cp api/.env.production api/.env
   ```

2. Update the environment variables with your specific values:
   - Database credentials
   - JWT secret
   - API keys
   - Email/SMS configuration

### Security Configuration

Security settings are managed in `api/config/security.js`. Key security features include:

- Helmet security headers
- CORS configuration
- Rate limiting
- Content Security Policy

## Deployment Options

### Docker Deployment (Recommended)

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. Verify the deployment:
   ```bash
   docker-compose ps
   ```

3. Check the logs:
   ```bash
   docker-compose logs -f api
   ```

### Manual Deployment

1. Install dependencies:
   ```bash
   cd api
   npm ci --production
   ```

2. Start the server:
   ```bash
   NODE_ENV=production node server.js
   ```

### Server Requirements

- **Minimum**: 2 CPU cores, 4GB RAM, 20GB storage
- **Recommended**: 4 CPU cores, 8GB RAM, 40GB storage
- **Database**: Separate instance with at least 2 CPU cores, 4GB RAM

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment.

### Workflow

1. **Test**: Run linting and tests on every push and pull request
2. **Security Scan**: Perform security scanning of dependencies
3. **Build**: Create deployment package for staging/production
4. **Deploy**: Deploy to staging (develop branch) or production (main branch)

### Setting Up GitHub Secrets

The following secrets need to be configured in GitHub:

- `STAGING_HOST`, `STAGING_USERNAME`, `STAGING_SSH_KEY`
- `PRODUCTION_HOST`, `PRODUCTION_USERNAME`, `PRODUCTION_SSH_KEY`
- Database credentials
- API keys

## Database Migration

Database migrations are handled automatically during deployment.

### Manual Migration

To run migrations manually:

```bash
cd api
npm run db:migrate
```

### Backup and Restore

Before major deployments, back up the database:

```bash
docker exec onealbania-db mysqldump -u root -p one_albania_db > backup.sql
```

To restore:

```bash
cat backup.sql | docker exec -i onealbania-db mysql -u root -p one_albania_db
```

## Monitoring Setup

The deployment includes Prometheus and Grafana for monitoring.

### Accessing Monitoring

- Prometheus: http://your-server:9090
- Grafana: http://your-server:3000 (default credentials: admin/admin)

### Alerts

Configure alerts in Grafana for:

- High error rates
- Slow response times
- High CPU/memory usage
- Database connection issues

## Security Considerations

### SSL/TLS

Always use HTTPS in production. Configure your reverse proxy (Nginx, Apache) to handle SSL termination.

### Firewall Rules

Restrict access to:

- API: Allow only from frontend servers and monitoring
- Database: Allow only from API servers
- Monitoring: Restrict to internal network or VPN

### Regular Updates

Keep dependencies updated:

```bash
npm audit
npm update
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Check database credentials
   - Verify network connectivity
   - Check database service status

2. **API Key Issues**:
   - Verify API keys are correctly set in environment variables
   - Check API provider status

3. **Performance Problems**:
   - Check monitoring dashboards
   - Review logs for slow queries
   - Check server resources

### Logs

Access logs in the following locations:

- Docker: `docker-compose logs -f api`
- File system: `api/logs/`

### Support

For additional support, contact:

- Email: support@onealbania.al
- Internal: IT Operations Team
