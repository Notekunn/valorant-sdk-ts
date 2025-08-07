# Valorant API Library

A modern TypeScript library for interacting with Riot Games' Valorant API, featuring authentication, player data, match history, and more.

## Features

- 🔐 **Riot Authentication** - Secure login with username/password and multifactor support
- 🎮 **Player Data** - MMR, loadouts, wallet, and store information
- 📊 **Match History** - Detailed match data and statistics
- 🏆 **Competitive Data** - Rank information and MMR tracking
- 💾 **Smart Caching** - Built-in caching with configurable TTL
- 🔄 **Auto Retry** - Automatic retry logic with exponential backoff
- 📝 **TypeScript** - Full TypeScript support with comprehensive type definitions
- 🛡️ **Error Handling** - Robust error handling and validation

## Installation

```bash
pnpm add valorant-api
```

## Quick Start

```typescript
import { AuthAPI, GameAPI } from 'valorant-api';

// Initialize the APIs
const auth = new AuthAPI();
const game = new GameAPI({
  userAgent: 'RiotClient/58.0.0.6400294126 (Windows; 10; Professional (Build 19041))',
  timeout: 10000,
  retries: 3,
});

// Authenticate with username and password
const authResult = await auth.authenticate({
  username: 'your-username',
  password: 'your-password',
  region: 'na',
  rememberMe: true,
});

// Or authenticate with existing cookies
const authResult = await auth.reAuthenticate('your-cookie-string');

// Get user information
const userInfo = await auth.getUserInfo(authResult);

// Get player by Riot ID
const player = await game.getPlayerByName('PlayerName', 'TAG');

// Get region and shop data
const region = await game.getRegion(authResult.accessToken, authResult.idToken);
const shop = await game.getShop(authResult, region, userInfo.puuid);
```

## Authentication

### Basic Authentication

```typescript
import { AuthAPI } from 'valorant-api';

const auth = new AuthAPI();

// Authenticate with username and password
const authResult = await auth.authenticate({
  username: 'your-username',
  password: 'your-password',
  region: 'na',
  rememberMe: true,
});

// Check if authenticated
if (auth.isAuthenticated(authResult)) {
  console.log('Successfully authenticated!');
  console.log('Access Token:', authResult.accessToken);
  console.log('Entitlements Token:', authResult.entitlementsToken);
}
```

### Multifactor Authentication

```typescript
import { AuthAPI } from 'valorant-api';

const auth = new AuthAPI();

try {
  const authResult = await auth.authenticate({
    username: 'username',
    password: 'password',
    region: 'na',
    rememberMe: true,
  });
} catch (error) {
  if (error.message.includes('multifactor')) {
    // Handle MFA - you'll need the cookies from the failed auth attempt
    const cookies = []; // Extract from previous attempt
    const mfaResult = await auth.handleMultifactor(cookies, '123456');
    console.log('MFA completed:', mfaResult);
  }
}
```

### Cookie-Based Authentication

You can also authenticate using existing cookies from a previous session or browser cookies. This is useful for:

- Reusing saved authentication sessions
- Extracting cookies from browser sessions  
- Avoiding repeated username/password authentication

```typescript
import { AuthAPI } from 'valorant-api';

const auth = new AuthAPI();

// Authenticate using existing cookie string
const cookieString = 'ssid=value; tdid=value; sub=value; csid=value; clid=value';
const authResult = await auth.reAuthenticate(cookieString);

console.log('Access Token:', authResult.accessToken);
console.log('Entitlements Token:', authResult.entitlementsToken);
```

#### Extracting Cookies from Browser

You can extract cookies from your browser's developer tools:

1. Open browser developer tools (F12)
2. Go to the Application/Storage tab
3. Find cookies for `auth.riotgames.com`
4. Copy the values as a semicolon-separated string: `ssid=value; tdid=value; sub=value; csid=value; clid=value`

#### Saving and Reusing Cookies

```typescript
// After normal authentication, save the cookies
const authResult = await auth.authenticate({
  username: 'username',
  password: 'password',
  region: 'na',
  rememberMe: true,
});

// Save cookies for later use (if available)
const savedCookies = authResult.cookies;

// Later, use saved cookies to authenticate
const cookieAuth = new AuthAPI();
const cookieString = savedCookies?.map(c => `${c.name}=${c.value}`).join('; ') || '';
await cookieAuth.reAuthenticate(cookieString);
```

