export class Barrage {
  public constructor(public readonly name = "") {}
}

export class BatteryType {
  public constructor(public readonly name = "") {}
}

export class EnemyType {
  public static init(_barrageManager: unknown): void {}
}
