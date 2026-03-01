import { Bullet } from "../util/bulletml/bullet";
import { Rand } from "../util/rand";
import { DisplayList } from "../util/sdl/displaylist";
import { Pad } from "../util/sdl/pad";
import { Screen3D } from "../util/sdl/screen3d";
import { Vector } from "../util/vector";
import { Bonus } from "./bonus";
import type { Field } from "./field";
import { P47GameManager } from "./gamemanager";
import { P47Screen } from "./screen";
import { SoundManager } from "./soundmanager";

export class Ship {
  public static isSlow = false;
  public static readonly INVINCIBLE_CNT = 228;
  private static rand = new Rand();
  private static displayList: DisplayList | null = null;

  public static readonly SIZE = 0.3;
  public restart = false;
  public readonly RESTART_CNT = 300;
  public pos = new Vector();
  public cnt = 0;

  private static readonly BASE_SPEED = 0.6;
  private static readonly SLOW_BASE_SPEED = 0.3;
  private static readonly BANK_BASE = 50;
  private static readonly FIRE_WIDE_BASE_DEG = 0.7;
  private static readonly FIRE_NARROW_BASE_DEG = 0.5;
  private static readonly TURRET_INTERVAL_LENGTH = 0.2;
  private static readonly FIELD_SPACE = 1.5;

  private pad!: Pad;
  private field!: Field;
  private manager!: P47GameManager;
  private ppos = new Vector();
  private baseSpeed = Ship.BASE_SPEED;
  private slowSpeed = Ship.SLOW_BASE_SPEED;
  private speed = Ship.BASE_SPEED;
  private vel = new Vector();
  private bank = 0;
  private firePos = new Vector();
  private fireWideDeg = Ship.FIRE_WIDE_BASE_DEG;
  private fireCnt = 0;
  private ttlCnt = 0;
  private fieldLimitX = 0;
  private fieldLimitY = 0;
  private rollLockCnt = 0;
  private rollCharged = false;

  public static createDisplayLists(): void {
    Ship.deleteDisplayLists();
    const list = new DisplayList(3);
    list.beginNewList();
    Screen3D.setColor(0.5, 1, 0.5, 0.2);
    P47Screen.drawBoxSolid(-0.1, -0.5, 0.2, 1);
    Screen3D.setColor(0.5, 1, 0.5, 0.4);
    P47Screen.drawBoxLine(-0.1, -0.5, 0.2, 1);

    list.nextNewList();
    Screen3D.setColor(1, 0.2, 0.2, 1);
    P47Screen.drawBoxSolid(-0.2, -0.2, 0.4, 0.4);
    Screen3D.setColor(1, 0.5, 0.5, 1);
    P47Screen.drawBoxLine(-0.2, -0.2, 0.4, 0.4);

    list.nextNewList();
    Screen3D.setColor(0.7, 1, 0.5, 0.3);
    P47Screen.drawBoxSolid(-0.15, -0.3, 0.3, 0.6);
    Screen3D.setColor(0.7, 1, 0.5, 0.6);
    P47Screen.drawBoxLine(-0.15, -0.3, 0.3, 0.6);

    list.endNewList();
    Ship.displayList = list;
  }

  public static deleteDisplayLists(): void {
    Ship.displayList?.close();
    Ship.displayList = null;
  }

  public init(pad: Pad, field: Field, manager: P47GameManager): void {
    this.pad = pad;
    this.field = field;
    this.manager = manager;
    this.pos = new Vector();
    this.ppos = new Vector();
    this.vel = new Vector();
    this.firePos = new Vector();
    this.ttlCnt = 0;
    this.fieldLimitX = field.size.x - Ship.FIELD_SPACE;
    this.fieldLimitY = field.size.y - Ship.FIELD_SPACE;
  }

