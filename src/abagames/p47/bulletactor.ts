import { Actor } from "../util/actor";
import { Vector } from "../util/vector";
import type { BulletMLRunner } from "../util/bulletml/bullet";
import { rtod } from "../util/bulletml/bullet";
import { DisplayList } from "../util/sdl/displaylist";
import { Screen3D } from "../util/sdl/screen3d";
import { BulletActorPool } from "./bulletactorpool";
import { Field } from "./field";
import { P47Bullet } from "./p47bullet";
import { P47Screen } from "./screen";
import { Ship } from "./ship";

type BulletMLParserLike = {
  createRunner: () => BulletMLRunner;
};

type BulletShapePoint = readonly [number, number];

type P47BulletLike = {
  pos: Vector;
  acc: Vector;
  deg: number;
  speed: number;
  rank: number;
  id: number;
  isMorph: boolean;
  speedRank: number;
  shape: number;
  color: number;
  bulletSize: number;
  xReverse: number;
  morphParser: BulletMLParserLike[];
  morphNum: number;
  morphIdx: number;
  morphCnt: number;
  set: (x: number, y: number, deg: number, speed: number, rank: number) => void;
  move: () => void;
  isEnd: () => boolean;
  remove: () => void;
  setRunner: (runner: BulletMLRunner) => void;
  setMorph: (
    morph: BulletMLParserLike[],
    morphNum: number,
    morphIdx: number,
    morphCnt: number,
  ) => void;
  resetMorph: () => void;
  setParam: (speedRank: number, shape: number, color: number, size: number, xReverse: number) => void;
};

/**
 * Actor of the bullet.
 */
export class BulletActor extends Actor {
  public static totalBulletsSpeed = 0;

  public static readonly BULLET_SHAPE_NUM = 7;
  public static readonly BULLET_COLOR_NUM = 4;

  private static readonly FIELD_SPACE = 0.5;
  private static BULLET_DISAPPEAR_CNT = 180;
  private static nextId = 0;
  private static displayList: DisplayList | null = null;

  private static readonly SHIP_HIT_WIDTH = 0.2;
  private static readonly RETRO_CNT = 24;

  private static readonly SHAPE_POINT_SIZE = 0.1;
  private static readonly SHAPE_BASE_COLOR_R = 1;
  private static readonly SHAPE_BASE_COLOR_G = 0.9;
  private static readonly SHAPE_BASE_COLOR_B = 0.7;

  private static readonly bulletColor: ReadonlyArray<readonly [number, number, number]> = [
    [1, 0, 0],
    [0.2, 1, 0.4],
    [0.3, 0.3, 1],
    [1, 1, 0],
  ];

  private static readonly shapePos: ReadonlyArray<ReadonlyArray<BulletShapePoint>> = [
    [
      [-0.5, -0.5],
      [0.5, -0.5],
      [0, 1],
    ],
    [
      [0, -1],
      [0.5, 0],
      [0, 1],
      [-0.5, 0],
    ],
    [
      [-0.25, -0.66],
      [0.25, -0.66],
      [0.25, 0.66],
      [-0.25, 0.66],
    ],
    [
      [-0.5, -0.5],
      [0.5, -0.5],
      [0.5, 0.5],
      [-0.5, 0.5],
    ],
    [
      [-0.25, -0.5],
      [0.25, -0.5],
      [0.5, -0.25],
      [0.5, 0.25],
      [0.25, 0.5],
      [-0.25, 0.5],
      [-0.5, 0.25],
      [-0.5, -0.25],
    ],
    [
      [-0.66, -0.46],
      [0, 0.86],
      [0.66, -0.46],
    ],
    [
      [-0.5, -0.5],
      [0, -0.5],
      [0.5, 0],
      [0.5, 0.5],
      [0, 0.5],
      [-0.5, 0],
    ],
  ];

  public bullet: P47BulletLike;

