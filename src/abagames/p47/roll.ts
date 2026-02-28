import { Actor } from "../util/actor";
import { Vector } from "../util/vector";
import { Field } from "./field";
import type { P47GameManager } from "./gamemanager";
import { P47Screen } from "./screen";
import { Ship } from "./ship";

type ManagerLike = P47GameManager & {
  addParticle?: (p: Vector, d: number, z: number, speed: number) => void;
};

/**
 * Roll shot.
 */
export class Roll extends Actor {
  public static readonly LENGTH = 4;
  public static readonly NO_COLLISION_CNT = 45;

  private static readonly BASE_LENGTH = 1.0;
  private static readonly BASE_RESISTANCE = 0.8;
  private static readonly BASE_SPRING = 0.2;
  private static readonly BASE_SIZE = 0.2;
  private static readonly BASE_DIST = 3;
  private static readonly SPEED = 0.75;

  public released = false;
  public pos: Vector[] = Array.from({ length: Roll.LENGTH }, () => new Vector());
  public cnt = 0;

  private vel: Vector[] = Array.from({ length: Roll.LENGTH }, () => new Vector());
  private ship!: Ship;
  private field!: Field;
  private manager!: ManagerLike;
  private dist = 0;

  public override init(args: unknown[] | null): void {
    const raw = Array.isArray(args) ? args[0] : args;
    if (!(raw instanceof RollInitializer)) {
      throw new Error("Roll.init requires RollInitializer");
    }
    this.ship = raw.ship;
    this.field = raw.field;
    this.manager = raw.manager as ManagerLike;
    this.pos = Array.from({ length: Roll.LENGTH }, () => new Vector());
    this.vel = Array.from({ length: Roll.LENGTH }, () => new Vector());
  }

  public set(): void {
    for (let i = 0; i < Roll.LENGTH; i++) {
      this.pos[i].x = this.ship.pos.x;
      this.pos[i].y = this.ship.pos.y;
      this.vel[i].x = 0;
      this.vel[i].y = 0;
    }
    this.cnt = 0;
    this.dist = 0;
    this.released = false;
    this.exists = true;
  }

  public override move(): void {
    if (this.released) {
      this.pos[0].y += Roll.SPEED;
      if (this.pos[0].y > this.field.size.y) {
        this.exists = false;
        return;
      }
      this.manager.addParticle?.(this.pos[0], Math.PI, Roll.BASE_SIZE * Roll.LENGTH, Roll.SPEED / 8);
    } else {
      if (this.dist < Roll.BASE_DIST) {
        this.dist += Roll.BASE_DIST / 90;
      }
      this.pos[0].x = this.ship.pos.x + Math.sin(this.cnt * 0.1) * this.dist;
      this.pos[0].y = this.ship.pos.y + Math.cos(this.cnt * 0.1) * this.dist;
    }

    for (let i = 1; i < Roll.LENGTH; i++) {
      this.pos[i].x += this.vel[i].x;
      this.pos[i].y += this.vel[i].y;
      this.vel[i].x *= Roll.BASE_RESISTANCE;
      this.vel[i].y *= Roll.BASE_RESISTANCE;
      const dist = this.pos[i].dist(this.pos[i - 1]);
      if (dist <= Roll.BASE_LENGTH) {
        continue;
      }
      const v = (dist - Roll.BASE_LENGTH) * Roll.BASE_SPRING;
      const deg = Math.atan2(this.pos[i - 1].x - this.pos[i].x, this.pos[i - 1].y - this.pos[i].y);
      this.vel[i].x += Math.sin(deg) * v;
      this.vel[i].y += Math.cos(deg) * v;
    }
    this.cnt++;
  }

  public override draw(): void {
    if (this.released) {
      P47Screen.setRetroParam(1, 0.2);
    } else {
      P47Screen.setRetroParam(0.5, 0.2);
    }
    for (let i = 0; i < Roll.LENGTH; i++) {
      P47Screen.drawBoxRetro(
        this.pos[i].x,
        this.pos[i].y,
        Roll.BASE_SIZE * (Roll.LENGTH - i),
        Roll.BASE_SIZE * (Roll.LENGTH - i),
        this.cnt * 0.1,
      );
    }
  }
}

export class RollInitializer {
  public constructor(
    public readonly ship: Ship,
    public readonly field: Field,
    public readonly manager: P47GameManager,
  ) {}
}
