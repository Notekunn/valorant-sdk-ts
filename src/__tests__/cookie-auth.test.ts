import { AuthAPI } from '../api/auth';

import type { RiotAuthCookies } from '../types';

describe('AuthAPI Cookie Authentication', () => {
  let auth: AuthAPI;

  beforeEach(() => {
    auth = new AuthAPI();
  });

  describe('reAuthenticate', () => {
    it('should throw error for invalid cookies', async () => {
      const invalidCookies = 'invalid-cookie-string';

      await expect(auth.reAuthenticate(invalidCookies)).rejects.toThrow();
    });
  });

  describe('handleMultifactor', () => {
    it('should handle multifactor authentication', async () => {
      const mockCookies: RiotAuthCookies = [
        { name: 'ssid', value: 'test-ssid' },
        { name: 'tdid', value: 'test-tdid' },
        { name: 'sub', value: 'test-sub' },
        { name: 'csid', value: 'test-csid' },
        { name: 'clid', value: 'test-clid' },
      ];

      await expect(auth.handleMultifactor(mockCookies, '123456')).rejects.toThrow();
    });
  });

  describe('getUserInfo', () => {
    it('should handle getUserInfo with invalid auth', async () => {
      const mockAuth = {
        accessToken: 'invalid-token',
        idToken: 'invalid-token',
        entitlementsToken: 'invalid-token',
      };

      await expect(auth.getUserInfo(mockAuth)).rejects.toThrow();
    });
  });
});