  private field!: Field;
  private ship!: Ship;
  private isSimple = false;
  private isTop = false;
  private isVisible = true;
  private parser: BulletMLParserLike | null = null;
  private ppos = new Vector();
  private cnt = 0;
  private rtCnt = 0;
  private shouldBeRemoved = false;
  private backToRetro = false;

  public constructor() {
    super();
    this.bullet = this.createBullet(BulletActor.nextId++);
  }

  public static init(): void {
    BulletActor.nextId = 0;
  }

  public static resetTotalBulletsSpeed(): void {
    BulletActor.totalBulletsSpeed = 0;
  }

  public override init(args: unknown[] | null): void {
    const raw = Array.isArray(args) ? args[0] : args;
    if (!(raw instanceof BulletActorInitializer)) {
      throw new Error("BulletActor.init requires BulletActorInitializer");
    }
    this.field = raw.field;
    this.ship = raw.ship;
    this.bullet = this.createBullet(BulletActor.nextId++);
    this.ppos = new Vector();
    this.exists = false;
  }

  private createBullet(id: number): P47BulletLike {
    const bulletCtor = P47Bullet as unknown as new (id?: number) => unknown;
    const bullet = new bulletCtor(id) as Partial<P47BulletLike> & {
      pos?: Vector;
      acc?: Vector;
    };
    bullet.pos ??= new Vector();
    bullet.acc ??= new Vector();
    bullet.deg ??= 0;
    bullet.speed ??= 0;
    bullet.rank ??= 0;
    bullet.id ??= id;
    bullet.isMorph ??= false;
    bullet.speedRank ??= 1;
    bullet.shape ??= 0;
    bullet.color ??= 0;
    bullet.bulletSize ??= 1;
    bullet.xReverse ??= 1;
    bullet.morphParser ??= [];
    bullet.morphNum ??= 0;
    bullet.morphIdx ??= 0;
    bullet.morphCnt ??= 0;
    bullet.set ??= (x, y, deg, speed, rank) => {
      bullet.pos!.x = x;
      bullet.pos!.y = y;
      bullet.acc!.x = 0;
      bullet.acc!.y = 0;
      bullet.deg = deg;
      bullet.speed = speed;
      bullet.rank = rank;
    };
    bullet.move ??= () => {};
    bullet.isEnd ??= () => true;
    bullet.remove ??= () => {};
    bullet.setRunner ??= () => {};
    bullet.setMorph ??= (morph, morphNum, morphIdx, morphCnt) => {
      bullet.isMorph = morphCnt > 0;
      bullet.morphParser = morph.slice(0, morphNum);
      bullet.morphNum = morphNum;
      bullet.morphIdx = morphIdx;
      bullet.morphCnt = morphCnt;
    };
    bullet.resetMorph ??= () => {};
    bullet.setParam ??= (speedRank, shape, color, size, xReverse) => {
      bullet.speedRank = speedRank;
      bullet.shape = shape;
      bullet.color = color;
      bullet.bulletSize = size;
      bullet.xReverse = xReverse;
    };
    return bullet as P47BulletLike;
  }

  private start(speedRank: number, shape: number, color: number, size: number, xReverse: number): void {
    this.exists = true;
    this.isTop = false;
    this.isVisible = true;
    this.ppos.x = this.bullet.pos.x;
    this.ppos.y = this.bullet.pos.y;
    this.bullet.setParam(speedRank, shape, color, size, xReverse);
    this.cnt = 0;
    this.rtCnt = 0;
    this.shouldBeRemoved = false;
    this.backToRetro = false;
  }

  public set(
    runner: BulletMLRunner,
    x: number,
    y: number,
    deg: number,
    speed: number,
    rank: number,
    speedRank: number,
    shape: number,
    color: number,
    size: number,
    xReverse: number,
    morph?: BulletMLParserLike[],
    morphNum = 0,
    morphIdx = 0,
    morphCnt = 0,
  ): void {
    this.bullet.set(x, y, deg, speed, rank);
    this.bullet.setRunner(runner);
    if (morph && morphNum > 0) {
      this.bullet.setMorph(morph, morphNum, morphIdx, morphCnt);
      this.bullet.isMorph = true;
    } else {
      this.bullet.isMorph = false;
    }
    this.isSimple = false;
    this.start(speedRank, shape, color, size, xReverse);
  }

