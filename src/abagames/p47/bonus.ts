import { Actor } from "../util/actor";
import { Vector } from "../util/vector";
import { Rand } from "../util/rand";
import { Screen3D } from "../util/sdl/screen3d";
import { Field } from "./field";
import { Ship } from "./ship";
import { P47GameManager } from "./gamemanager";
import { P47Screen } from "./screen";
import { SoundManager } from "./soundmanager";

/**
 * Bonus items.
 */
export class Bonus extends Actor {
  public static rate = 1;
  public static bonusScore = 10;

  private static readonly BASE_SPEED = 0.1;
  private static speed = Bonus.BASE_SPEED;
  private static readonly INHALE_WIDTH = 3;
  private static readonly ACQUIRE_WIDTH = 1;
  private static readonly RETRO_CNT = 20;
  private static readonly BOX_SIZE = 0.4;
  private static rand = new Rand();

  private fieldLimitX = 0;
  private fieldLimitY = 0;
  private field!: Field;
  private ship!: Ship;
  private manager!: P47GameManager;
  private pos = new Vector();
  private vel = new Vector();
  private cnt = 0;
  private isDown = true;
  private isInhaled = false;
  private inhaleCnt = 0;

  public static init(): void {
    Bonus.rand = new Rand();
  }

  public static resetBonusScore(): void {
    Bonus.bonusScore = 10;
  }

  public static setSpeedRate(rate: number): void {
    Bonus.rate = rate;
    Bonus.speed = Bonus.BASE_SPEED * Bonus.rate;
  }

  public override init(args: unknown[] | null): void {
    const raw = Array.isArray(args) ? args[0] : args;
    if (!(raw instanceof BonusInitializer)) {
      throw new Error("Bonus.init requires BonusInitializer");
    }
    this.field = raw.field;
    this.ship = raw.ship;
    this.manager = raw.manager;
    this.pos = new Vector();
    this.vel = new Vector();
    this.fieldLimitX = (this.field.size.x / 6) * 5;
    this.fieldLimitY = (this.field.size.y / 10) * 9;
  }

  public set(p: Vector, ofs: Vector | null = null): void {
    this.pos.x = p.x;
    this.pos.y = p.y;
    if (ofs !== null) {
      this.pos.x += ofs.x;
      this.pos.y += ofs.y;
    }
    this.vel.x = Bonus.rand.nextSignedFloat(0.07);
    this.vel.y = Bonus.rand.nextSignedFloat(0.07);
    this.cnt = 0;
    this.inhaleCnt = 0;
    this.isDown = true;
    this.isInhaled = false;
    this.exists = true;
  }

  private missBonus(): void {
    Bonus.resetBonusScore();
  }

  private getBonus(): void {
    SoundManager.playSe(SoundManager.GET_BONUS);
    this.manager.addScore(Bonus.bonusScore);
    if (Bonus.bonusScore < 1000) {
      Bonus.bonusScore += 10;
    }
  }

