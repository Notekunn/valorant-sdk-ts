/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
// Valorant API Regions
export enum ValorantRegion {
  Ap = 'ap',
  Br = 'br',
  Eu = 'eu',
  Kr = 'kr',
  Latam = 'latam',
  Na = 'na',
}

// Riot API Regions
export enum RiotRegion {
  Americas = 'americas',
  Asia = 'asia',
  Europe = 'europe',
  Sea = 'sea',
}

// API Base URLs
export enum ApiBaseUrl {
  RiotAccount = 'https://americas.api.riotgames.com',
  RiotAuth = 'https://auth.riotgames.com',
  RiotEntitlements = 'https://entitlements.auth.riotgames.com',
  RiotGeo = 'https://riot-geo.pas.si.riotgames.com',
  ValorantGlz = 'https://glz-{region}-1.{region}.a.pvp.net',
  ValorantPd = 'https://pd.{region}.a.pvp.net',
  ValorantShared = 'https://shared.{region}.a.pvp.net',
  ThirdPartyApi = 'https://valorant-api.com/',
}

// Valorant API Endpoints
export enum ValorantEndpoint {
  Region = '/pas/v1/product/valorant',
  Version = '/v1/version',
  // Core Game
  CoreGameMatch = '/core-game/v1/matches/{matchId}',
  CoreGamePlayer = '/core-game/v1/players/{puuid}',

  // Game Content
  Content = '/content-service/v3/content',

  // Match History
  MatchDetails = '/match/v1/matches/{matchId}',
  MatchHistory = '/match/v1/matches/by-puuid/{puuid}/ids',

  // Party
  PartyId = '/parties/v1/parties/{partyId}',
  PartyPlayer = '/parties/v1/players/{puuid}',

  // Player Data
  PlayerLoadout = '/personalization/v2/players/{puuid}/loadout',
  PlayerMmr = '/mmr/v1/players/{puuid}',
  PlayerNames = '/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}',
  PlayerStore = '/store/v3/storefront/{puuid}',
  PlayerWallet = '/store/v1/wallet/{puuid}',

  // Pre-Game
  PregameMatch = '/pregame/v1/matches/{matchId}',
  PregamePlayer = '/pregame/v1/players/{puuid}',
}

// Riot API Endpoints
export enum RiotEndpoint {
  AuthCookies = '/authorize',
  AuthMultifactor = '/api/v1/authorization',
  Entitlements = '/api/token/v1',
  UserInfo = '/userinfo',
}

// Game Modes
export enum GameMode {
  Competitive = 'competitive',
  Custom = 'custom',
  Deathmatch = 'deathmatch',
  Escalation = 'ggteam',
  Replication = 'onefa',
  SpikeRush = 'spikerush',
  Unrated = 'unrated',
}

// Maps
export enum Map {
  Ascent = 'Ascent',
  Bind = 'Bind',
  Haven = 'Haven',
  Split = 'Split',
  Icebox = 'Icebox',
  Breeze = 'Breeze',
  Fracture = 'Fracture',
  Pearl = 'Pearl',
  Lotus = 'Lotus',
  Sunset = 'Sunset',
}

// Agents
export enum Agent {
  Brimstone = '5F8D3A7F-467B-97E3-062C-AC0F5962A226',
  Viper = '569FDD95-4D10-43AB-CA70-79BECC9B28C8',
  Omen = '8E253930-4C05-31DD-1B6C-968525494517',
  Killjoy = '1E58DE9C-4950-5125-93E9-A0AEE9F98746',
  Cypher = '117ED9E3-49F3-6512-3CCF-0CABA7B382FB',
  Sova = '320B2A48-4D9B-A075-30F1-1F93A9CD638D',
  Sage = '6F2A04CA-4E98-F574-15B2-3E3D1F1F7492',
  Phoenix = 'EB93336A-449B-9C1D-5A23-9E9C7C88E8E8',
  Jett = 'ADD6443A-41BD-E414-F6AD-E58D267F4E95',
  Reyna = 'A3BFB853-43B2-7238-A4F1-AD90B9DFC831',
  Breach = '5F8D3A7F-467B-97E3-062C-AC0F5962A226',
  Skye = '41FB69C1-4189-7B37-F117-BCFAF43CE3B4',
  Yoru = '601DBBE7-43CE-BE57-2A40-4ABD24753673',
  Astra = '22697A3D-45BF-8DD7-4FEC-84A9E28C3D22',
  Kayo = 'BB2A4828-46EB-8E1E-9E84-AC197398F4B9',
  Chamber = '22697A3D-45BF-8DD7-4FEC-84A9E28C3D22',
  Neon = 'BB2A4828-46EB-8E1E-9E84-AC197398F4B9',
  Fade = 'DADE69B4-4F5A-8528-247B-BE7CD0A1B5F1',
  Harbor = '95B78A76-4560-51E1-9CC3-7B57C3832CFB',
  Gekko = 'E370FA57-4757-3604-3648-499E1F642D3F',
  Deadlock = 'CC8B64C8-4B25-4FF9-6E7F-37B4DA43C235',
  Iso = '0E38B510-460A-C26E-8BEC-A5EFE078D116',
  Clove = '1DAAA3BD-4CEE-4F4C-8F4C-8F4C8F4C8F4C',
}

// Error Messages
export enum ErrorMessage {
  InvalidCredentials = 'Invalid username or password',
  MultifactorRequired = 'Multifactor authentication required',
  RateLimited = 'Rate limited by Riot API',
  NetworkError = 'Network error occurred',
  InvalidResponse = 'Invalid response from server',
  SessionExpired = 'Session has expired',
  Unauthorized = 'Unauthorized access',
  NotFound = 'Resource not found',
  ServerError = 'Internal server error',
}

// Cache Keys
export enum CacheKey {
  UserInfo = 'user_info',
  MatchHistory = 'match_history',
  MmrData = 'mmr_data',
  StoreData = 'store_data',
  ContentData = 'content_data',
}
