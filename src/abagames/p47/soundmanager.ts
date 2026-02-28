export class SoundManager {
  public static readonly SHOT = 0;
  public static readonly ROLL_CHARGE = 1;
  public static readonly ROLL_RELEASE = 2;
  public static readonly SHIP_DESTROYED = 3;
  public static readonly GET_BONUS = 4;
  public static readonly EXTEND = 5;
  public static readonly ENEMY_DESTROYED = 6;
  public static readonly LARGE_ENEMY_DESTROYED = 7;
  public static readonly BOSS_DESTROYED = 8;
  public static readonly LOCK = 9;
  public static readonly LASER = 10;

  public static init(_gameManager?: unknown): void {}
  public static close(): void {}
  public static playSe(_se: number): void {}
}