  public setSimple(
    x: number,
    y: number,
    deg: number,
    speed: number,
    rank: number,
    speedRank: number,
    shape: number,
    color: number,
    size: number,
    xReverse: number,
  ): void {
    this.bullet.set(x, y, deg, speed, rank);
    this.bullet.isMorph = false;
    this.isSimple = true;
    this.start(speedRank, shape, color, size, xReverse);
  }

  public setInvisible(): void {
    this.isVisible = false;
  }

  public setTop(parser: BulletMLParserLike): void {
    this.parser = parser;
    this.isTop = true;
    this.setInvisible();
  }

  public rewind(): void {
    this.bullet.remove();
    if (!this.parser) return;
    const runner = this.parser.createRunner();
    // PORT_NOTE[D:BulletActor.d#rewind]:
    // D版の BulletActorPool.registFunctions 相当が未移植のため callback 再登録は未対応。
    // 影響: 巻き戻し後の BulletML callback が未接続になる可能性がある。
    // TODO: BulletActorPool 側の faithful port 時に runner callback を接続する。
    const poolClass = BulletActorPool as unknown as {
      registFunctions?: (runner: BulletMLRunner) => void;
    };
    poolClass.registFunctions?.(runner);
    this.bullet.setRunner(runner);
    this.bullet.resetMorph();
  }

  public remove(): void {
    this.shouldBeRemoved = true;
  }

  private removeForced(): void {
    if (!this.isSimple) {
      this.bullet.remove();
    }
    this.exists = false;
  }

  public toRetro(): void {
    if (!this.isVisible || this.backToRetro) {
      return;
    }
    this.backToRetro = true;
    if (this.rtCnt >= BulletActor.RETRO_CNT) {
      this.rtCnt = BulletActor.RETRO_CNT - 0.1;
    }
  }

  private checkShipHit(): void {
    let bmvx = this.ppos.x - this.bullet.pos.x;
    let bmvy = this.ppos.y - this.bullet.pos.y;
    const inaa = bmvx * bmvx + bmvy * bmvy;
    if (inaa <= 0.00001) {
      return;
    }
    const sofsx = this.ship.pos.x - this.bullet.pos.x;
    const sofsy = this.ship.pos.y - this.bullet.pos.y;
    const inab = bmvx * sofsx + bmvy * sofsy;
    if (inab < 0 || inab > inaa) {
      return;
    }
    const hd = sofsx * sofsx + sofsy * sofsy - (inab * inab) / inaa;
    if (hd >= 0 && hd <= BulletActor.SHIP_HIT_WIDTH) {
      // PORT_NOTE[D:BulletActor.d#checkShipHit]:
      // Ship.destroyed() の faithful 移植が未完で TS 側 API 契約が確定していない。
      // 影響: Ship 側が未実装の状態では被弾副作用が発生しない。
      // TODO: Ship.d 移植時に destroyed() を実装し、この呼び出しを型安全化する。
      const destroyFn = (this.ship as Ship & { destroyed?: () => void }).destroyed;
      if (typeof destroyFn === "function") {
        destroyFn.call(this.ship);
      }
    }
  }

