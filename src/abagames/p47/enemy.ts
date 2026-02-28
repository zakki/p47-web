import { Actor, type ActorPool } from "../util/actor";
import { Rand } from "../util/rand";
import { Vector } from "../util/vector";
import type { BulletMLRunner } from "../util/bulletml/bullet";
import type { BulletMLParserAsset } from "../util/bulletml/runtime";
import { Screen3D } from "../util/sdl/screen3d";
import { Bonus } from "./bonus";
import type { BulletActor } from "./bulletactor";
import { BulletActorPool } from "./bulletactorpool";
import { EnemyType } from "./enemytype";
import { Field } from "./field";
import { Lock } from "./lock";
import type { P47GameManager } from "./gamemanager";
import { P47Screen } from "./screen";
import { Roll } from "./roll";
import { Ship } from "./ship";
import { Shot } from "./shot";
import { SoundManager } from "./soundmanager";

type BarrageLike = {
  parser: BulletMLParserAsset;
  morphParser: BulletMLParserAsset[];
  morphNum: number;
  morphCnt: number;
  rank: number;
  speedRank: number;
  shape: number;
  color: number;
  bulletSize: number;
  xReverse: number;
};

type BatteryTypeLike = {
  shield: number;
  batteryNum: number;
  r: number;
  g: number;
  b: number;
  xReverseAlternate: boolean;
  barrage: BarrageLike[];
  collisionPos: Vector;
  collisionSize: Vector;
  batteryPos: Vector[];
  wingShapePos: Vector[];
};

type EnemyTypeLike = {
  id: number;
  type: number;
  shield: number;
  batteryNum: number;
  fireInterval: number;
  firePeriod: number;
  barragePatternNum: number;
  wingCollision: boolean;
  r: number;
  g: number;
  b: number;
  retroSize: number;
  collisionSize: Vector;
  bodyShapePos: Vector[];
  barrage: BarrageLike[];
  batteryType: BatteryTypeLike[];
};

type BulletWithPos = {
  pos: Vector;
  deg: number;
};

type BulletActorLike = BulletActor & {
  bullet: BulletWithPos;
  remove: () => void;
};

type FieldLike = Field & {
  checkHit?: (p: Vector, s?: number) => boolean;
  size: Vector;
};

type ManagerLike = P47GameManager & {
  mode?: number;
  addBonus?: (basePos: Vector, ofs: Vector | null, n: number) => void;
  addFragments?: (
    n: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    z: number,
    speed: number,
    deg: number,
  ) => void;
  addScore?: (score: number) => void;
  setScreenShake?: (cnt: number, amp: number) => void;
  clearBullets?: () => void;
  setBossShieldMeter?: (
    shield: number,
    b0: number,
    b1: number,
    b2: number,
    b3: number,
    meterRate: number,
  ) => void;
  addParticle?: (p: Vector, d: number, z: number, speed: number) => void;
};

type ShotLike = Actor & {
  pos: Vector;
};

type RollLike = Actor & {
  pos: Vector[];
  released: boolean;
  cnt: number;
};

type LockLike = Actor & {
  pos: Vector[];
  lockMinY: number;
  state: number;
  lockedEnemy: Enemy | null;
  lockedPart: number;
  hit: () => void;
};

class BatteryData {
  public topBullet: Array<BulletActorLike | null>;
  public shield = 0;
  public damaged = false;

  public constructor(wingBatteryMax: number) {
    this.topBullet = Array.from({ length: wingBatteryMax }, () => null);
  }
}

/**
 * Enemies.
 */
export class Enemy extends Actor {
  public static readonly FIELD_SPACE = 0.5;
  private static readonly MOVE_POINT_MAX = 8;
  private static readonly APPEARANCE_CNT = 90;
  private static readonly APPEARANCE_Z = -15;
  private static readonly DESTROYED_CNT = 90;
  private static readonly DESTROYED_Z = -10;
  private static readonly TIMEOUT_CNT = 90;
  private static readonly BOSS_TIMEOUT = 30 * 60;
  private static readonly SHOT_DAMAGE = 1;
  private static readonly ROLL_DAMAGE = 1;
  private static readonly LOCK_DAMAGE = 7;
  private static readonly ENEMY_TYPE_SCORE = [100, 500, 1000, 5000, 10000] as const;
  private static readonly ENEMY_WING_SCORE = 1000;
  private static readonly BOSS_MOVE_DEG = 0.02;
  private static readonly NOHIT = -2;
  private static readonly HIT = -1;
  private static readonly rand = new Rand();

  public pos = new Vector();
  public type!: EnemyTypeLike;
  public battery: BatteryData[] = [];
  public shield = 0;