## Game API Usage

### Get Player Information

```typescript
import { GameAPI } from 'valorant-api';

const game = new GameAPI();

// Get player by Riot ID
const player = await game.getPlayerByName('PlayerName', 'TAG');
console.log(`Player: ${player.gameName}#${player.tagLine}`);
console.log(`PUUID: ${player.puuid}`);
console.log(`Region: ${player.region}`);
console.log(`Account Level: ${player.accountLevel}`);
```

### Get User Region

```typescript
// Get the user's region from auth tokens
const region = await game.getRegion(authResult.accessToken, authResult.idToken);
console.log(`User region: ${region}`);
```

### Get Player Store

```typescript
// Get authenticated user info first
const userInfo = await auth.getUserInfo(authResult);

// Get the player's store/shop
const shop = await game.getShop(authResult, region, userInfo.puuid);

// Featured bundle
console.log('Featured Bundle:', shop.FeaturedBundle.Bundle.ID);
console.log('Bundle Duration:', shop.FeaturedBundle.BundleRemainingDurationInSeconds);

// Daily store offers
shop.SkinsPanelLayout.SingleItemStoreOffers.forEach(offer => {
  console.log(`Offer ID: ${offer.OfferID}`);
  console.log(`Cost: ${JSON.stringify(offer.Cost)}`);
  console.log(`Rewards: ${offer.Rewards.length} items`);
});

// Night market (if available)
if (shop.BonusStore) {
  shop.BonusStore.BonusStoreOffers.forEach(offer => {
    console.log(`Bonus Offer: ${offer.BonusOfferID}`);
    console.log(`Discount: ${offer.DiscountPercent}%`);
  });
}
```

## Configuration

### GameAPI Configuration

```typescript
import { GameAPI } from 'valorant-api';

const game = new GameAPI({
  userAgent: 'RiotClient/58.0.0.6400294126 (Windows; 10; Professional (Build 19041))',
  timeout: 10000, // 10 seconds
  retries: 3, // Number of retry attempts
});
```

## API Reference

### AuthAPI

The `AuthAPI` class handles Riot Games authentication and user information.

#### Constructor

```typescript
new AuthAPI()
```

No parameters required for initialization.

#### Methods

##### `authenticate(config: RiotAuthConfig): Promise<RiotReAuthResponse>`

Authenticate with Riot Games using username and password.

**Input (`RiotAuthConfig`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | `string` | ✓ | Riot Games username |
| `password` | `string` | ✓ | Riot Games password |
| `region` | `string` | ✓ | Region code (na, eu, ap, kr, br, latam) |
| `rememberMe` | `boolean` | ✗ | Whether to remember the session |

**Output (`RiotReAuthResponse`):**

| Field | Type | Description |
|-------|------|-------------|
| `accessToken` | `string` | Access token for API requests |
| `idToken` | `string` | ID token for user identification |
| `entitlementsToken` | `string` | Entitlements token for Valorant API |
| `cookies` | `RiotAuthCookies` | Session cookies (optional) |

##### `reAuthenticate(cookies: string): Promise<RiotReAuthResponse>`

Re-authenticate using existing cookie string.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookies` | `string` | ✓ | Cookie string in format "name=value; name2=value2" |

**Output:** Same as `authenticate()` method above.

##### `handleMultifactor(cookies: RiotAuthCookies, code: string): Promise<RiotReAuthResponse>`

Handle multifactor authentication.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cookies` | `RiotAuthCookies` | ✓ | Cookies from failed authentication |
| `code` | `string` | ✓ | MFA verification code |

**Output:** Same as `authenticate()` method above.

##### `getUserInfo(auth: RiotReAuthResponse): Promise<RiotUserInfo>`

Get user information from authentication tokens.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `auth` | `RiotReAuthResponse` | ✓ | Authentication response object |

**Output (`RiotUserInfo`):**

| Field | Type | Description |
|-------|------|-------------|
| `country` | `string` | User's country code |
| `puuid` | `string` | Player Universal Unique Identifier |
| `username` | `string` | Username |
| `tagName` | `string` | Full tag name (GameName#TAG) |

##### `isAuthenticated(auth: RiotReAuthResponse): boolean`

Check if user is authenticated.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `auth` | `RiotReAuthResponse` | ✓ | Authentication response to check |

**Output:**

| Type | Description |
|------|-------------|
| `boolean` | `true` if authenticated, `false` otherwise |

##### `refreshTokens(accessToken: string): Promise<string>`

Refresh authentication tokens.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accessToken` | `string` | ✓ | Current access token |