  public override move(): void {
    this.ppos.x = this.bullet.pos.x;
    this.ppos.y = this.bullet.pos.y;
    if (!this.isSimple) {
      this.bullet.move();
      if (this.isTop && this.bullet.isEnd()) {
        this.rewind();
      }
    }
    if (this.shouldBeRemoved) {
      this.removeForced();
      return;
    }

    let sr: number;
    if (this.rtCnt < BulletActor.RETRO_CNT) {
      sr = this.bullet.speedRank * (0.3 + (this.rtCnt / BulletActor.RETRO_CNT) * 0.7);
      if (this.backToRetro) {
        this.rtCnt -= sr;
        if (this.rtCnt <= 0) {
          this.removeForced();
          return;
        }
      } else {
        this.rtCnt += sr;
      }
      if (this.ship.cnt < -Ship.INVINCIBLE_CNT / 2 && this.isVisible && this.rtCnt >= BulletActor.RETRO_CNT) {
        this.removeForced();
        return;
      }
    } else {
      sr = this.bullet.speedRank;
      if (this.cnt > BulletActor.BULLET_DISAPPEAR_CNT) {
        this.toRetro();
      }
    }

    this.bullet.pos.x +=
      (Math.sin(this.bullet.deg) * this.bullet.speed + this.bullet.acc.x) * sr * this.bullet.xReverse;
    this.bullet.pos.y += (Math.cos(this.bullet.deg) * this.bullet.speed - this.bullet.acc.y) * sr;

    if (this.isVisible) {
      BulletActor.totalBulletsSpeed += this.bullet.speed * sr;
      if (this.rtCnt > BulletActor.RETRO_CNT) {
        this.checkShipHit();
      }
      if (this.checkFieldHit(this.bullet.pos, BulletActor.FIELD_SPACE)) {
        this.removeForced();
      }
    }
    this.cnt++;
  }

  private checkFieldHit(pos: Vector, space: number): boolean {
    const fieldLike = this.field as Field & {
      checkHit?: (p: Vector, s?: number) => boolean;
      size: Vector;
    };
    if (typeof fieldLike.checkHit === "function") {
      return fieldLike.checkHit(pos, space);
    }
    return (
      pos.x < -fieldLike.size.x + space ||
      pos.x > fieldLike.size.x - space ||
      pos.y < -fieldLike.size.y + space ||
      pos.y > fieldLike.size.y - space
    );
  }

  private drawRetro(d: number): void {
    const rt = 1 - this.rtCnt / BulletActor.RETRO_CNT;
    P47Screen.setRetroParam(rt, 0.4 * this.bullet.bulletSize);
    const color = BulletActor.bulletColor[this.clampColor(this.bullet.color)];
    P47Screen.setRetroColor(color[0], color[1], color[2], 1);
    let x = 0;
    let y = 0;
    let fx = 0;
    let fy = 0;
    const shape = BulletActor.shapePos[this.clampShape(this.bullet.shape)];
    for (let i = 0; i < shape.length; i++) {
      const px = x;
      const py = y;
      const tx = shape[i][0] * this.bullet.bulletSize;
      y = shape[i][1] * this.bullet.bulletSize;
      x = tx * Math.cos(d) - y * Math.sin(d);
      y = tx * Math.sin(d) + y * Math.cos(d);
      if (i > 0) {
        P47Screen.drawLineRetro(px, py, x, y);
      } else {
        fx = x;
        fy = y;
      }
    }
    P47Screen.drawLineRetro(x, y, fx, fy);
  }

  public override draw(): void {
    if (!this.isVisible) {
      return;
    }
    let d = 0;
    switch (this.bullet.shape) {
      case 0:
      case 2:
      case 5:
        d = -this.bullet.deg * this.bullet.xReverse;
        break;
      case 1:
        d = this.cnt * 0.14;
        break;
      case 3:
        d = this.cnt * 0.23;
        break;
      case 4:
        d = this.cnt * 0.33;
        break;
      case 6:
        d = this.cnt * 0.08;
        break;
      default:
        d = -this.bullet.deg * this.bullet.xReverse;
        break;
    }
    Screen3D.glPushMatrix();
    Screen3D.glTranslatef(this.bullet.pos.x, this.bullet.pos.y, 0);
    if (this.rtCnt >= BulletActor.RETRO_CNT && BulletActor.displayList) {
      const di = this.clampColor(this.bullet.color) * (BulletActor.BULLET_SHAPE_NUM + 1);
      BulletActor.displayList.call(di);
      Screen3D.glRotatef(rtod(d), 0, 0, 1);
      Screen3D.glScalef(this.bullet.bulletSize, this.bullet.bulletSize, 1);
      BulletActor.displayList.call(di + 1 + this.clampShape(this.bullet.shape));
    } else {
      this.drawRetro(d);
    }
    Screen3D.glPopMatrix();
  }