  private field!: FieldLike;
  private bullets!: BulletActorPool;
  private shots!: ActorPool<Actor>;
  private rolls!: ActorPool<Actor>;
  private locks!: ActorPool<Actor>;
  private ship!: Ship;
  private manager!: ManagerLike;
  private cnt = 0;
  private topBullet: BulletActorLike | null = null;
  private moveBullet: BulletActorLike | null = null;
  private movePoint: Vector[] = [];
  private movePointNum = 0;
  private movePointIdx = 0;
  private speed = 0;
  private deg = 0;
  private onRoute = false;
  private baseDeg = 0;
  private fireCnt = 0;
  private barragePatternIdx = 0;
  private fieldLimitX = 0;
  private fieldLimitY = 0;
  private appCnt = 0;
  private dstCnt = 0;
  private timeoutCnt = 0;
  private z = 0;
  private isBoss = false;
  private vel = new Vector();
  private velCnt = 0;
  private damaged = false;
  private bossTimer = 0;

  public constructor() {
    super();
    const wingBatteryMax = this.getBatteryTypeConst("WING_BATTERY_MAX", 3);
    const batteryMax = this.getEnemyTypeConst("BATTERY_MAX", 4);
    this.battery = Array.from({ length: batteryMax }, () => new BatteryData(wingBatteryMax));
    this.movePoint = Array.from({ length: Enemy.MOVE_POINT_MAX }, () => new Vector());
  }

  public override init(args: unknown[] | null): void {
    const raw = Array.isArray(args) ? args[0] : args;
    if (!(raw instanceof EnemyInitializer)) {
      throw new Error("Enemy.init requires EnemyInitializer");
    }
    this.field = raw.field as FieldLike;
    this.bullets = raw.bullets;
    this.shots = raw.shots;
    this.rolls = raw.rolls;
    this.locks = raw.locks;
    this.ship = raw.ship;
    this.manager = raw.manager as ManagerLike;
    this.pos = new Vector();
    this.movePoint = Array.from({ length: Enemy.MOVE_POINT_MAX }, () => new Vector());
    this.vel = new Vector();
    this.velCnt = 0;
    this.fieldLimitX = (this.field.size.x / 4) * 3;
    this.fieldLimitY = (this.field.size.y / 4) * 3;
  }

  public set(p: Vector, d: number, type: EnemyType, moveParser: BulletMLParserAsset): void {
    this.pos.x = p.x;
    this.pos.y = p.y;
    this.type = type as unknown as EnemyTypeLike;
    const moveRunner = moveParser.createRunner();
    this.registFunctions(moveRunner);
    this.moveBullet =
      (this.bullets.addManagedBullet(moveRunner, this.pos.x, this.pos.y, d, 0, 0.5, 1, 0, 0, 1, 1) as
        | BulletActorLike
        | null) ?? null;
    if (!this.moveBullet) {
      return;
    }
    this.cnt = 0;
    this.shield = this.type.shield;
    for (let i = 0; i < this.type.batteryNum; i++) {
      this.battery[i].shield = this.type.batteryType[i].shield;
    }
    this.fireCnt = 0;
    this.barragePatternIdx = 0;
    this.baseDeg = d;
    this.appCnt = 0;
    this.dstCnt = 0;
    this.timeoutCnt = 0;
    this.z = 0;
    this.isBoss = false;
    this.exists = true;
  }

  public setBoss(p: Vector, d: number, type: EnemyType): void {
    this.pos.x = p.x;
    this.pos.y = p.y;
    this.type = type as unknown as EnemyTypeLike;
    this.moveBullet = null;

    const wx = Enemy.rand.nextFloat(this.field.size.x / 4) + this.field.size.x / 4;
    const wy = Enemy.rand.nextFloat(this.field.size.y / 9) + this.field.size.y / 7;
    const cy = (this.field.size.y / 7) * 4;
    this.movePointNum = Enemy.rand.nextInt(3) + 2;
    for (let i = 0; i < Math.floor(this.movePointNum / 2); i++) {
      this.movePoint[i * 2].x = Enemy.rand.nextFloat(wx / 2) + wx / 2;
      this.movePoint[i * 2 + 1].x = -this.movePoint[i * 2].x;
      this.movePoint[i * 2].y = this.movePoint[i * 2 + 1].y = Enemy.rand.nextSignedFloat(wy) + cy;
    }
    if (this.movePointNum === 3) {
      this.movePoint[2].x = 0;
      this.movePoint[2].y = Enemy.rand.nextSignedFloat(wy) + cy;
    }
    for (let i = 0; i < 8; i++) {
      const idx1 = Enemy.rand.nextInt(this.movePointNum);
      let idx2 = Enemy.rand.nextInt(this.movePointNum);
      if (idx1 === idx2) {
        idx2++;
        if (idx2 >= this.movePointNum) {
          idx2 = 0;
        }
      }
      const mp = this.movePoint[idx1];
      this.movePoint[idx1] = this.movePoint[idx2];
      this.movePoint[idx2] = mp;
    }
    this.speed = 0.03 + Enemy.rand.nextFloat(0.02);
    this.movePointIdx = 0;
    this.deg = Math.PI;
    this.onRoute = false;

    this.cnt = 0;
    this.shield = this.type.shield;
    for (let i = 0; i < this.type.batteryNum; i++) {
      this.battery[i].shield = this.type.batteryType[i].shield;
    }
    const batteryMax = this.getEnemyTypeConst("BATTERY_MAX", 4);
    for (let i = this.type.batteryNum; i < batteryMax; i++) {
      this.battery[i].shield = 0;
    }
    this.fireCnt = 0;
    this.barragePatternIdx = 0;
    this.baseDeg = d;
    this.appCnt = Enemy.APPEARANCE_CNT;
    this.z = Enemy.APPEARANCE_Z;
    this.dstCnt = 0;
    this.timeoutCnt = 0;
    this.isBoss = true;
    this.bossTimer = 0;
    this.exists = true;
  }

