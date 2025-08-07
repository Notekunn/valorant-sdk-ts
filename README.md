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
import { ValorantAPI, VALORANT_REGIONS } from 'valorant-api';

// Initialize the API
const api = new ValorantAPI({
  region: VALORANT_REGIONS.NA,
  clientVersion: 'release-07.12-shipping-21-2100',
  userAgent: 'RiotClient/58.0.0.6400294126 (Windows; 10; Professional (Build 19041))',
});

// Authenticate
await api.authenticate('your-username', 'your-password');

// Get player by Riot ID
const player = await api.getPlayerByName('PlayerName', 'TAG');

// Get player MMR
const mmr = await api.getPlayerMMR(player.puuid);

// Get recent matches
const matches = await api.getRecentMatches(player.puuid, 5);
```

## Authentication

### Basic Authentication

```typescript
import { ValorantAPI, VALORANT_REGIONS } from 'valorant-api';

const api = new ValorantAPI({
  region: VALORANT_REGIONS.NA,
});

// Authenticate with username and password
await api.authenticate('username', 'password');

// Check if authenticated
if (api.isAuthenticated()) {
  console.log('Successfully authenticated!');
}
```

### Multifactor Authentication

```typescript
import { RiotAuth } from 'valorant-api';

const auth = new RiotAuth();

try {
  await auth.authenticate({
    username: 'username',
    password: 'password',
    region: 'na',
    rememberMe: true,
  });
} catch (error) {
  if (error.message.includes('multifactor')) {
    // Handle MFA
    await auth.handleMultifactor('123456');
  }
}
```

### Cookie-Based Authentication

You can also authenticate using existing cookies from a previous session or browser cookies. This is useful for:

- Reusing saved authentication sessions
- Extracting cookies from browser sessions
- Avoiding repeated username/password authentication

```typescript
import { RiotAuth } from 'valorant-api';

const auth = new RiotAuth();

// Authenticate using existing cookies
const authResult = await auth.authenticateWithCookies({
  cookies: {
    ssid: 'your-ssid-cookie-value',
    tdid: 'your-tdid-cookie-value',
    sub: 'your-sub-cookie-value',
    csid: 'your-csid-cookie-value',
    clid: 'your-clid-cookie-value',
  },
  region: 'na',
});

console.log('Access Token:', authResult.accessToken);
console.log('Entitlements Token:', authResult.entitlementsToken);
```

#### Extracting Cookies from Browser

You can extract cookies from your browser's developer tools:

1. Open browser developer tools (F12)
2. Go to the Application/Storage tab
3. Find cookies for `auth.riotgames.com`
4. Copy the values for `ssid`, `tdid`, `sub`, `csid`, and `clid`

#### Saving and Reusing Cookies

```typescript
// After normal authentication, save the cookies
const normalAuth = await auth.authenticate({
  username: 'username',
  password: 'password',
  region: 'na',
  rememberMe: true,
});

// Save cookies for later use
const savedCookies = normalAuth.cookies;

// Later, use saved cookies to authenticate
const cookieAuth = new RiotAuth();
await cookieAuth.authenticateWithCookies({
  cookies: savedCookies,
  region: 'na',
});
```

## Player Data

### Get Player Information

```typescript
// Get player by Riot ID
const player = await api.getPlayerByName('PlayerName', 'TAG');
console.log(`Player: ${player.gameName}#${player.tagLine}`);
console.log(`Account Level: ${player.accountLevel}`);
```

### Get MMR and Rank

```typescript
const mmr = await api.getPlayerMMR(player.puuid);

// Get competitive data
const competitiveData = mmr.QueueSkills['competitive'];
const currentSeason = competitiveData.CurrentSeasonGamesNeededForRating;

console.log(`Current Rank: ${mmr.LatestCompetitiveUpdate.TierAfterUpdate}`);
console.log(`Ranked Rating: ${mmr.LatestCompetitiveUpdate.RankedRatingAfterUpdate}`);
```

### Get Player Loadout

```typescript
const loadout = await api.getPlayerLoadout(player.puuid);
console.log(`Selected Agent: ${loadout.CharacterID}`);
```

### Get Player Wallet

```typescript
const wallet = await api.getPlayerWallet(player.puuid);
console.log(`VP: ${wallet.Balances['85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741']}`);
console.log(`Radianite: ${wallet.Balances['e59aa87c-4cbf-517a-5983-6e81511be9b7']}`);
```

### Get Store

```typescript
const store = await api.getPlayerStore(player.puuid);

// Featured bundle
console.log('Featured Bundle:', store.FeaturedBundle.Bundle.ID);

// Daily offers
store.SkinsPanelLayout.SingleItemOffers.forEach(offer => {
  console.log(`Skin: ${offer.Item.ItemID} - ${offer.DiscountedPrice} VP`);
});
```

## Match Data

### Get Match History

```typescript
// Get last 20 matches
const matchIds = await api.getMatchHistory(player.puuid, 0, 20);

// Get detailed match information
const match = await api.getMatchDetails(matchIds[0]);

