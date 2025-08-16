import { AuthAPI } from '../src/api/auth';
import { GameAPI } from '../src/api/game';

/**
 * Example: Authenticate with Riot Games using existing cookies
 *
 * This example shows how to authenticate using cookies that you've already obtained
 * from a previous login session or from browser cookies.
 */
async function authenticateWithCookies() {
  try {
    const riotAuth = new AuthAPI();
    const valorantAPI = new GameAPI({
      userAgent: 'RiotClient/58.0.0.6400294126 (Windows; 10; Professional (Build 19041))',
    });

    const cookies = process.env['VALID_COOKIES'] ?? '';

    const authResult = await riotAuth.reAuthenticate(cookies);

    // Check if authenticated
    if (riotAuth.isAuthenticated(authResult)) {
      console.log('✅ User is authenticated');
    } else {
      console.log('❌ User is not authenticated');
    }
    const userInfo = await riotAuth.getUserInfo(authResult);

    const region = await valorantAPI.getRegion(authResult.accessToken, authResult.idToken);

    const reAuthResult = await riotAuth.refreshToken(authResult);
    const shop = await valorantAPI.getShop(reAuthResult, region, userInfo.puuid);
    console.log(JSON.stringify(shop));

    return authResult;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}

authenticateWithCookies()
  .then(() => {
    console.log('Cookie authentication example completed successfully');
  })
  .catch(error => {
    console.error('Cookie authentication example failed:', error);
    process.exit(1);
  });