  private setBullet(br: BarrageLike, ofs: Vector | null, xr = 1): BulletActorLike | null {
    if (br.rank <= 0) {
      return null;
    }
    const runner = br.parser.createRunner();
    this.registFunctions(runner);
    let bx = this.pos.x;
    let by = this.pos.y;
    if (ofs) {
      bx += ofs.x;
      by += ofs.y;
    }
    if (br.morphCnt > 0) {
      return (
        (this.bullets.addTopMorphBullet(
          br.parser,
          runner,
          bx,
          by,
          this.baseDeg,
          0,
          br.rank,
          br.speedRank,
          br.shape,
          br.color,
          br.bulletSize,
          br.xReverse * xr,
          br.morphParser,
          br.morphNum,
          br.morphCnt,
        ) as BulletActorLike | null) ?? null
      );
    }
    return (
      (this.bullets.addTopBullet(
        br.parser,
        runner,
        bx,
        by,
        this.baseDeg,
        0,
        br.rank,
        br.speedRank,
        br.shape,
        br.color,
        br.bulletSize,
        br.xReverse * xr,
      ) as BulletActorLike | null) ?? null
    );
  }

  private setTopBullets(): void {
    this.topBullet = this.setBullet(this.type.barrage[this.barragePatternIdx], null);
    for (let i = 0; i < this.type.batteryNum; i++) {
      const b = this.battery[i];
      if (b.shield <= 0) {
        continue;
      }
      const bt = this.type.batteryType[i];
      let xr = 1;
      for (let j = 0; j < bt.batteryNum; j++) {
        b.topBullet[j] = this.setBullet(bt.barrage[this.barragePatternIdx], bt.batteryPos[j], xr);
        if (bt.xReverseAlternate) {
          xr *= -1;
        }
      }
    }
  }

  private addBonuses(p: Vector | null, sl: number): void {
    const bn = Math.floor((((sl * 3) / (this.cnt / 30 + 1)) * Bonus.rate || 0) + 0.9);
    this.manager.addBonus?.(this.pos, p, bn);
  }

  private addBonusesByTypeShield(): void {
    this.addBonuses(null, this.type.shield);
  }

  private addWingFragments(bt: BatteryTypeLike, n: number, z: number, speed: number, deg: number): void {
    const wingShapePointNum = this.getBatteryTypeConst("WING_SHAPE_POINT_NUM", 3);
    let ni = 1;
    for (let i = 0; i < wingShapePointNum; i++, ni++) {
      if (ni >= wingShapePointNum) {
        ni = 0;
      }
      this.manager.addFragments?.(
        n,
        this.pos.x + bt.wingShapePos[i].x,
        this.pos.y + bt.wingShapePos[i].y,
        this.pos.x + bt.wingShapePos[ni].x,
        this.pos.y + bt.wingShapePos[ni].y,
        z,
        speed,
        deg,
      );
    }
  }

  private addFragments(n: number, z: number, speed: number, deg: number): void {
    const bodyShapePointNum = this.getEnemyTypeConst("BODY_SHAPE_POINT_NUM", 4);
    let ni = 1;
    for (let i = 0; i < bodyShapePointNum; i++, ni++) {
      if (ni >= bodyShapePointNum) {
        ni = 0;
      }
      this.manager.addFragments?.(
        n,
        this.pos.x + this.type.bodyShapePos[i].x,
        this.pos.y + this.type.bodyShapePos[i].y,
        this.pos.x + this.type.bodyShapePos[ni].x,
        this.pos.y + this.type.bodyShapePos[ni].y,
        z,
        speed,
        deg,
      );
    }
    for (let i = 0; i < this.type.batteryNum; i++) {
      if (this.battery[i].shield > 0) {
        this.addWingFragments(this.type.batteryType[i], n, z, speed, deg);
      }
    }
  }

