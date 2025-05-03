import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Switch,
  Box,
  Chip,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as EnabledIcon,
  Cancel as DisabledIcon
} from '@mui/icons-material';
import { useServiceManagement } from '../../contexts/ServiceManagementContext';
import { formatDistanceToNow } from 'date-fns';

/**
 * Service Card Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Component
 */
const ServiceCard = ({ service, description }) => {
  const [loading, setLoading] = React.useState(false);
  const { toggleService } = useServiceManagement();

  const handleToggle = async () => {
    setLoading(true);
    try {
      await toggleService(service.id, service.status);
    } catch (error) {
      console.error('Error toggling service:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date
   * @param {string} dateString - Date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            {service.name}
          </Typography>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Switch
              checked={service.status === 'enabled'}
              onChange={handleToggle}
              color="primary"
            />
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description || 'No description available.'}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            icon={service.status === 'enabled' ? <EnabledIcon /> : <DisabledIcon />}
            label={service.status === 'enabled' ? 'Enabled' : 'Disabled'}
            color={service.status === 'enabled' ? 'success' : 'default'}
            size="small"
          />
          
          {service.last_modified && (
            <Tooltip title={new Date(service.last_modified).toLocaleString()}>
              <Typography variant="caption" color="text.secondary">
                {service.status === 'enabled' ? 'Enabled' : 'Last modified'} {formatDate(service.last_modified)}
              </Typography>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