**Output:**

| Type | Description |
|------|-------------|
| `string` | New entitlements token |

### GameAPI

The `GameAPI` class handles Valorant game data and store information.

#### Constructor

```typescript
new GameAPI(config?: ValorantApiConfig)
```

**Input (`ValorantApiConfig`):**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `userAgent` | `string` | ✗ | `'RiotClient/58.0.0.6400294126'` | User agent string |
| `timeout` | `number` | ✗ | `10000` | Request timeout in milliseconds |
| `retries` | `number` | ✗ | `3` | Number of retry attempts |

#### Methods

##### `getPlayerByName(gameName: string, tagLine: string): Promise<ValorantUser>`

Get player information by Riot ID.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gameName` | `string` | ✓ | Player's game name |
| `tagLine` | `string` | ✓ | Player's tag line |

**Output (`ValorantUser`):**

| Field | Type | Description |
|-------|------|-------------|
| `puuid` | `string` | Player Universal Unique Identifier |
| `gameName` | `string` | Player's game name |
| `tagLine` | `string` | Player's tag line |
| `region` | `string` | Player's region |
| `accountLevel` | `number` | Account level |

##### `getRegion(accessToken: string, idToken: string): Promise<string>`

Get user's region from authentication tokens.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `accessToken` | `string` | ✓ | Access token from authentication |
| `idToken` | `string` | ✓ | ID token from authentication |

**Output:**

| Type | Description |
|------|-------------|
| `string` | User's region code |

##### `getShop(auth: RiotReAuthResponse, region: string, puuid: string): Promise<StorefrontResponse>`

Get player's store/shop information.

**Input:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `auth` | `RiotReAuthResponse` | ✓ | Authentication response |
| `region` | `string` | ✓ | Player's region |
| `puuid` | `string` | ✓ | Player's PUUID |

**Output (`StorefrontResponse`):**

| Field | Type | Description |
|-------|------|-------------|
| `FeaturedBundle` | `object` | Featured bundle information |
| `SkinsPanelLayout` | `object` | Daily store offers |
| `UpgradeCurrencyStore` | `object` | Radianite offers |
| `AccessoryStore` | `object` | Accessory store offers |
| `BonusStore` | `object` | Night market offers (optional) |

**Featured Bundle Object:**

| Field | Type | Description |
|-------|------|-------------|
| `Bundle` | `Bundle` | Bundle details |
| `Bundles` | `Bundle[]` | Array of bundles |
| `BundleRemainingDurationInSeconds` | `number` | Time remaining |

**SkinsPanelLayout Object:**

| Field | Type | Description |
|-------|------|-------------|
| `SingleItemOffers` | `string[]` | Array of offer IDs |
| `SingleItemStoreOffers` | `Offer[]` | Array of offer details |
| `SingleItemOffersRemainingDurationInSeconds` | `number` | Time remaining |

**Offer Object:**

| Field | Type | Description |
|-------|------|-------------|
| `OfferID` | `string` | Unique offer identifier |
| `IsDirectPurchase` | `boolean` | Whether it's a direct purchase |
| `StartDate` | `string` | Offer start date (ISO 8601) |
| `Cost` | `CurrencyMap` | Cost in various currencies |
| `Rewards` | `Reward[]` | Items included in the offer |

## Error Handling

```typescript
import { AuthAPI, GameAPI } from 'valorant-api';

const auth = new AuthAPI();
const game = new GameAPI();

try {
  const player = await game.getPlayerByName('PlayerName', 'TAG');
} catch (error) {
  if (error.message.includes('Not Found')) {
    console.log('Player not found');
  } else if (error.message.includes('Unauthorized')) {
    console.log('Authentication required');
    // Re-authenticate if needed
    const authResult = await auth.authenticate({
      username: 'username',
      password: 'password',
      region: 'na'
    });
  } else {
    console.error('API Error:', error.message);
  }
}

