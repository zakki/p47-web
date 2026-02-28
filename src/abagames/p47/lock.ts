import { Actor } from "../util/actor";
import { Rand } from "../util/rand";
import { Vector } from "../util/vector";
import type { Enemy } from "./enemy";
import { Field } from "./field";
import type { P47GameManager } from "./gamemanager";
import { P47Screen } from "./screen";
import { Ship } from "./ship";
import { SoundManager } from "./soundmanager";

type ManagerLike = P47GameManager & {
  addParticle?: (p: Vector, d: number, z: number, speed: number) => void;
};

/**
 * Lock laser.
 */
export class Lock extends Actor {
  public static readonly SEARCH = 0;
  public static readonly SEARCHED = 1;
  public static readonly LOCKING = 2;
  public static readonly LOCKED = 3;
  public static readonly FIRED = 4;
  public static readonly HIT = 5;
  public static readonly CANCELED = 6;

  public static readonly LENGTH = 12;
  public static readonly NO_COLLISION_CNT = 8;
  private static readonly SPEED = 0.01;
  private static readonly LOCK_CNT = 8;
  private static rand = new Rand();

  public state = Lock.SEARCH;
  public pos: Vector[] = Array.from({ length: Lock.LENGTH }, () => new Vector());
  public cnt = 0;
  public lockMinY = 0;
  public lockedEnemy!: Enemy;
  public lockedPart = -1;
  public lockedPos = new Vector();
  public released = false;

  private vel = new Vector();
  private ship!: Ship;
  private field!: Field;
  private manager!: ManagerLike;

  public static init(): void {
    Lock.rand = new Rand();
  }

  public override init(args: unknown[] | null): void {
    const raw = Array.isArray(args) ? args[0] : args;
    if (!(raw instanceof LockInitializer)) {
      throw new Error("Lock.init requires LockInitializer");
    }
    this.ship = raw.ship;
    this.field = raw.field;
    this.manager = raw.manager as ManagerLike;
    this.pos = Array.from({ length: Lock.LENGTH }, () => new Vector());
    this.vel = new Vector();
    this.lockedPos = new Vector();
  }

  private reset(): void {
    for (let i = 0; i < Lock.LENGTH; i++) {
      this.pos[i].x = this.ship.pos.x;
      this.pos[i].y = this.ship.pos.y;
    }
    this.vel.x = Lock.rand.nextSignedFloat(1.5);
    this.vel.y = -2;
    this.cnt = 0;
  }

  public set(): void {
    this.reset();
    this.state = Lock.SEARCH;
    this.lockMinY = this.field.size.y * 2;
    this.released = false;
    this.exists = true;
  }

  public hit(): void {
    this.state = Lock.HIT;
    this.cnt = 0;
  }