  private addDamage(dmg: number): void {
    this.shield -= dmg;
    if (this.shield <= 0) {
      this.addBonusesByTypeShield();
      this.manager.addScore?.(this.getEnemyTypeScore(this.type.type));
      if (this.isBoss) {
        this.addFragments(15, 0, 0.1, Enemy.rand.nextSignedFloat(1));
        SoundManager.playSe(SoundManager.BOSS_DESTROYED);
        this.manager.setScreenShake?.(20, 0.05);
        this.manager.clearBullets?.();
        this.removeTopBullets();
        this.dstCnt = Enemy.DESTROYED_CNT;
      } else {
        let d = Enemy.rand.nextSignedFloat(1);
        if (this.type.type === this.getEnemyTypeConst("SMALL", 0)) {
          d = this.moveBullet?.bullet.deg ?? 0;
          SoundManager.playSe(SoundManager.ENEMY_DESTROYED);
        } else {
          SoundManager.playSe(SoundManager.LARGE_ENEMY_DESTROYED);
        }
        this.addFragments(this.type.type * 4 + 2, 0, 0.04, d);
        this.remove();
      }
    }
    this.damaged = true;
  }

  private removeBattery(b: BatteryData, bt: BatteryTypeLike): void {
    for (let i = 0; i < bt.batteryNum; i++) {
      if (b.topBullet[i]) {
        b.topBullet[i]?.remove();
        b.topBullet[i] = null;
      }
    }
    b.damaged = true;
  }

  private addDamageBattery(idx: number, dmg: number): void {
    this.battery[idx].shield -= dmg;
    if (this.battery[idx].shield <= 0) {
      const p = this.type.batteryType[idx].collisionPos;
      this.addBonuses(p, this.type.batteryType[idx].shield);
      this.manager.addScore?.(Enemy.ENEMY_WING_SCORE);
      this.addWingFragments(this.type.batteryType[idx], 10, 0, 0.1, Enemy.rand.nextSignedFloat(1));
      SoundManager.playSe(SoundManager.LARGE_ENEMY_DESTROYED);
      this.manager.setScreenShake?.(10, 0.03);
      this.removeBattery(this.battery[idx], this.type.batteryType[idx]);
      this.vel.x = -p.x / 10;
      this.vel.y = -p.y / 10;
      this.velCnt = 60;
      this.removeTopBullets();
      this.fireCnt = this.velCnt + 10;
    }
  }

  private checkHit(p: Vector, xofs: number, yofs: number): number {
    if (
      Math.abs(p.x - this.pos.x) < this.type.collisionSize.x + xofs &&
      Math.abs(p.y - this.pos.y) < this.type.collisionSize.y + yofs
    ) {
      return Enemy.HIT;
    }
    if (this.type.wingCollision) {
      for (let i = 0; i < this.type.batteryNum; i++) {
        if (this.battery[i].shield <= 0) {
          continue;
        }
        const bt = this.type.batteryType[i];
        if (
          Math.abs(p.x - this.pos.x - bt.collisionPos.x) < bt.collisionSize.x + xofs &&
          Math.abs(p.y - this.pos.y - bt.collisionPos.y) < bt.collisionSize.y + yofs
        ) {
          return i;
        }
      }
    }
    return Enemy.NOHIT;
  }

  private checkLocked(p: Vector, xofs: number, lock: LockLike): number {
    if (
      Math.abs(p.x - this.pos.x) < this.type.collisionSize.x + xofs &&
      this.pos.y < lock.lockMinY &&
      this.pos.y > p.y
    ) {
      lock.lockMinY = this.pos.y;
      return Enemy.HIT;
    }
    if (this.type.wingCollision) {
      let lp = Enemy.NOHIT;
      for (let i = 0; i < this.type.batteryNum; i++) {
        if (this.battery[i].shield <= 0) {
          continue;
        }
        const bt = this.type.batteryType[i];
        const by = this.pos.y + bt.collisionPos.y;
        if (
          Math.abs(p.x - this.pos.x - bt.collisionPos.x) < bt.collisionSize.x + xofs &&
          by < lock.lockMinY &&
          by > p.y
        ) {
          lock.lockMinY = by;
          lp = i;
        }
      }
      if (lp !== Enemy.NOHIT) {
        return lp;
      }
    }
    return Enemy.NOHIT;
  }