  private clampShape(shape: number): number {
    if (shape < 0) return 0;
    if (shape >= BulletActor.BULLET_SHAPE_NUM) return BulletActor.BULLET_SHAPE_NUM - 1;
    return shape;
  }

  private clampColor(color: number): number {
    if (color < 0) return 0;
    if (color >= BulletActor.BULLET_COLOR_NUM) return BulletActor.BULLET_COLOR_NUM - 1;
    return color;
  }

  public static createDisplayLists(): void {
    BulletActor.deleteDisplayLists();
    const total = BulletActor.BULLET_COLOR_NUM * (BulletActor.BULLET_SHAPE_NUM + 1);
    const list = new DisplayList(total);
    let idx = 0;
    let started = false;
    for (let i = 0; i < BulletActor.BULLET_COLOR_NUM; i++) {
      let r = BulletActor.bulletColor[i][0];
      let g = BulletActor.bulletColor[i][1];
      let b = BulletActor.bulletColor[i][2];
      r += (1 - r) * 0.5;
      g += (1 - g) * 0.5;
      b += (1 - b) * 0.5;
      for (let j = 0; j < BulletActor.BULLET_SHAPE_NUM + 1; j++) {
        if (!started) {
          list.beginNewList();
          started = true;
        } else {
          list.nextNewList();
        }
        Screen3D.setColor(r, g, b, 1);
        BulletActor.drawDisplayListShape(j, r, g, b);
        idx++;
      }
    }
    if (started && idx > 0) {
      list.endNewList();
    }
    BulletActor.displayList = list;
  }