  public override move(): void {
    if (this.state === Lock.SEARCH) {
      this.exists = false;
      return;
    } else if (this.state === Lock.SEARCHED) {
      this.state = Lock.LOCKING;
      SoundManager.playSe(SoundManager.LOCK);
    }

    if (this.state !== Lock.HIT && this.state !== Lock.CANCELED) {
      if (this.lockedPart < 0) {
        this.lockedPos.x = this.lockedEnemy.pos.x;
        this.lockedPos.y = this.lockedEnemy.pos.y;
      } else {
        this.lockedPos.x = this.lockedEnemy.pos.x + this.lockedEnemy.type.batteryType[this.lockedPart].collisionPos.x;
        this.lockedPos.y = this.lockedEnemy.pos.y + this.lockedEnemy.type.batteryType[this.lockedPart].collisionPos.y;
      }
    }

    switch (this.state) {
      case Lock.LOCKING:
        if (this.cnt >= Lock.LOCK_CNT) {
          this.state = Lock.LOCKED;
          SoundManager.playSe(SoundManager.LASER);
          this.cnt = 0;
        }
        break;
      case Lock.LOCKED:
        if (this.cnt >= Lock.NO_COLLISION_CNT) {
          this.state = Lock.FIRED;
        }
      case Lock.FIRED:
      case Lock.CANCELED:
        if (this.state !== Lock.CANCELED) {
          if (
            !this.lockedEnemy.exists ||
            this.lockedEnemy.shield <= 0 ||
            (this.lockedPart >= 0 && this.lockedEnemy.battery[this.lockedPart].shield <= 0)
          ) {
            this.state = Lock.CANCELED;
          } else {
            this.vel.x += (this.lockedPos.x - this.pos[0].x) * Lock.SPEED;
            this.vel.y += (this.lockedPos.y - this.pos[0].y) * Lock.SPEED;
          }
          this.vel.x *= 0.9;
          this.vel.y *= 0.9;
          this.pos[0].x += (this.lockedPos.x - this.pos[0].x) * 0.002 * this.cnt;
          this.pos[0].y += (this.lockedPos.y - this.pos[0].y) * 0.002 * this.cnt;
        } else {
          this.vel.y += (this.field.size.y * 2 - this.pos[0].y) * Lock.SPEED;
        }
        for (let i = Lock.LENGTH - 1; i > 0; i--) {
          this.pos[i].x = this.pos[i - 1].x;
          this.pos[i].y = this.pos[i - 1].y;
        }
        this.pos[0].x += this.vel.x;
        this.pos[0].y += this.vel.y;
        if (this.pos[0].y > this.field.size.y + 5) {
          if (this.state === Lock.CANCELED) {
            this.exists = false;
            return;
          }
          this.state = Lock.LOCKED;
          SoundManager.playSe(SoundManager.LASER);
          this.reset();
        }
        {
          const d = Math.atan2(this.pos[1].x - this.pos[0].x, this.pos[1].y - this.pos[0].y);
          this.manager.addParticle?.(this.pos[0], d, 0, Lock.SPEED * 32);
        }
        break;
      case Lock.HIT:
        for (let i = 1; i < Lock.LENGTH; i++) {
          this.pos[i].x = this.pos[i - 1].x;
          this.pos[i].y = this.pos[i - 1].y;
        }
        if (this.cnt > 5) {
          if (!this.released) {
            this.state = Lock.LOCKED;
            SoundManager.playSe(SoundManager.LASER);
            this.reset();
          } else {
            this.exists = false;
            return;
          }
        }
        break;
      default:
        break;
    }
    this.cnt++;
  }

  public override draw(): void {
    switch (this.state) {
      case Lock.LOCKING: {
        const y = this.lockedPos.y - (Lock.LOCK_CNT - this.cnt) * 0.5;
        let d = (Lock.LOCK_CNT - this.cnt) * 0.1;
        const r = (Lock.LOCK_CNT - this.cnt) * 0.5 + 0.8;
        P47Screen.setRetroParam((Lock.LOCK_CNT - this.cnt) / Lock.LOCK_CNT, 0.2);
        for (let i = 0; i < 3; i++, d += (Math.PI * 2) / 3) {
          P47Screen.drawBoxRetro(this.lockedPos.x + Math.sin(d) * r, y + Math.cos(d) * r, 0.2, 1, d + Math.PI / 2);
        }
        break;
      }
      case Lock.LOCKED:
      case Lock.FIRED:
      case Lock.CANCELED:
      case Lock.HIT: {
        let d = 0;
        let r = 0.8;
        P47Screen.setRetroParam(0, 0.2);
        for (let i = 0; i < 3; i++, d += (Math.PI * 2) / 3) {
          P47Screen.drawBoxRetro(
            this.lockedPos.x + Math.sin(d) * r,
            this.lockedPos.y + Math.cos(d) * r,
            0.2,
            1,
            d + Math.PI / 2,
          );
        }
        r = this.cnt * 0.1;
        for (let i = 0; i < Lock.LENGTH - 1; i++, r -= 0.1) {
          let rr = r;
          if (rr < 0) {
            rr = 0;
          } else if (rr > 1) {
            rr = 1;
          }
          P47Screen.setRetroParam(rr, 0.33);
          P47Screen.drawLineRetro(this.pos[i].x, this.pos[i].y, this.pos[i + 1].x, this.pos[i + 1].y);
        }
        break;
      }
      default:
        break;
    }
  }
}

export class LockInitializer {
  public ship: Ship;
  public field: Field;
  public manager: P47GameManager;

  public constructor(ship: Ship, field: Field, manager: P47GameManager) {
    this.ship = ship;
    this.field = field;
    this.manager = manager;
  }
}