// Handle authentication errors
try {
  const authResult = await auth.authenticate({
    username: 'username', 
    password: 'password',
    region: 'na'
  });
} catch (error) {
  if (error.message.includes('multifactor')) {
    console.log('MFA required');
  } else if (error.message.includes('Invalid username or password')) {
    console.log('Invalid credentials');
  } else {
    console.error('Auth Error:', error.message);
  }
}
```

## Constants and Enums

### Available Regions

```typescript
import { ValorantRegion } from 'valorant-api';

// Available regions
console.log(ValorantRegion.Na);    // 'na'
console.log(ValorantRegion.Eu);    // 'eu'
console.log(ValorantRegion.Ap);    // 'ap'  
console.log(ValorantRegion.Kr);    // 'kr'
console.log(ValorantRegion.Br);    // 'br'
console.log(ValorantRegion.Latam); // 'latam'
```

### Game Modes

```typescript
import { GameMode } from 'valorant-api';

// Available game modes
console.log(GameMode.Competitive); // 'competitive'
console.log(GameMode.Unrated);     // 'unrated'
console.log(GameMode.Deathmatch);  // 'deathmatch'
console.log(GameMode.SpikeRush);   // 'spikerush'
console.log(GameMode.Escalation);  // 'ggteam'
console.log(GameMode.Replication); // 'onefa'
console.log(GameMode.Custom);      // 'custom'
```

### Maps

```typescript
import { Map } from 'valorant-api';

// Available maps
console.log(Map.Ascent);   // 'Ascent'
console.log(Map.Bind);     // 'Bind'
console.log(Map.Haven);    // 'Haven'
console.log(Map.Split);    // 'Split'
console.log(Map.Icebox);   // 'Icebox'
console.log(Map.Breeze);   // 'Breeze'
console.log(Map.Fracture); // 'Fracture'
console.log(Map.Pearl);    // 'Pearl'
console.log(Map.Lotus);    // 'Lotus'
console.log(Map.Sunset);   // 'Sunset'
```

### Agents

```typescript
import { Agent } from 'valorant-api';

// Agent UUIDs
console.log(Agent.Jett);      // 'ADD6443A-41BD-E414-F6AD-E58D267F4E95'
console.log(Agent.Phoenix);   // 'EB93336A-449B-9C1D-5A23-9E9C7C88E8E8'
console.log(Agent.Sage);      // '6F2A04CA-4E98-F574-15B2-3E3D1F1F7492'
console.log(Agent.Sova);      // '320B2A48-4D9B-A075-30F1-1F93A9CD638D'
// ... and more agents
```

### Error Messages

```typescript
import { ErrorMessage } from 'valorant-api';

// Pre-defined error messages
console.log(ErrorMessage.InvalidCredentials);  // 'Invalid username or password'
console.log(ErrorMessage.MultifactorRequired); // 'Multifactor authentication required'
console.log(ErrorMessage.RateLimited);         // 'Rate limited by Riot API'
console.log(ErrorMessage.NetworkError);        // 'Network error occurred'
console.log(ErrorMessage.SessionExpired);      // 'Session has expired'
```

## Development

### Building

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Watch for changes
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Testing

```typescript
import { AuthAPI, GameAPI } from 'valorant-api';

describe('AuthAPI', () => {
  let auth: AuthAPI;

  beforeEach(() => {
    auth = new AuthAPI();
  });

  it('should authenticate successfully', async () => {
    const authResult = await auth.authenticate({
      username: 'test-user',
      password: 'test-pass',
      region: 'na'
    });
    expect(auth.isAuthenticated(authResult)).toBe(true);
  });
});

describe('GameAPI', () => {
  let game: GameAPI;

  beforeEach(() => {
    game = new GameAPI();
  });

  it('should get player by name', async () => {
    const player = await game.getPlayerByName('TestPlayer', 'TAG');
    expect(player.puuid).toBeDefined();
    expect(player.gameName).toBe('TestPlayer');
    expect(player.tagLine).toBe('TAG');
  });
});
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This library is not affiliated with Riot Games or Valorant. Use at your own risk and in compliance with Riot Games' Terms of Service.

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the maintainers.

## Changelog

### v1.0.0
- Initial release
- Riot authentication support
- Player data and MMR endpoints
- Match history and statistics
- Smart caching system
- Comprehensive TypeScript types 