  private checkDamage(): void {
    const shotSpeed = this.getShotSpeed();
    for (let i = 0; i < this.shots.actor.length; i++) {
      const actor = this.shots.actor[i];
      if (!actor.exists) {
        continue;
      }
      const shot = actor as ShotLike;
      const ch = this.checkHit(shot.pos, 0.7, 0);
      if (ch >= Enemy.HIT) {
        this.manager.addParticle?.(shot.pos, Enemy.rand.nextSignedFloat(0.3), 0, shotSpeed / 4);
        this.manager.addParticle?.(shot.pos, Enemy.rand.nextSignedFloat(0.3), 0, shotSpeed / 4);
        this.manager.addParticle?.(shot.pos, Math.PI + Enemy.rand.nextSignedFloat(0.3), 0, shotSpeed / 7);
        actor.exists = false;
        if (ch === Enemy.HIT) {
          this.addDamage(Enemy.SHOT_DAMAGE);
        } else {
          this.addDamageBattery(ch, Enemy.SHOT_DAMAGE);
        }
      }
    }

    if (this.manager.mode === this.getManagerModeRoll()) {
      for (let i = 0; i < this.rolls.actor.length; i++) {
        const actor = this.rolls.actor[i];
        if (!actor.exists) {
          continue;
        }
        const rl = actor as RollLike;
        const ch = this.checkHit(rl.pos[0], 1, 1);
        if (ch >= Enemy.HIT) {
          for (let j = 0; j < 4; j++) {
            this.manager.addParticle?.(rl.pos[0], Enemy.rand.nextFloat(Math.PI * 2), 0, shotSpeed / 10);
          }
          let rd = Enemy.ROLL_DAMAGE;
          if (rl.released) {
            rd += rd;
          } else if (rl.cnt < this.getRollNoCollisionCnt()) {
            continue;
          }
          if (ch === Enemy.HIT) {
            this.addDamage(rd);
          } else {
            this.addDamageBattery(ch, rd);
          }
        }
      }
    } else if (this.type.type !== this.getEnemyTypeConst("SMALL", 0)) {
      for (let i = 0; i < this.locks.actor.length; i++) {
        const actor = this.locks.actor[i];
        if (!actor.exists) {
          continue;
        }
        const lk = actor as LockLike;
        if (lk.state === this.getLockState("SEARCH", 0) || lk.state === this.getLockState("SEARCHED", 1)) {
          const ch = this.checkLocked(lk.pos[0], 2.5, lk);
          if (ch >= Enemy.HIT) {
            lk.state = this.getLockState("SEARCHED", 1);
            lk.lockedEnemy = this;
            lk.lockedPart = ch;
          }
          return;
        }
        if (lk.state === this.getLockState("FIRED", 4) && lk.lockedEnemy === this) {
          const ch = this.checkHit(lk.pos[0], 1.5, 1.5);
          if (ch >= Enemy.HIT && ch === lk.lockedPart) {
            for (let j = 0; j < 4; j++) {
              this.manager.addParticle?.(lk.pos[0], Enemy.rand.nextFloat(Math.PI * 2), 0, shotSpeed / 10);
            }
            if (ch === Enemy.HIT) {
              this.addDamage(Enemy.LOCK_DAMAGE);
            } else {
              this.addDamageBattery(ch, Enemy.LOCK_DAMAGE);
            }
            lk.hit();
          }
        }
      }
    }
  }

  private removeTopBullets(): void {
    if (this.topBullet) {
      this.topBullet.remove();
      this.topBullet = null;
    }
    for (let i = 0; i < this.type.batteryNum; i++) {
      const bt = this.type.batteryType[i];
      const b = this.battery[i];
      for (let j = 0; j < bt.batteryNum; j++) {
        if (b.topBullet[j]) {
          b.topBullet[j]?.remove();
          b.topBullet[j] = null;
        }
      }
    }
  }

  private remove(): void {
    this.removeTopBullets();
    if (this.moveBullet) {
      this.moveBullet.remove();
    }
    this.exists = false;
  }

  private gotoNextPoint(): void {
    this.onRoute = false;
    this.movePointIdx++;
    if (this.movePointIdx >= this.movePointNum) {
      this.movePointIdx = 0;
    }
  }

