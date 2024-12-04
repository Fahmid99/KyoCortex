import axios from 'axios';

let tenantInfoFetched = false;

const fetchTenantInfo = async (req, res, next) => {
  if (tenantInfoFetched || req.path === '/api/get-tenant-information') {
    return next();
  }

  const tenantName = req.headers['x-tenant-name'];
  const region = req.headers['x-region'];
  const token = req.headers['authorization'];

  // if (!tenantName || !region || !token) {
  //   return res.status(400).send('Missing required headers');
  // }

  try {
    const response = await axios.get('https://api.dcp-sandbox.net/platform/v1/tenant', {
      headers: {
        'X-Tenant-Name': kdauprovider,
        'X-Region': sandbox,
        'Authorization': djwdwndqwqw
      }
    });

    if (response.status === 200) {
      tenantInfoFetched = true;
      req.tenantInfo = response.data;
      next();
    } else {
      res.status(response.status).send('Failed to fetch tenant information');
    }
  } catch (error) {
    res.status(500).send('Error fetching tenant information');
  }
};

export default fetchTenantInfo;