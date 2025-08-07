import { AxiosError } from 'axios';

import { ApiBaseUrl, ValorantEndpoint } from '../utils/enum';
import { HttpClient } from '../utils/http-client';

import type {
  ValorantUser,
  ValorantApiConfig,
  ValorantVersion,
  RiotReAuthResponse,
  StorefrontResponse,
} from '../types';

export class GameAPI {
  private httpClient: HttpClient;
  private config: ValorantApiConfig;
  private version: ValorantVersion | null = null;

  constructor(config: ValorantApiConfig) {
    this.config = {
      ...config,
    };

    this.httpClient = new HttpClient({
      headers: {
        'User-Agent': this.config.userAgent || 'RiotClient/58.0.0.6400294126',
      },
      retries: this.config.retries ?? 3,
      timeout: this.config.timeout ?? 10000,
    });
    this.getVersion();
  }

  async getRegion(accessToken: string, idToken: string): Promise<string> {
    try {
      const regionClient = new HttpClient({
        baseURL: ApiBaseUrl.RiotGeo,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const response = await regionClient.put(ValorantEndpoint.Region, {
        id_token: idToken,
      });

      return response?.affinities?.live;
    } catch (error) {
      throw new Error(`Failed to get region: ${error}`);
    }
  }

  async getShop(
    auth: RiotReAuthResponse,
    region: string,
    puuid: string
  ): Promise<StorefrontResponse> {
    try {
      const riotHeaders = this.getRiotHeaders();
      const baseURL = ApiBaseUrl.ValorantPd.replace('{region}', region);
      const url = ValorantEndpoint.PlayerStore.replace('{puuid}', puuid);
      const response = await this.httpClient.request({
        baseURL,
        url,
        method: 'POST',
        headers: {
          ...riotHeaders,
          Authorization: `Bearer ${auth.accessToken}`,
          'X-Riot-Entitlements-JWT': auth.entitlementsToken,
        },
        data: {},
      });

      if (response.status !== 200) {
        throw new Error(`Failed to get shop: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Failed to get shop: ${error.response?.data.message}`);
      }
      throw error;
    }
  }

  /**
   * Get player information by Riot ID
   */
  async getPlayerByName(gameName: string, tagLine: string): Promise<ValorantUser> {
    const url = ValorantEndpoint.PlayerNames.replace('{gameName}', gameName).replace(
      '{tagLine}',
      tagLine
    );

    const baseURL = ApiBaseUrl.RiotAccount;
    this.httpClient.setBaseURL(baseURL);

    return this.httpClient.get<ValorantUser>(url);
  }

  /**
   * Set authentication headers for API requests
   */
  private getRiotHeaders(): Record<string, string> {
    // TODO: find out what how to automatically get the latest one of these
    const platformOsVersion = '10.0.19042.1.256.64bit';

    const clientPlatformData = {
      platformType: 'PC',
      platformOS: 'Windows',
      platformOSVersion: platformOsVersion,
      platformChipset: 'Unknown',
    };

    // JSON stringify prettyfied with 1 tab and \r\n, then base64 encode
    const clientPlatformDataJson = JSON.stringify(clientPlatformData, null, '\t');
    const clientPlatformDataBuffer = Buffer.from(clientPlatformDataJson.replace(/\n/g, '\r\n'));
    const clientPlatformDataBase64 = clientPlatformDataBuffer.toString('base64');

    return {
      'X-Riot-ClientPlatform': clientPlatformDataBase64,
      'X-Riot-ClientVersion': this.version?.riotClientVersion ?? '',
    };
  }

  private async getVersion(): Promise<void> {
    const response = await this.httpClient.request({
      baseURL: ApiBaseUrl.ThirdPartyApi,
      url: ValorantEndpoint.Version,
      method: 'GET',
    });
    const data = response.data;
    if (data.status !== 200) {
      throw new Error(`Failed to get version: ${data.status}`);
    }

    if (!data.data) {
      throw new Error('Failed to get version');
    }

    this.version = data.data;
  }
}