  private moveBoss(): void {
    const aim = this.movePoint[this.movePointIdx];
    const d = Math.atan2(aim.x - this.pos.x, aim.y - this.pos.y);
    let od = d - this.deg;
    if (od > Math.PI) {
      od -= Math.PI * 2;
    } else if (od < -Math.PI) {
      od += Math.PI * 2;
    }
    const aod = Math.abs(od);
    if (aod < Enemy.BOSS_MOVE_DEG) {
      this.deg = d;
    } else if (od > 0) {
      this.deg += Enemy.BOSS_MOVE_DEG;
      if (this.deg >= Math.PI * 2) {
        this.deg -= Math.PI * 2;
      }
    } else {
      this.deg -= Enemy.BOSS_MOVE_DEG;
      if (this.deg < 0) {
        this.deg += Math.PI * 2;
      }
    }
    this.pos.x += Math.sin(this.deg) * this.speed;
    this.pos.y += Math.cos(this.deg) * this.speed;
    if (this.velCnt > 0) {
      this.velCnt--;
      this.pos.x += this.vel.x;
      this.pos.y += this.vel.y;
      this.vel.x *= 0.92;
      this.vel.y *= 0.92;
    }
    if (!this.onRoute) {
      if (aod < Math.PI / 2) {
        this.onRoute = true;
      }
    } else if (aod > Math.PI / 2) {
      this.gotoNextPoint();
    }
    if (this.pos.x > this.fieldLimitX) {
      this.pos.x = this.fieldLimitX;
      this.gotoNextPoint();
    } else if (this.pos.x < -this.fieldLimitX) {
      this.pos.x = -this.fieldLimitX;
      this.gotoNextPoint();
    }
    if (this.pos.y > this.fieldLimitY) {
      this.pos.y = this.fieldLimitY;
      this.gotoNextPoint();
    } else if (this.pos.y < this.fieldLimitY / 4) {
      this.pos.y = this.fieldLimitY / 4;
      this.gotoNextPoint();
    }
  }

  private controlFireCnt(): void {
    if (this.fireCnt <= 0) {
      this.setTopBullets();
      this.fireCnt = this.type.fireInterval;
      this.barragePatternIdx++;
      if (this.barragePatternIdx >= this.type.barragePatternNum) {
        this.barragePatternIdx = 0;
      }
    } else if (this.fireCnt < this.type.fireInterval - this.type.firePeriod) {
      this.removeTopBullets();
    }
    this.fireCnt--;
  }

  public override move(): void {
    this.setEnemyTypeExist(this.type.id, true);
    if (!this.isBoss) {
      if (!this.moveBullet) {
        this.remove();
        return;
      }
      this.pos.x = this.moveBullet.bullet.pos.x;
      this.pos.y = this.moveBullet.bullet.pos.y;
    } else {
      this.moveBoss();
    }
    if (this.topBullet) {
      this.topBullet.bullet.pos.x = this.pos.x;
      this.topBullet.bullet.pos.y = this.pos.y;
    }
    this.damaged = false;
    for (let i = 0; i < this.type.batteryNum; i++) {
      const bt = this.type.batteryType[i];
      const b = this.battery[i];
      b.damaged = false;
      for (let j = 0; j < bt.batteryNum; j++) {
        if (b.topBullet[j]) {
          b.topBullet[j]!.bullet.pos.x = this.pos.x + bt.batteryPos[j].x;
          b.topBullet[j]!.bullet.pos.y = this.pos.y + bt.batteryPos[j].y;
        }
      }
    }
    if (!this.isBoss) {
      if (this.checkFieldHit(this.pos)) {
        this.remove();
        return;
      }
      if (this.pos.y < -this.field.size.y / 4) {
        this.removeTopBullets();
      } else {
        this.controlFireCnt();
      }
    } else {
      let mtr = 1;
      if (this.appCnt > 0) {
        if (this.z < 0) {
          this.z -= Enemy.APPEARANCE_Z / 60;
        }
        this.appCnt--;
        mtr = 1 - this.appCnt / Enemy.APPEARANCE_CNT;
      } else if (this.dstCnt > 0) {
        this.addFragments(1, this.z, 0.05, Enemy.rand.nextSignedFloat(Math.PI));
        this.manager.clearBullets?.();
        this.z += Enemy.DESTROYED_Z / 60;
        this.dstCnt--;
        if (this.dstCnt <= 0) {
          this.addFragments(25, this.z, 0.4, Enemy.rand.nextSignedFloat(Math.PI));
          SoundManager.playSe(SoundManager.BOSS_DESTROYED);
          this.manager.setScreenShake?.(60, 0.01);
          this.remove();
          this.manager.setBossShieldMeter?.(0, 0, 0, 0, 0, 0);
          return;
        }
        mtr = this.dstCnt / Enemy.DESTROYED_CNT;
      } else if (this.timeoutCnt > 0) {
        this.z += Enemy.DESTROYED_Z / 60;
        this.timeoutCnt--;
        if (this.timeoutCnt <= 0) {
          this.remove();
          return;
        }
        mtr = 0;
      } else {
        this.controlFireCnt();
        mtr = 1;
        this.bossTimer++;
        if (this.bossTimer > Enemy.BOSS_TIMEOUT) {
          this.timeoutCnt = Enemy.TIMEOUT_CNT;
          this.shield = 0;
          this.removeTopBullets();
        }
      }
      this.manager.setBossShieldMeter?.(
        this.shield,
        this.battery[0].shield,
        this.battery[1].shield,
        this.battery[2].shield,
        this.battery[3].shield,
        mtr,
      );
    }
    this.cnt++;
    if (this.appCnt <= 0 && this.dstCnt <= 0 && this.timeoutCnt <= 0) {
      this.checkDamage();
    }
  }