  public start(): void {
    this.ppos.x = this.pos.x = 0;
    this.ppos.y = this.pos.y = -this.field.size.y / 2;
    this.vel.x = 0;
    this.vel.y = 0;
    this.speed = Ship.BASE_SPEED;
    this.fireWideDeg = Ship.FIRE_WIDE_BASE_DEG;
    this.restart = true;
    this.cnt = -Ship.INVINCIBLE_CNT;
    this.fireCnt = 0;
    this.rollLockCnt = 0;
    this.bank = 0;
    this.rollCharged = false;
    Bonus.resetBonusScore();
  }

  public close(): void {}

  public setSpeedRate(rate: number): void {
    if (!Ship.isSlow) {
      this.baseSpeed = Ship.BASE_SPEED * rate;
    } else {
      this.baseSpeed = Ship.BASE_SPEED * 0.7;
    }
    this.slowSpeed = Ship.SLOW_BASE_SPEED * rate;
  }

  public destroyed(): void {
    if (this.cnt <= 0) {
      return;
    }
    SoundManager.playSe(SoundManager.SHIP_DESTROYED);
    this.manager.shipDestroyed();
    this.manager.addFragments(30, this.pos.x, this.pos.y, this.pos.x, this.pos.y, 0, 0.08, Math.PI);
    for (let i = 0; i < 45; i++) {
      this.manager.addParticle(this.pos, Ship.rand.nextFloat(Math.PI * 2), 0, 0.6);
    }
    this.start();
    this.cnt = -this.RESTART_CNT;
  }

  public move(): void {
    this.cnt++;
    if (this.cnt < -Ship.INVINCIBLE_CNT) {
      return;
    }
    if (this.cnt === 0) {
      this.restart = false;
    }
    const btn = this.pad.getButtonState();
    if (btn & Pad.Button.B) {
      this.speed += (this.slowSpeed - this.speed) * 0.2;
      this.fireWideDeg += (Ship.FIRE_NARROW_BASE_DEG - this.fireWideDeg) * 0.1;
      this.rollLockCnt++;
      if (this.manager.mode === P47GameManager.ROLL) {
        if (this.rollLockCnt % 15 === 0) {
          this.manager.addRoll();
          SoundManager.playSe(SoundManager.ROLL_CHARGE);
          this.rollCharged = true;
        }
      } else if (this.rollLockCnt % 10 === 0) {
        this.manager.addLock();
      }
    } else {
      this.speed += (this.baseSpeed - this.speed) * 0.2;
      this.fireWideDeg += (Ship.FIRE_WIDE_BASE_DEG - this.fireWideDeg) * 0.1;
      if (this.manager.mode === P47GameManager.ROLL) {
        if (this.rollCharged) {
          this.rollLockCnt = 0;
          this.manager.releaseRoll();
          SoundManager.playSe(SoundManager.ROLL_RELEASE);
          this.rollCharged = false;
        }
      } else {
        this.rollLockCnt = 0;
        this.manager.releaseLock();
      }
    }

    const ps = this.pad.getDirState();
    this.vel.x = 0;
    this.vel.y = 0;
    if (ps & Pad.Dir.UP) {
      this.vel.y = this.speed;
    } else if (ps & Pad.Dir.DOWN) {
      this.vel.y = -this.speed;
    }
    if (ps & Pad.Dir.RIGHT) {
      this.vel.x = this.speed;
    } else if (ps & Pad.Dir.LEFT) {
      this.vel.x = -this.speed;
    }
    if (this.vel.x !== 0 && this.vel.y !== 0) {
      this.vel.x *= 0.707;
      this.vel.y *= 0.707;
    }

    this.ppos.x = this.pos.x;
    this.ppos.y = this.pos.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.bank += (this.vel.x * Ship.BANK_BASE - this.bank) * 0.1;

    if (this.pos.x < -this.fieldLimitX) {
      this.pos.x = -this.fieldLimitX;
    } else if (this.pos.x > this.fieldLimitX) {
      this.pos.x = this.fieldLimitX;
    }
    if (this.pos.y < -this.fieldLimitY) {
      this.pos.y = -this.fieldLimitY;
    } else if (this.pos.y > this.fieldLimitY) {
      this.pos.y = this.fieldLimitY;
    }

    if (btn & Pad.Button.A) {
      let td = 0;
      switch (this.fireCnt % 4) {
        case 0:
          this.firePos.x = this.pos.x + Ship.TURRET_INTERVAL_LENGTH;
          this.firePos.y = this.pos.y;
          td = 0;
          break;
        case 1:
          this.firePos.x = this.pos.x + Ship.TURRET_INTERVAL_LENGTH;
          this.firePos.y = this.pos.y;
          td = this.fireWideDeg * (((this.fireCnt / 4) | 0) % 5) * 0.2;
          break;
        case 2:
          this.firePos.x = this.pos.x - Ship.TURRET_INTERVAL_LENGTH;
          this.firePos.y = this.pos.y;
          td = 0;
          break;
        case 3:
          this.firePos.x = this.pos.x - Ship.TURRET_INTERVAL_LENGTH;
          this.firePos.y = this.pos.y;
          td = -this.fireWideDeg * (((this.fireCnt / 4) | 0) % 5) * 0.2;
          break;
        default:
          break;
      }
      this.manager.addShot(this.firePos, td);
      if (this.fireCnt % 5 == 0) {
        SoundManager.playSe(SoundManager.SHOT);
      }
      this.fireCnt++;
    }

    if (Bullet.target) {
      Bullet.target.x = this.pos.x;
      Bullet.target.y = this.pos.y;
    }
    this.ttlCnt++;
  }

