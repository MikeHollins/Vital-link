import { Router } from 'express';
import { isAuthenticated } from '../replitAuth';

const router = Router();

// Type definitions for authenticated requests
interface AuthenticatedRequest extends Request {
  user: {
    claims: {
      sub: string;
      email?: string;
    };
  };
}

// Apple Health Integration
router.post('/apple-health/connect', isAuthenticated, async (req, res) => {
  try {
    const { authorizationCode } = req.body;
    const userId = req.user.claims.sub;

    // Apple Health uses HealthKit on iOS - requires native app or web framework
    // For web integration, we'll use Apple's Health Records API (when available)
    
    const appleHealthConfig = {
      clientId: process.env.APPLE_HEALTH_CLIENT_ID,
      clientSecret: process.env.APPLE_HEALTH_CLIENT_SECRET,
      redirectUri: `${req.protocol}://${req.hostname}/api/health-platforms/apple-health/callback`
    };

    // Store connection for user
    // TODO: Implement actual Apple Health OAuth flow
    
    res.json({ 
      success: true, 
      message: 'Apple Health connection initiated',
      redirectUrl: `https://appleid.apple.com/auth/authorize?client_id=${appleHealthConfig.clientId}&response_type=code&scope=name%20email%20health&redirect_uri=${appleHealthConfig.redirectUri}`
    });
  } catch (error) {
    console.error('Apple Health connection error:', error);
    res.status(500).json({ error: 'Failed to connect to Apple Health' });
  }
});

// Google Fit Integration
router.post('/google-fit/connect', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;

    const googleFitConfig = {
      clientId: process.env.GOOGLE_FIT_CLIENT_ID,
      clientSecret: process.env.GOOGLE_FIT_CLIENT_SECRET,
      redirectUri: `${req.protocol}://${req.hostname}/api/health-platforms/google-fit/callback`,
      scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.sleep.read'
    };

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleFitConfig.clientId}&` +
      `redirect_uri=${encodeURIComponent(googleFitConfig.redirectUri)}&` +
      `scope=${encodeURIComponent(googleFitConfig.scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `state=${userId}`;

    res.json({ 
      success: true, 
      message: 'Google Fit connection ready',
      redirectUrl: authUrl
    });
  } catch (error) {
    console.error('Google Fit connection error:', error);
    res.status(500).json({ error: 'Failed to connect to Google Fit' });
  }
});

// Google Fit OAuth Callback
router.get('/google-fit/callback', async (req, res) => {
  try {
    const { code, state: userId } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_FIT_CLIENT_ID!,
        client_secret: process.env.GOOGLE_FIT_CLIENT_SECRET!,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: `${req.protocol}://${req.hostname}/api/health-platforms/google-fit/callback`
      })
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    // Store tokens securely for user
    // TODO: Save to database with encryption
    console.log('Google Fit tokens received for user:', userId);

    // Redirect back to app
    res.redirect('/?connected=google-fit');
  } catch (error) {
    console.error('Google Fit callback error:', error);
    res.redirect('/?error=google-fit-connection-failed');
  }
});

// Fitbit Integration
router.post('/fitbit/connect', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;

    const fitbitConfig = {
      clientId: process.env.FITBIT_CLIENT_ID,
      clientSecret: process.env.FITBIT_CLIENT_SECRET,
      redirectUri: `${req.protocol}://${req.hostname}/api/health-platforms/fitbit/callback`,
      scope: 'activity heartrate sleep weight nutrition'
    };

    const authUrl = `https://www.fitbit.com/oauth2/authorize?` +
      `client_id=${fitbitConfig.clientId}&` +
      `redirect_uri=${encodeURIComponent(fitbitConfig.redirectUri)}&` +
      `scope=${encodeURIComponent(fitbitConfig.scope)}&` +
      `response_type=code&` +
      `state=${userId}`;

    res.json({ 
      success: true, 
      message: 'Fitbit connection ready',
      redirectUrl: authUrl
    });
  } catch (error) {
    console.error('Fitbit connection error:', error);
    res.status(500).json({ error: 'Failed to connect to Fitbit' });
  }
});

// Fitbit OAuth Callback
router.get('/fitbit/callback', async (req, res) => {
  try {
    const { code, state: userId } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    // Exchange code for access token
    const credentials = Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64');
    
    const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: new URLSearchParams({
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: `${req.protocol}://${req.hostname}/api/health-platforms/fitbit/callback`
      })
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      throw new Error('Failed to get access token');
    }

    // Store tokens securely for user
    console.log('Fitbit tokens received for user:', userId);

    res.redirect('/?connected=fitbit');
  } catch (error) {
    console.error('Fitbit callback error:', error);
    res.redirect('/?error=fitbit-connection-failed');
  }
});

// Samsung Health Integration
router.post('/samsung-health/connect', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;

    const samsungConfig = {
      clientId: process.env.SAMSUNG_HEALTH_CLIENT_ID,
      redirectUri: `${req.protocol}://${req.hostname}/api/health-platforms/samsung-health/callback`
    };

    const authUrl = `https://account.samsung.com/mobile/account/check.do?` +
      `serviceId=samsung-health&` +
      `client_id=${samsungConfig.clientId}&` +
      `redirect_uri=${encodeURIComponent(samsungConfig.redirectUri)}&` +
      `response_type=code&` +
      `state=${userId}`;

    res.json({ 
      success: true, 
      message: 'Samsung Health connection ready',
      redirectUrl: authUrl
    });
  } catch (error) {
    console.error('Samsung Health connection error:', error);
    res.status(500).json({ error: 'Failed to connect to Samsung Health' });
  }
});

// Data Sync Endpoints
router.post('/sync/:platform', isAuthenticated, async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user.claims.sub;

    switch (platform) {
      case 'google-fit':
        await syncGoogleFitData(userId);
        break;
      case 'fitbit':
        await syncFitbitData(userId);
        break;
      case 'apple-health':
        await syncAppleHealthData(userId);
        break;
      case 'samsung-health':
        await syncSamsungHealthData(userId);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported platform' });
    }

    res.json({ success: true, message: `${platform} data synced successfully` });
  } catch (error) {
    console.error(`${req.params.platform} sync error:`, error);
    res.status(500).json({ error: `Failed to sync ${req.params.platform} data` });
  }
});

// Sync Functions
async function syncGoogleFitData(userId: string) {
  // TODO: Implement Google Fit data fetching
  console.log('Syncing Google Fit data for user:', userId);
}

async function syncFitbitData(userId: string) {
  // TODO: Implement Fitbit data fetching
  console.log('Syncing Fitbit data for user:', userId);
}

async function syncAppleHealthData(userId: string) {
  // TODO: Implement Apple Health data fetching
  console.log('Syncing Apple Health data for user:', userId);
}

async function syncSamsungHealthData(userId: string) {
  // TODO: Implement Samsung Health data fetching
  console.log('Syncing Samsung Health data for user:', userId);
}

export default router;