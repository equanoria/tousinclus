export interface GameInfo {
    code: string;
    status: string;
    isTeam1Connected: boolean | null;
    isTeam2Connected: boolean | null;
  }
  
  export class GameAPIService {
    static getGameInfo(gameCode: string) {
      throw new Error('Method not implemented.');
    }
    private static instance: GameAPIService;
    private static baseUrl: string = 'http://127.0.0.1:3001/api/game';
  
    private constructor() {}
  
    public static getInstance(): GameAPIService {
      if (!GameAPIService.instance) {
        GameAPIService.instance = new GameAPIService();
      }
      return GameAPIService.instance;
    }
  
    public static async createGames(numberGames: number): Promise<GameInfo[]> {
      if (numberGames < 1) {
        throw new Error("At least one game must be created.");
      }
  
      try {
        const response = await fetch(`${this.baseUrl}/${numberGames}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'New Game' }),
        });
  
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error while creating games:', error);
        return [];
      }
    }
  
    public static async getGameInfos(gameCode: string): Promise<GameInfo | null> {
      if (!gameCode.trim()) {
        console.error("Please enter a valid game code.");
        return null;
      }
  
      try {
        const response = await fetch(`${this.baseUrl}/${gameCode}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
  
        return await response.json();
      } catch (error) {
        console.error('Error trying to get infos game:', error);
        return null;
      }
    }
  }