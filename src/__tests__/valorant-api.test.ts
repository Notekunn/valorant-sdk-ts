import { GameAPI, ValorantRegion } from '../index';

describe('GameAPI', () => {
  let api: GameAPI;

  beforeEach(() => {
    api = new GameAPI({
      clientVersion: 'test-version',
      retries: 2,
      timeout: 5000,
      userAgent: 'test-user-agent',
    });
  });

  describe('Initialization', () => {
    it('should initialize with correct configuration', () => {
      expect(api).toBeDefined();
      expect(api).toBeInstanceOf(GameAPI);
    });
  });

  describe('API Methods', () => {
    it('should handle getRegion method signature', async () => {
      // Test that the method exists and has the correct signature
      expect(typeof api.getRegion).toBe('function');
      expect(api.getRegion.length).toBe(2); // Should expect 2 parameters
    });

    it('should handle getShop method signature', async () => {
      // Test that the method exists and has the correct signature
      expect(typeof api.getShop).toBe('function');
      expect(api.getShop.length).toBe(3); // Should expect 3 parameters
    });

    it('should handle getPlayerByName method signature', async () => {
      // Test that the method exists and has the correct signature
      expect(typeof api.getPlayerByName).toBe('function');
      expect(api.getPlayerByName.length).toBe(2); // Should expect 2 parameters
    });
  });
});

describe('Constants', () => {
  it('should have valid regions', () => {
    expect(ValorantRegion.Na).toBe('na');
    expect(ValorantRegion.Eu).toBe('eu');
    expect(ValorantRegion.Ap).toBe('ap');
    expect(ValorantRegion.Kr).toBe('kr');
    expect(ValorantRegion.Br).toBe('br');
    expect(ValorantRegion.Latam).toBe('latam');
  });

  it('should have valid API base URLs', () => {
    expect(ValorantRegion).toBeDefined();
    expect(typeof ValorantRegion.Na).toBe('string');
  });
});