  public draw(): void {
    if (this.cnt < -Ship.INVINCIBLE_CNT || (this.cnt < 0 && ((-this.cnt) % 32) < 16)) {
      return;
    }

    Screen3D.glPushMatrix();
    Screen3D.glTranslatef(this.pos.x, this.pos.y, 0);
    Ship.displayList?.call(1);
    Screen3D.glRotatef(this.bank, 0, 1, 0);
    Screen3D.glTranslatef(-0.5, 0, 0);
    Ship.displayList?.call(0);
    Screen3D.glTranslatef(0.2, 0.3, 0.2);
    Ship.displayList?.call(0);
    Screen3D.glTranslatef(0, 0, -0.4);
    Ship.displayList?.call(0);
    Screen3D.glPopMatrix();

    Screen3D.glPushMatrix();
    Screen3D.glTranslatef(this.pos.x, this.pos.y, 0);
    Screen3D.glRotatef(this.bank, 0, 1, 0);
    Screen3D.glTranslatef(0.5, 0, 0);
    Ship.displayList?.call(0);
    Screen3D.glTranslatef(-0.2, 0.3, 0.2);
    Ship.displayList?.call(0);
    Screen3D.glTranslatef(0, 0, -0.4);
    Ship.displayList?.call(0);
    Screen3D.glPopMatrix();

    for (let i = 0; i < 6; i++) {
      Screen3D.glPushMatrix();
      Screen3D.glTranslatef(this.pos.x - 0.7, this.pos.y - 0.3, 0);
      Screen3D.glRotatef(this.bank, 0, 1, 0);
      Screen3D.glRotatef(180 / 2 - this.fireWideDeg * 100, 0, 0, 1);
      Screen3D.glRotatef((i * 180) / 3 - this.ttlCnt * 4, 1, 0, 0);
      Screen3D.glTranslatef(0, 0, 0.7);
      Ship.displayList?.call(2);
      Screen3D.glPopMatrix();

      Screen3D.glPushMatrix();
      Screen3D.glTranslatef(this.pos.x + 0.7, this.pos.y - 0.3, 0);
      Screen3D.glRotatef(this.bank, 0, 1, 0);
      Screen3D.glRotatef(-180 / 2 + this.fireWideDeg * 100, 0, 0, 1);
      Screen3D.glRotatef((i * 180) / 3 - this.ttlCnt * 4, 1, 0, 0);
      Screen3D.glTranslatef(0, 0, 0.7);
      Ship.displayList?.call(2);
      Screen3D.glPopMatrix();
    }
  }
}