  private static drawDisplayListShape(j: number, r: number, g: number, b: number): void {
    const size = 1;
    let sz = 0;
    let sz2 = 0;
    switch (j) {
      case 0:
        Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
        Screen3D.glVertex3f(-BulletActor.SHAPE_POINT_SIZE, -BulletActor.SHAPE_POINT_SIZE, 0);
        Screen3D.glVertex3f(BulletActor.SHAPE_POINT_SIZE, -BulletActor.SHAPE_POINT_SIZE, 0);
        Screen3D.glVertex3f(BulletActor.SHAPE_POINT_SIZE, BulletActor.SHAPE_POINT_SIZE, 0);
        Screen3D.glVertex3f(-BulletActor.SHAPE_POINT_SIZE, BulletActor.SHAPE_POINT_SIZE, 0);
        Screen3D.glEnd();
        break;
      case 1:
        sz = size / 2;
        Screen3D.glDisable(Screen3D.GL_BLEND);
        Screen3D.glBegin(Screen3D.GL_LINE_LOOP);
        Screen3D.glVertex3f(-sz, -sz, 0);
        Screen3D.glVertex3f(sz, -sz, 0);
        Screen3D.glVertex3f(0, size, 0);
        Screen3D.glEnd();
        Screen3D.glEnable(Screen3D.GL_BLEND);
        Screen3D.setColor(r, g, b, 0.55);
        Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
        Screen3D.glVertex3f(-sz, -sz, 0);
        Screen3D.glVertex3f(sz, -sz, 0);
        Screen3D.setColor(BulletActor.SHAPE_BASE_COLOR_R, BulletActor.SHAPE_BASE_COLOR_G, BulletActor.SHAPE_BASE_COLOR_B, 0.55);
        Screen3D.glVertex3f(0, size, 0);
        Screen3D.glEnd();
        break;
      case 2:
        sz = size / 2;
        Screen3D.glDisable(Screen3D.GL_BLEND);
        Screen3D.glBegin(Screen3D.GL_LINE_LOOP);
        Screen3D.glVertex3f(0, -size, 0);
        Screen3D.glVertex3f(sz, 0, 0);
        Screen3D.glVertex3f(0, size, 0);
        Screen3D.glVertex3f(-sz, 0, 0);
        Screen3D.glEnd();
        Screen3D.glEnable(Screen3D.GL_BLEND);
        Screen3D.setColor(r, g, b, 0.7);
        Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
        Screen3D.glVertex3f(0, -size, 0);
        Screen3D.glVertex3f(sz, 0, 0);
        Screen3D.setColor(BulletActor.SHAPE_BASE_COLOR_R, BulletActor.SHAPE_BASE_COLOR_G, BulletActor.SHAPE_BASE_COLOR_B, 0.55);
        Screen3D.glVertex3f(0, size, 0);
        Screen3D.glVertex3f(-sz, 0, 0);
        Screen3D.glEnd();
        break;
      case 3:
        sz = size / 4;
        sz2 = (size / 3) * 2;
        Screen3D.glDisable(Screen3D.GL_BLEND);
        Screen3D.glBegin(Screen3D.GL_LINE_LOOP);
        Screen3D.glVertex3f(-sz, -sz2, 0);
        Screen3D.glVertex3f(sz, -sz2, 0);
        Screen3D.glVertex3f(sz, sz2, 0);
        Screen3D.glVertex3f(-sz, sz2, 0);
        Screen3D.glEnd();
        Screen3D.glEnable(Screen3D.GL_BLEND);
        Screen3D.setColor(r, g, b, 0.45);
        Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
        Screen3D.glVertex3f(-sz, -sz2, 0);
        Screen3D.glVertex3f(sz, -sz2, 0);
        Screen3D.setColor(BulletActor.SHAPE_BASE_COLOR_R, BulletActor.SHAPE_BASE_COLOR_G, BulletActor.SHAPE_BASE_COLOR_B, 0.55);
        Screen3D.glVertex3f(sz, sz2, 0);
        Screen3D.glVertex3f(-sz, sz2, 0);
        Screen3D.glEnd();
        break;
      case 4:
        sz = size / 2;
        Screen3D.glDisable(Screen3D.GL_BLEND);
        Screen3D.glBegin(Screen3D.GL_LINE_LOOP);
        Screen3D.glVertex3f(-sz, -sz, 0);
        Screen3D.glVertex3f(sz, -sz, 0);
        Screen3D.glVertex3f(sz, sz, 0);
        Screen3D.glVertex3f(-sz, sz, 0);
        Screen3D.glEnd();
        Screen3D.glEnable(Screen3D.GL_BLEND);
        Screen3D.setColor(r, g, b, 0.7);
        Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
        Screen3D.glVertex3f(-sz, -sz, 0);
        Screen3D.glVertex3f(sz, -sz, 0);
        Screen3D.setColor(BulletActor.SHAPE_BASE_COLOR_R, BulletActor.SHAPE_BASE_COLOR_G, BulletActor.SHAPE_BASE_COLOR_B, 0.55);
        Screen3D.glVertex3f(sz, sz, 0);
        Screen3D.glVertex3f(-sz, sz, 0);
        Screen3D.glEnd();
        break;
      case 5:
        sz = size / 2;
        Screen3D.glDisable(Screen3D.GL_BLEND);
        Screen3D.glBegin(Screen3D.GL_LINE_LOOP);
        Screen3D.glVertex3f(-sz / 2, -sz, 0);
        Screen3D.glVertex3f(sz / 2, -sz, 0);
        Screen3D.glVertex3f(sz, -sz / 2, 0);
        Screen3D.glVertex3f(sz, sz / 2, 0);
        Screen3D.glVertex3f(sz / 2, sz, 0);
        Screen3D.glVertex3f(-sz / 2, sz, 0);
        Screen3D.glVertex3f(-sz, sz / 2, 0);
        Screen3D.glVertex3f(-sz, -sz / 2, 0);
        Screen3D.glEnd();
        Screen3D.glEnable(Screen3D.GL_BLEND);
        Screen3D.setColor(r, g, b, 0.85);
        Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
        Screen3D.glVertex3f(-sz / 2, -sz, 0);
        Screen3D.glVertex3f(sz / 2, -sz, 0);
        Screen3D.glVertex3f(sz, -sz / 2, 0);
        Screen3D.glVertex3f(sz, sz / 2, 0);
        Screen3D.setColor(BulletActor.SHAPE_BASE_COLOR_R, BulletActor.SHAPE_BASE_COLOR_G, BulletActor.SHAPE_BASE_COLOR_B, 0.55);
        Screen3D.glVertex3f(sz / 2, sz, 0);
        Screen3D.glVertex3f(-sz / 2, sz, 0);
        Screen3D.glVertex3f(-sz, sz / 2, 0);
        Screen3D.glVertex3f(-sz, -sz / 2, 0);
        Screen3D.glEnd();
        break;
      case 6:
        sz = (size * 2) / 3;
        sz2 = size / 5;
        Screen3D.glDisable(Screen3D.GL_BLEND);
        Screen3D.glBegin(Screen3D.GL_LINE_STRIP);
        Screen3D.glVertex3f(-sz, -sz + sz2, 0);
        Screen3D.glVertex3f(0, sz + sz2, 0);
        Screen3D.glVertex3f(sz, -sz + sz2, 0);
        Screen3D.glEnd();
        Screen3D.glEnable(Screen3D.GL_BLEND);
        Screen3D.setColor(r, g, b, 0.55);
        Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
        Screen3D.glVertex3f(-sz, -sz + sz2, 0);
        Screen3D.glVertex3f(sz, -sz + sz2, 0);
        Screen3D.setColor(BulletActor.SHAPE_BASE_COLOR_R, BulletActor.SHAPE_BASE_COLOR_G, BulletActor.SHAPE_BASE_COLOR_B, 0.55);
        Screen3D.glVertex3f(0, sz + sz2, 0);
        Screen3D.glEnd();
        break;
      case 7:
        sz = size / 2;
        Screen3D.glDisable(Screen3D.GL_BLEND);
        Screen3D.glBegin(Screen3D.GL_LINE_LOOP);
        Screen3D.glVertex3f(-sz, -sz, 0);
        Screen3D.glVertex3f(0, -sz, 0);
        Screen3D.glVertex3f(sz, 0, 0);
        Screen3D.glVertex3f(sz, sz, 0);
        Screen3D.glVertex3f(0, sz, 0);
        Screen3D.glVertex3f(-sz, 0, 0);
        Screen3D.glEnd();
        Screen3D.glEnable(Screen3D.GL_BLEND);
        Screen3D.setColor(r, g, b, 0.85);
        Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
        Screen3D.glVertex3f(-sz, -sz, 0);
        Screen3D.glVertex3f(0, -sz, 0);
        Screen3D.glVertex3f(sz, 0, 0);
        Screen3D.setColor(BulletActor.SHAPE_BASE_COLOR_R, BulletActor.SHAPE_BASE_COLOR_G, BulletActor.SHAPE_BASE_COLOR_B, 0.55);
        Screen3D.glVertex3f(sz, sz, 0);
        Screen3D.glVertex3f(0, sz, 0);
        Screen3D.glVertex3f(-sz, 0, 0);
        Screen3D.glEnd();
        break;
    }
  }

  public static deleteDisplayLists(): void {
    if (!BulletActor.displayList) {
      return;
    }
    BulletActor.displayList.close();
    BulletActor.displayList = null;
  }
}

export class BulletActorInitializer {
  public constructor(
    public readonly field: Field,
    public readonly ship: Ship,
  ) {}
}
