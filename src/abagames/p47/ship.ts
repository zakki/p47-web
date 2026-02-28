import { Vector } from "../util/vector";

export class Ship {
  public static isSlow = false;
  public static readonly INVINCIBLE_CNT = 228;
  public pos = new Vector();
  public cnt = 0;

  public static createDisplayLists(): void {}
  public static deleteDisplayLists(): void {}

  public init(..._args: unknown[]): void {}
  public start(): void {}
  public close(): void {}
  public setSpeedRate(_rate: number): void {}
}