  public override draw(): void {
    // Reset retro blur parameters per enemy draw to avoid inheriting stale values
    // from previously drawn bullets/effects in earlier frames.
    // P47Screen.setRetroParam(1, this.type.retroSize);
    let ap = 1;
    if (this.appCnt > 0) {
      P47Screen.setRetroZ(this.z);
      ap = this.appCnt / Enemy.APPEARANCE_CNT;
      P47Screen.setRetroParam(1, this.type.retroSize * (1 + ap * 10));
      P47Screen.setRetroColor(this.type.r, this.type.g, this.type.b, 1 - ap);
    } else if (this.dstCnt > 0) {
      P47Screen.setRetroZ(this.z);
      ap = this.dstCnt / Enemy.DESTROYED_CNT / 2 + 0.5;
      P47Screen.setRetroColor(this.type.r, this.type.g, this.type.b, ap);
    } else if (this.timeoutCnt > 0) {
      P47Screen.setRetroZ(this.z);
      ap = this.timeoutCnt / Enemy.TIMEOUT_CNT;
      P47Screen.setRetroColor(this.type.r, this.type.g, this.type.b, ap);
    } else {
      P47Screen.setRetroParam(1, this.type.retroSize);
      if (!this.damaged) {
        P47Screen.setRetroColor(this.type.r, this.type.g, this.type.b, 1);
      } else {
        P47Screen.setRetroColor(1, 1, this.type.b, 1);
      }
    }

    const bodyShapePointNum = this.getEnemyTypeConst("BODY_SHAPE_POINT_NUM", 4);
    if (bodyShapePointNum === 4) {
      P47Screen.drawLineLoopRetro4(
        this.pos.x + this.type.bodyShapePos[0].x,
        this.pos.y + this.type.bodyShapePos[0].y,
        this.pos.x + this.type.bodyShapePos[1].x,
        this.pos.y + this.type.bodyShapePos[1].y,
        this.pos.x + this.type.bodyShapePos[2].x,
        this.pos.y + this.type.bodyShapePos[2].y,
        this.pos.x + this.type.bodyShapePos[3].x,
        this.pos.y + this.type.bodyShapePos[3].y,
      );
    } else {
      let ni = 1;
      for (let i = 0; i < bodyShapePointNum; i++, ni++) {
        if (ni >= bodyShapePointNum) {
          ni = 0;
        }
        P47Screen.drawLineRetro(
          this.pos.x + this.type.bodyShapePos[i].x,
          this.pos.y + this.type.bodyShapePos[i].y,
          this.pos.x + this.type.bodyShapePos[ni].x,
          this.pos.y + this.type.bodyShapePos[ni].y,
        );
      }
    }

    if (this.type.type !== this.getEnemyTypeConst("SMALL", 0)) {
      Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
      Screen3D.setColor(P47Screen.retroR, P47Screen.retroG, P47Screen.retroB, 0);
      for (let i = 0; i < bodyShapePointNum; i++) {
        if (i === 2) {
          Screen3D.setColor(P47Screen.retroR, P47Screen.retroG, P47Screen.retroB, P47Screen.retroA);
        }
        Screen3D.glVertex3f(this.pos.x + this.type.bodyShapePos[i].x, this.pos.y + this.type.bodyShapePos[i].y, this.z);
      }
      Screen3D.glEnd();
    }

    const wingShapePointNum = this.getBatteryTypeConst("WING_SHAPE_POINT_NUM", 3);
    for (let i = 0; i < this.type.batteryNum; i++) {
      const bt = this.type.batteryType[i];
      if (this.appCnt > 0) {
        P47Screen.setRetroColor(bt.r, bt.g, bt.b, 1 - ap);
      } else if (this.dstCnt > 0 || this.timeoutCnt > 0) {
        P47Screen.setRetroColor(bt.r, bt.g, bt.b, ap);
      } else if (!this.battery[i].damaged) {
        P47Screen.setRetroColor(bt.r, bt.g, bt.b, 1);
      } else {
        P47Screen.setRetroColor(1, 1, bt.b, 1);
      }
      if (this.battery[i].shield <= 0) {
        P47Screen.drawLineRetro(
          this.pos.x + bt.wingShapePos[0].x,
          this.pos.y + bt.wingShapePos[0].y,
          this.pos.x + bt.wingShapePos[1].x,
          this.pos.y + bt.wingShapePos[1].y,
        );
      } else {
        if (wingShapePointNum === 3) {
          P47Screen.drawLineLoopRetro3(
            this.pos.x + bt.wingShapePos[0].x,
            this.pos.y + bt.wingShapePos[0].y,
            this.pos.x + bt.wingShapePos[1].x,
            this.pos.y + bt.wingShapePos[1].y,
            this.pos.x + bt.wingShapePos[2].x,
            this.pos.y + bt.wingShapePos[2].y,
          );
        } else {
          let ni = 1;
          for (let j = 0; j < wingShapePointNum; j++, ni++) {
            if (ni >= wingShapePointNum) {
              ni = 0;
            }
            P47Screen.drawLineRetro(
              this.pos.x + bt.wingShapePos[j].x,
              this.pos.y + bt.wingShapePos[j].y,
              this.pos.x + bt.wingShapePos[ni].x,
              this.pos.y + bt.wingShapePos[ni].y,
            );
          }
        }
        if (this.type.type !== this.getEnemyTypeConst("SMALL", 0)) {
          Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
          Screen3D.setColor(P47Screen.retroR, P47Screen.retroG, P47Screen.retroB, P47Screen.retroA);
          for (let j = 0; j < wingShapePointNum; j++) {
            if (j === 2) {
              Screen3D.setColor(P47Screen.retroR, P47Screen.retroG, P47Screen.retroB, 0);
            }
            Screen3D.glVertex3f(this.pos.x + bt.wingShapePos[j].x, this.pos.y + bt.wingShapePos[j].y, this.z);
          }
          Screen3D.glEnd();
        }
      }
    }
    P47Screen.setRetroZ(0);
  }