console.log(`Map: ${match.matchInfo.mapId}`);
console.log(`Mode: ${match.matchInfo.gameMode}`);
console.log(`Result: ${match.matchInfo.isCompleted ? 'Completed' : 'In Progress'}`);
```

### Get Player Statistics

```typescript
const stats = await api.getPlayerStats(player.puuid, 10);

console.log(`K/D/A: ${stats.totalKills}/${stats.totalDeaths}/${stats.totalAssists}`);
console.log(`Win Rate: ${stats.winRate.toFixed(1)}%`);
console.log(`Average Score: ${stats.averageScore.toFixed(0)}`);
```

### Analyze Match Performance

```typescript
const matches = await api.getRecentMatches(player.puuid, 5);

matches.forEach(match => {
  const player = match.players.find(p => p.puuid === player.puuid);
  if (player) {
    console.log(`Match ${match.matchInfo.matchId}:`);
    console.log(`  Agent: ${player.characterId}`);
    console.log(`  Kills: ${player.playerStats.kills}`);
    console.log(`  Deaths: ${player.playerStats.deaths}`);
    console.log(`  Assists: ${player.playerStats.assists}`);
    console.log(`  Score: ${player.playerStats.score}`);
  }
});
```

## Game State

### Get Current Party

```typescript
const party = await api.getPartyInfo(player.puuid);
console.log(`Party Size: ${party.Players.length}`);
```

### Get Pre-Game Information

```typescript
const pregame = await api.getPreGameInfo(player.puuid);
console.log(`Map: ${pregame.MapID}`);
console.log(`Mode: ${pregame.GameMode}`);
```

### Get Live Game Information

```typescript
const liveGame = await api.getCoreGameInfo(player.puuid);
console.log(`Match ID: ${liveGame.MatchID}`);
console.log(`Game State: ${liveGame.State}`);
```

## Configuration

### API Configuration

```typescript
import { ValorantAPI, VALORANT_REGIONS } from 'valorant-api';

const api = new ValorantAPI({
  region: VALORANT_REGIONS.NA, // or EU, AP, KR, BR, LATAM
  clientVersion: 'release-07.12-shipping-21-2100',
  userAgent: 'RiotClient/58.0.0.6400294126 (Windows; 10; Professional (Build 19041))',
  timeout: 10000, // 10 seconds
  retries: 3, // Number of retry attempts
});
```

### Cache Configuration

```typescript
import { Cache } from 'valorant-api';

const cache = new Cache({
  ttl: 300, // 5 minutes default TTL
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false,
  deleteOnExpire: true,
});
```

## Error Handling

```typescript
try {
  const player = await api.getPlayerByName('PlayerName', 'TAG');
} catch (error) {
  if (error.message.includes('Not Found')) {
    console.log('Player not found');
  } else if (error.message.includes('Unauthorized')) {
    console.log('Authentication required');
    await api.authenticate('username', 'password');
  } else {
    console.error('API Error:', error.message);
  }
}
```

## Available Regions

```typescript
import { VALORANT_REGIONS } from 'valorant-api';

// Available regions
console.log(VALORANT_REGIONS.NA); // 'na'
console.log(VALORANT_REGIONS.EU); // 'eu'
console.log(VALORANT_REGIONS.AP); // 'ap'
console.log(VALORANT_REGIONS.KR); // 'kr'
console.log(VALORANT_REGIONS.BR); // 'br'
console.log(VALORANT_REGIONS.LATAM); // 'latam'
```

## Game Modes

```typescript
import { GAME_MODES } from 'valorant-api';

// Available game modes
console.log(GAME_MODES.COMPETITIVE); // 'competitive'
console.log(GAME_MODES.UNRATED); // 'unrated'
console.log(GAME_MODES.DEATHMATCH); // 'deathmatch'
console.log(GAME_MODES.SPIKE_RUSH); // 'spikerush'
```

## Maps

```typescript
import { MAPS } from 'valorant-api';

// Available maps
console.log(MAPS.ASCENT); // 'Ascent'
console.log(MAPS.BIND); // 'Bind'
console.log(MAPS.HAVEN); // 'Haven'
console.log(MAPS.SPLIT); // 'Split'
console.log(MAPS.ICEBOX); // 'Icebox'
console.log(MAPS.BREEZE); // 'Breeze'
console.log(MAPS.FRACTURE); // 'Fracture'
console.log(MAPS.PEARL); // 'Pearl'
console.log(MAPS.LOTUS); // 'Lotus'
console.log(MAPS.SUNSET); // 'Sunset'
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
import { ValorantAPI, VALORANT_REGIONS } from 'valorant-api';

describe('ValorantAPI', () => {
  let api: ValorantAPI;

  beforeEach(() => {
    api = new ValorantAPI({
      region: VALORANT_REGIONS.NA,
    });
  });

  it('should authenticate successfully', async () => {
    await api.authenticate('test-user', 'test-pass');
    expect(api.isAuthenticated()).toBe(true);
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