  public override move(): void {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.vel.x -= this.vel.x / 50;
    if (this.pos.x > this.fieldLimitX) {
      this.pos.x = this.fieldLimitX;
      if (this.vel.x > 0) {
        this.vel.x = -this.vel.x;
      }
    } else if (this.pos.x < -this.fieldLimitX) {
      this.pos.x = -this.fieldLimitX;
      if (this.vel.x < 0) {
        this.vel.x = -this.vel.x;
      }
    }
    if (this.isDown) {
      this.vel.y += (-Bonus.speed - this.vel.y) / 50;
      if (this.pos.y < -this.fieldLimitY) {
        this.isDown = false;
        this.pos.y = -this.fieldLimitY;
        this.vel.y = Bonus.speed;
      }
    } else {
      this.vel.y += (Bonus.speed - this.vel.y) / 50;
      if (this.pos.y > this.fieldLimitY) {
        this.missBonus();
        this.exists = false;
        return;
      }
    }
    this.cnt++;
    if (this.cnt < Bonus.RETRO_CNT) {
      return;
    }
    const d = this.pos.dist(this.ship.pos);
    if (
      d < Bonus.ACQUIRE_WIDTH * (1 + this.inhaleCnt * 0.2) &&
      this.ship.cnt >= -Ship.INVINCIBLE_CNT
    ) {
      this.getBonus();
      this.exists = false;
      return;
    }
    if (this.isInhaled) {
      this.inhaleCnt++;
      let ip = (Bonus.INHALE_WIDTH - d) / 48;
      if (ip < 0.025) {
        ip = 0.025;
      }
      this.vel.x += (this.ship.pos.x - this.pos.x) * ip;
      this.vel.y += (this.ship.pos.y - this.pos.y) * ip;
      if (this.ship.cnt < -Ship.INVINCIBLE_CNT) {
        this.isInhaled = false;
        this.inhaleCnt = 0;
      }
    } else if (d < Bonus.INHALE_WIDTH && this.ship.cnt >= -Ship.INVINCIBLE_CNT) {
      this.isInhaled = true;
    }
  }

  public override draw(): void {
    const retro = this.cnt < Bonus.RETRO_CNT ? 1 - this.cnt / Bonus.RETRO_CNT : 0;
    const d = this.cnt * 0.1;
    const ox = Math.sin(d) * 0.3;
    const oy = Math.cos(d) * 0.3;
    if (retro > 0) {
      P47Screen.setRetroParam(retro, 0.2);
      P47Screen.drawBoxRetro(this.pos.x - ox, this.pos.y - oy, Bonus.BOX_SIZE / 2, Bonus.BOX_SIZE / 2, 0);
      P47Screen.drawBoxRetro(this.pos.x + ox, this.pos.y + oy, Bonus.BOX_SIZE / 2, Bonus.BOX_SIZE / 2, 0);
      P47Screen.drawBoxRetro(this.pos.x - oy, this.pos.y + ox, Bonus.BOX_SIZE / 2, Bonus.BOX_SIZE / 2, 0);
      P47Screen.drawBoxRetro(this.pos.x + oy, this.pos.y - ox, Bonus.BOX_SIZE / 2, Bonus.BOX_SIZE / 2, 0);
    } else {
      if (this.isInhaled) {
        Screen3D.setColor(0.8, 0.6, 0.4, 0.7);
      } else if (this.isDown) {
        Screen3D.setColor(0.4, 0.9, 0.6, 0.7);
      } else {
        Screen3D.setColor(0.8, 0.9, 0.5, 0.7);
      }
      P47Screen.drawBoxLine(
        this.pos.x - ox - Bonus.BOX_SIZE / 2,
        this.pos.y - oy - Bonus.BOX_SIZE / 2,
        Bonus.BOX_SIZE,
        Bonus.BOX_SIZE,
      );
      P47Screen.drawBoxLine(
        this.pos.x + ox - Bonus.BOX_SIZE / 2,
        this.pos.y + oy - Bonus.BOX_SIZE / 2,
        Bonus.BOX_SIZE,
        Bonus.BOX_SIZE,
      );
      P47Screen.drawBoxLine(
        this.pos.x - oy - Bonus.BOX_SIZE / 2,
        this.pos.y + ox - Bonus.BOX_SIZE / 2,
        Bonus.BOX_SIZE,
        Bonus.BOX_SIZE,
      );
      P47Screen.drawBoxLine(
        this.pos.x + oy - Bonus.BOX_SIZE / 2,
        this.pos.y - ox - Bonus.BOX_SIZE / 2,
        Bonus.BOX_SIZE,
        Bonus.BOX_SIZE,
      );
    }
  }
}

export class BonusInitializer {
  public constructor(
    public readonly field: Field,
    public readonly ship: Ship,
    public readonly manager: P47GameManager,
  ) {}
}