  private registFunctions(runner: BulletMLRunner): void {
    BulletActorPool.registFunctions(runner);
  }

  private checkFieldHit(pos: Vector): boolean {
    if (typeof this.field.checkHit === "function") {
      return this.field.checkHit(pos);
    }
    return (
      pos.x < -this.field.size.x ||
      pos.x > this.field.size.x ||
      pos.y < -this.field.size.y ||
      pos.y > this.field.size.y
    );
  }

  private getEnemyTypeConst(name: string, fallback: number): number {
    const v = (EnemyType as unknown as Record<string, unknown>)[name];
    return typeof v === "number" ? v : fallback;
  }

  private getBatteryTypeConst(name: string, fallback: number): number {
    const batteryTypeClass = (
      (this.type?.batteryType?.[0] as unknown as { constructor?: unknown })?.constructor as unknown
    ) as Record<string, unknown> | undefined;
    const v = batteryTypeClass?.[name];
    return typeof v === "number" ? v : fallback;
  }

  private getManagerModeRoll(): number {
    const v = (this.manager.constructor as unknown as Record<string, unknown>)?.ROLL;
    return typeof v === "number" ? v : 0;
  }

  private getRollNoCollisionCnt(): number {
    const v = (Roll as unknown as Record<string, unknown>).NO_COLLISION_CNT;
    return typeof v === "number" ? v : 45;
  }

  private getShotSpeed(): number {
    const v = (Shot as unknown as Record<string, unknown>).SPEED;
    return typeof v === "number" ? v : 1;
  }

  private getLockState(name: string, fallback: number): number {
    const v = (Lock as unknown as Record<string, unknown>)[name];
    return typeof v === "number" ? v : fallback;
  }

  private setEnemyTypeExist(id: number, value: boolean): void {
    const enemyTypeClass = EnemyType as unknown as {
      isExist?: boolean[];
    };
    if (!enemyTypeClass.isExist) {
      enemyTypeClass.isExist = [];
    }
    enemyTypeClass.isExist[id] = value;
  }

  private getEnemyTypeScore(type: number): number {
    if (type < 0) {
      return Enemy.ENEMY_TYPE_SCORE[0];
    }
    if (type >= Enemy.ENEMY_TYPE_SCORE.length) {
      return Enemy.ENEMY_TYPE_SCORE[Enemy.ENEMY_TYPE_SCORE.length - 1];
    }
    return Enemy.ENEMY_TYPE_SCORE[type];
  }
}

export class EnemyInitializer {
  public constructor(
    public readonly field: Field,
    public readonly bullets: BulletActorPool,
    public readonly shots: ActorPool<Actor>,
    public readonly rolls: ActorPool<Actor>,
    public readonly locks: ActorPool<Actor>,
    public readonly ship: Ship,
    public readonly manager: P47GameManager,
  ) {}
}
