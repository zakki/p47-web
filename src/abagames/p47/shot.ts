import { Actor } from "../util/actor";
import { Vector } from "../util/vector";
import { Field } from "./field";
import { P47Screen } from "./screen";

/**
 * Player's shots.
 */
export class Shot extends Actor {
  public static readonly SPEED = 1;

  private static readonly FIELD_SPACE = 1;
  private static readonly RETRO_CNT = 4;

  public pos = new Vector();

  private field!: Field;
  private vel = new Vector();
  private deg = 0;
  private cnt = 0;

  public override init(args: unknown[] | null): void {
    const raw = Array.isArray(args) ? args[0] : args;
    if (!(raw instanceof ShotInitializer)) {
      throw new Error("Shot.init requires ShotInitializer");
    }
    this.field = raw.field;
    this.pos = new Vector();
    this.vel = new Vector();
  }

  public set(p: Vector, d: number): void {
    this.pos.x = p.x;
    this.pos.y = p.y;
    this.deg = d;
    this.vel.x = Math.sin(this.deg) * Shot.SPEED;
    this.vel.y = Math.cos(this.deg) * Shot.SPEED;
    this.cnt = 0;
    this.exists = true;
  }

  public override move(): void {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    if (this.field.checkHit(this.pos, Shot.FIELD_SPACE)) {
      this.exists = false;
    }
    this.cnt++;
  }

  public override draw(): void {
    let r: number;
    if (this.cnt > Shot.RETRO_CNT) {
      r = 1;
    } else {
      r = this.cnt / Shot.RETRO_CNT;
    }
    P47Screen.setRetroParam(r, 0.2);
    P47Screen.drawBoxRetro(this.pos.x, this.pos.y, 0.2, 1, this.deg);
  }
}

export class ShotInitializer {
  public constructor(public readonly field: Field) {}
}
