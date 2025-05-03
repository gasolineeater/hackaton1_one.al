/**
 * API versioning middleware
 * Handles API versioning in the URL path or Accept header
 */

/**
 * API version middleware
 * @param {Object} options - Options
 * @returns {Function} - Express middleware
 */
const apiVersion = (options = {}) => {
  const defaultOptions = {
    defaultVersion: '1',
    versions: ['1'],
    headerName: 'Accept-Version'
  };

  const config = { ...defaultOptions, ...options };

  return (req, res, next) => {
    // Check URL path for version (e.g., /v1/users)
    const urlVersion = req.path.match(/^\/v(\d+)\//);
    
    // Check Accept-Version header
    const headerVersion = req.get(config.headerName);
    
    // Determine version
    let version;
    
    if (urlVersion && urlVersion[1]) {
      version = urlVersion[1];
    } else if (headerVersion) {
      version = headerVersion;
    } else {
      version = config.defaultVersion;
    }
    
    // Validate version
    if (!config.versions.includes(version)) {
      return res.status(400).json({
        status: 'error',
        message: `API version ${version} is not supported. Supported versions: ${config.versions.join(', ')}`
      });
    }
    
    // Add version to request
    req.apiVersion = version;
    
    next();
  };
};

module.exports = apiVersion;
