import { Rand } from "../util/rand";
import { Vector } from "../util/vector";
import { BarrageManager } from "./barragemanager";
import { MorphBullet } from "./morphbullet";
import type { BulletMLParserAsset } from "../util/bulletml/runtime";

function truncTowardZero(v: number): number {
  return v < 0 ? Math.ceil(v) : Math.floor(v);
}

/**
 * Barrage pattern.
 */
export class Barrage {
  public parser: BulletMLParserAsset | null = null;
  public morphParser: Array<BulletMLParserAsset | null>;
  public morphNum = 0;
  public morphCnt = 0;
  public rank = 0;
  public speedRank = 0;
  public morphRank = 0;
  public shape = 0;
  public color = 0;
  public bulletSize = 0;
  public xReverse = 1;

  public constructor() {
    this.morphParser = Array.from({ length: MorphBullet.MORPH_MAX }, () => null);
  }
}

/**
 * Enemys' wing with batteries.
 */
export class BatteryType {
  public static readonly WING_SHAPE_POINT_NUM = 3;
  public static readonly WING_BATTERY_MAX = 3;
  public static readonly BARRAGE_PATTERN_MAX = 8;

  public wingShapePos: Vector[];
  public collisionPos: Vector;
  public collisionSize: Vector;
  public batteryPos: Vector[];
  public batteryNum = 0;
  public r = 0;
  public g = 0;
  public b = 0;
  public barrage: Barrage[];
  public xReverseAlternate = false;
  public shield = 0;

  public constructor() {
    this.barrage = Array.from({ length: BatteryType.BARRAGE_PATTERN_MAX }, () => new Barrage());
    this.wingShapePos = Array.from({ length: BatteryType.WING_SHAPE_POINT_NUM }, () => new Vector());
    this.collisionPos = new Vector();
    this.collisionSize = new Vector();
    this.batteryPos = Array.from({ length: BatteryType.WING_BATTERY_MAX }, () => new Vector());
  }
}

/**
 * Enemys' specifications.
 */
export class EnemyType {
  public static readonly BARRAGE_PATTERN_MAX = BatteryType.BARRAGE_PATTERN_MAX;
  public static readonly BODY_SHAPE_POINT_NUM = 4;
  public static readonly BATTERY_MAX = 4;
  public static readonly ENEMY_TYPE_MAX = 32;
  public static readonly BULLET_SHAPE_NUM = 7;
  public static readonly BULLET_COLOR_NUM = 4;

  public static readonly SMALL = 0;
  public static readonly MIDDLE = 1;
  public static readonly LARGE = 2;
  public static readonly MIDDLEBOSS = 3;
  public static readonly LARGEBOSS = 4;

  public static readonly ROLL = 0;
  public static readonly LOCK = 1;

  public static isExist: boolean[] = Array.from({ length: EnemyType.ENEMY_TYPE_MAX }, () => false);

  public barrage: Barrage[];
  public bodyShapePos: Vector[];
  public collisionSize: Vector;
  public wingCollision = false;
  public r = 0;
  public g = 0;
  public b = 0;
  public retroSize = 0;
  public batteryType: BatteryType[];
  public batteryNum = 0;
  public shield = 0;
  public fireInterval = 0;
  public firePeriod = 0;
  public barragePatternNum = 0;
  public id: number;
  public type = EnemyType.SMALL;

  private static rand: Rand | null = null;
  private static barrageManager: BarrageManager | null = null;
  private static idCnt = 0;
  private static usedMorphParser: boolean[] = [];

  private static readonly NORMAL = 0;
  private static readonly WEAK = 1;
  private static readonly VERYWEAK = 2;
  private static readonly MORPHWEAK = 3;

  private static readonly enemySize = [
    [0.3, 0.3, 0.3, 0.1, 0.1, 1.0, 0.4, 0.6, 0.9],
    [0.4, 0.2, 0.4, 0.1, 0.15, 2.2, 0.2, 1.6, 1.0],
    [0.6, 0.3, 0.5, 0.1, 0.2, 3.0, 0.3, 1.4, 1.2],
    [0.9, 0.3, 0.7, 0.2, 0.25, 5.0, 0.6, 3.0, 1.5],
    [1.2, 0.2, 0.9, 0.1, 0.3, 7.0, 0.8, 4.5, 1.5],
  ] as const;

  private er = 1;
  private eg = 1;
  private eb = 1;
  private ect = 0;

  public static init(manager: BarrageManager): void {
    EnemyType.rand = new Rand();
    EnemyType.barrageManager = manager;
    EnemyType.idCnt = 0;
    EnemyType.usedMorphParser = Array.from({ length: manager.BARRAGE_MAX }, () => false);
  }

  public static clearIsExistList(): void {
    for (let i = 0; i < EnemyType.idCnt; i++) {
      EnemyType.isExist[i] = false;
    }
  }

  public constructor() {
    this.bodyShapePos = Array.from({ length: EnemyType.BODY_SHAPE_POINT_NUM }, () => new Vector());
    this.collisionSize = new Vector();
    this.barrage = Array.from({ length: EnemyType.BARRAGE_PATTERN_MAX }, () => new Barrage());
    this.batteryType = Array.from({ length: EnemyType.BATTERY_MAX }, () => new BatteryType());
    if (EnemyType.idCnt >= EnemyType.ENEMY_TYPE_MAX) {
      throw new Error("EnemyType id overflow");
    }
    this.id = EnemyType.idCnt;
    EnemyType.idCnt++;
  }

  private static requireRand(): Rand {
    if (!EnemyType.rand) {
      throw new Error("EnemyType.init() must be called before creating enemy types.");
    }
    return EnemyType.rand;
  }

  private static requireBarrageManager(): BarrageManager {
    if (!EnemyType.barrageManager) {
      throw new Error("EnemyType.init() must be called before creating enemy types.");
    }
    return EnemyType.barrageManager;
  }

  private getParser(btn: number, idx: number): BulletMLParserAsset {
    const manager = EnemyType.requireBarrageManager();
    const parser = manager.parser[btn]?.[idx] ?? null;
    if (!parser) {
      throw new Error(`Missing barrage parser type=${btn} idx=${idx}`);
    }
    return parser;
  }

  private setBarrageType(br: Barrage, btn: number, mode: number): void {
    const rand = EnemyType.requireRand();
    const manager = EnemyType.requireBarrageManager();

    br.parser = this.getParser(btn, rand.nextInt(manager.parserNum[btn]));
    EnemyType.usedMorphParser.fill(false);

    const mpn =
      mode === EnemyType.ROLL
        ? manager.parserNum[BarrageManager.MORPH]
        : manager.parserNum[BarrageManager.MORPH_LOCK];

    for (let i = 0; i < br.morphParser.length; i++) {
      let mi = rand.nextInt(mpn);
      for (let j = 0; j < mpn; j++) {
        if (!EnemyType.usedMorphParser[mi]) {
          break;
        }
        mi++;
        if (mi >= mpn) {
          mi = 0;
        }
      }
      br.morphParser[i] =
        mode === EnemyType.ROLL
          ? this.getParser(BarrageManager.MORPH, mi)
          : this.getParser(BarrageManager.MORPH_LOCK, mi);
      EnemyType.usedMorphParser[mi] = true;
    }
    br.morphNum = br.morphParser.length;
  }

  private setBarrageRank(br: Barrage, rank: number, intense: number, mode: number): void {
    const rand = EnemyType.requireRand();
    if (rank <= 0) {
      br.rank = 0;
      return;
    }
    br.rank = Math.sqrt(rank) / (8 - rand.nextInt(3));
    if (br.rank > 0.8) {
      br.rank = rand.nextFloat(0.2) + 0.8;
    }
    rank /= br.rank + 2;
    if (intense === EnemyType.WEAK) {
      br.rank /= 2;
    }
    if (mode === EnemyType.ROLL) {
      br.speedRank = Math.sqrt(rank) * (rand.nextFloat(0.2) + 1);
    } else {
      br.speedRank = Math.sqrt(rank * 0.66) * (rand.nextFloat(0.2) + 0.8);
    }
    if (br.speedRank < 1) {
      br.speedRank = 1;
    }
    if (br.speedRank > 2) {
      br.speedRank = Math.sqrt(br.speedRank) + 0.27;
    }
    br.morphRank = rank / br.speedRank;
    br.morphCnt = 0;
    while (br.morphRank > 1) {
      br.morphCnt++;
      br.morphRank /= 3;
    }
    if (intense === EnemyType.VERYWEAK) {
      br.morphRank /= 2;
      br.morphCnt = truncTowardZero(br.morphCnt / 1.7);
    } else if (intense === EnemyType.MORPHWEAK) {
      br.morphRank /= 2;
    } else if (intense === EnemyType.WEAK) {
      br.morphRank /= 1.5;
    }
  }

  private setBarrageRankSlow(
    br: Barrage,
    rank: number,
    intense: number,
    mode: number,
    slow: number,
  ): void {
    this.setBarrageRank(br, rank, intense, mode);
    br.speedRank *= slow;
  }

  private setBarrageShape(br: Barrage, size: number): void {
    const rand = EnemyType.requireRand();
    br.shape = rand.nextInt(EnemyType.BULLET_SHAPE_NUM);
    br.color = rand.nextInt(EnemyType.BULLET_COLOR_NUM);
    br.bulletSize = (1.0 + rand.nextSignedFloat(0.1)) * size;
  }

  private setEnemyColorType(): void {
    const rand = EnemyType.requireRand();
    this.ect = rand.nextInt(3);
  }

  private createEnemyColor(): void {
    const rand = EnemyType.requireRand();
    switch (this.ect) {
      case 0:
        this.er = 1;
        this.eg = rand.nextFloat(0.7) + 0.3;
        this.eb = rand.nextFloat(0.7) + 0.3;
        break;
      case 1:
        this.er = rand.nextFloat(0.7) + 0.3;
        this.eg = 1;
        this.eb = rand.nextFloat(0.7) + 0.3;
        break;
      case 2:
        this.er = rand.nextFloat(0.7) + 0.3;
        this.eg = rand.nextFloat(0.7) + 0.3;
        this.eb = 1;
        break;
    }
  }

  // Set the shape of the BatteryType.
  private setEnemyShapeAndWings(size: number): void {
    const rand = EnemyType.requireRand();
    this.createEnemyColor();
    this.r = this.er;
    this.g = this.eg;
    this.b = this.eb;

    const x1 = EnemyType.enemySize[size][0] + rand.nextSignedFloat(EnemyType.enemySize[size][1]);
    const y1 = EnemyType.enemySize[size][2] + rand.nextSignedFloat(EnemyType.enemySize[size][3]);
    const x2 = EnemyType.enemySize[size][0] + rand.nextSignedFloat(EnemyType.enemySize[size][1]);
    const y2 = EnemyType.enemySize[size][2] + rand.nextSignedFloat(EnemyType.enemySize[size][3]);

    this.bodyShapePos[0].x = -x1;
    this.bodyShapePos[0].y = y1;
    this.bodyShapePos[1].x = x1;
    this.bodyShapePos[1].y = y1;
    this.bodyShapePos[2].x = x2;
    this.bodyShapePos[2].y = -y2;
    this.bodyShapePos[3].x = -x2;
    this.bodyShapePos[3].y = -y2;
    this.retroSize = EnemyType.enemySize[size][4];

    switch (size) {
      case EnemyType.SMALL:
      case EnemyType.MIDDLE:
      case EnemyType.MIDDLEBOSS:
        this.batteryNum = 2;
        break;
      case EnemyType.LARGE:
      case EnemyType.LARGEBOSS:
        this.batteryNum = 4;
        break;
    }

    let px = 0;
    let py = 0;
    let mpx = 0;
    let mpy = 0;
    let bsl = 0;
    this.collisionSize.x = x1 > x2 ? x1 : x2;
    this.collisionSize.y = y1 > y2 ? y1 : y2;

    for (let i = 0; i < this.batteryNum; i++) {
      const bt = this.batteryType[i];
      let wrl = 1;
      if (i % 2 === 0) {
        px = EnemyType.enemySize[size][5] + rand.nextFloat(EnemyType.enemySize[size][6]);
        if (this.batteryNum <= 2) {
          py = rand.nextSignedFloat(EnemyType.enemySize[size][7]);
        } else if (i < 2) {
          py =
            rand.nextFloat(EnemyType.enemySize[size][7] / 2) + EnemyType.enemySize[size][7] / 2;
        } else {
          py =
            -rand.nextFloat(EnemyType.enemySize[size][7] / 2) - EnemyType.enemySize[size][7] / 2;
        }

        let md = 0;
        if (rand.nextInt(2) === 0) {
          md = rand.nextFloat(Math.PI / 2) - Math.PI / 4;
        } else {
          md = rand.nextFloat(Math.PI / 2) + (Math.PI / 4) * 3;
        }
        mpx =
          px / 2 +
          Math.sin(md) *
            (EnemyType.enemySize[size][8] / 2 + rand.nextFloat(EnemyType.enemySize[size][8] / 2));
        mpy =
          py / 2 +
          Math.cos(md) *
            (EnemyType.enemySize[size][8] / 2 + rand.nextFloat(EnemyType.enemySize[size][8] / 2));

        switch (size) {
          case EnemyType.SMALL:
          case EnemyType.MIDDLE:
          case EnemyType.LARGE:
            bsl = 1;
            break;
          case EnemyType.MIDDLEBOSS:
            bsl = 150 + rand.nextInt(30);
            break;
          case EnemyType.LARGEBOSS:
            bsl = 200 + rand.nextInt(50);
            break;
        }
        this.createEnemyColor();
        wrl = -1;

        if (!this.wingCollision) {
          if (px > this.collisionSize.x) {
            this.collisionSize.x = px;
          }
          let cpy = Math.abs(py);
          if (cpy > this.collisionSize.y) {
            this.collisionSize.y = cpy;
          }
          cpy = Math.abs(mpy);
          if (cpy > this.collisionSize.y) {
            this.collisionSize.y = cpy;
          }
        }
      }

      bt.wingShapePos[0].x = (px / 4) * wrl;
      bt.wingShapePos[0].y = py / 4;
      bt.wingShapePos[1].x = px * wrl;
      bt.wingShapePos[1].y = py;
      bt.wingShapePos[2].x = mpx * wrl;
      bt.wingShapePos[2].y = mpy;
      bt.collisionPos.x = ((px + px / 4) / 2) * wrl;
      bt.collisionPos.y = (py + mpy + py / 4) / 3;
      bt.collisionSize.x = (((px / 4) * 3) / 2) * 1;
      const sy1 = Math.abs(py - mpy) / 2;
      const sy2 = Math.abs(py - py / 4) / 2;
      bt.collisionSize.y = sy1 > sy2 ? sy1 : sy2;
      bt.r = this.er;
      bt.g = this.eg;
      bt.b = this.eb;
      bt.shield = bsl;
    }
  }

  // Set the barrage of the BatteryType.
  private setBattery(
    rank: number,
    n: number,
    barrageType: number,
    barrageIntense: number,
    idx: number,
    ptnIdx: number,
    slow: number,
    mode: number,
  ): void {
    const rand = EnemyType.requireRand();
    const bt = this.batteryType[idx];
    const bt2 = this.batteryType[idx + 1];
    const br = bt.barrage[ptnIdx];
    const br2 = bt2.barrage[ptnIdx];

    this.setBarrageType(br, barrageType, mode);
    this.setBarrageRankSlow(br, rank / n, barrageIntense, mode, slow);
    this.setBarrageShape(br, 0.8);
    br.xReverse = rand.nextInt(2) * 2 - 1;

    br2.parser = br.parser;
    for (let i = 0; i < MorphBullet.MORPH_MAX; i++) {
      br2.morphParser[i] = br.morphParser[i];
    }
    br2.morphNum = br.morphNum;
    br2.morphCnt = br.morphCnt;
    br2.rank = br.rank;
    br2.speedRank = br.speedRank;
    br2.morphRank = br.morphRank;
    br2.shape = br.shape;
    br2.color = br.color;
    br2.bulletSize = br.bulletSize;
    br2.xReverse = -br.xReverse;

    if (rand.nextInt(4) === 0) {
      bt.xReverseAlternate = true;
      bt2.xReverseAlternate = true;
    } else {
      bt.xReverseAlternate = false;
      bt2.xReverseAlternate = false;
    }

    let px = bt.wingShapePos[1].x;
    let py = bt.wingShapePos[1].y;
    const mpx = bt.wingShapePos[2].x;
    const mpy = bt.wingShapePos[2].y;
    for (let i = 0; i < n; i++) {
      bt.batteryPos[i].x = px;
      bt.batteryPos[i].y = py;
      bt2.batteryPos[i].x = -px;
      bt2.batteryPos[i].y = py;
      px += (mpx - px) / (n - 1);
      py += (mpy - py) / (n - 1);
    }
    bt.batteryNum = n;
    bt2.batteryNum = n;
  }

  public setSmallEnemyType(rank: number, mode: number): void {
    const rand = EnemyType.requireRand();
    this.type = EnemyType.SMALL;
    this.barragePatternNum = 1;
    this.wingCollision = false;
    this.setEnemyColorType();

    const br = this.barrage[0];
    if (mode === EnemyType.ROLL) {
      this.setBarrageType(br, BarrageManager.SMALL, mode);
    } else {
      this.setBarrageType(br, BarrageManager.SMALL_LOCK, mode);
    }
    this.setBarrageRank(br, rank, EnemyType.VERYWEAK, mode);
    this.setBarrageShape(br, 0.7);
    br.xReverse = rand.nextInt(2) * 2 - 1;

    this.setEnemyShapeAndWings(EnemyType.SMALL);
    this.setBattery(0, 0, 0, EnemyType.NORMAL, 0, 0, 1, mode);
    this.shield = 1;
    this.fireInterval = 99999;
    this.firePeriod = 150 + rand.nextInt(40);
    if (rank < 10) {
      this.firePeriod = truncTowardZero(this.firePeriod / (2 - rank * 0.1));
    }
  }

  public setMiddleEnemyType(rank: number, mode: number): void {
    const rand = EnemyType.requireRand();
    this.type = EnemyType.MIDDLE;
    this.barragePatternNum = 1;
    this.wingCollision = false;
    this.setEnemyColorType();

    const br = this.barrage[0];
    this.setBarrageType(br, BarrageManager.MIDDLE, mode);

    let cr = 0;
    let sr = 0;
    if (mode === EnemyType.ROLL) {
      switch (rand.nextInt(6)) {
        case 0:
        case 1:
          cr = (rank / 3) * 2;
          sr = 0;
          break;
        case 2:
          cr = rank / 4;
          sr = rank / 4;
          break;
        case 3:
        case 4:
        case 5:
          cr = 0;
          sr = rank / 2;
          break;
      }
    } else {
      switch (rand.nextInt(6)) {
        case 0:
        case 1:
          cr = rank / 5;
          sr = rank / 4;
          break;
        case 2:
        case 3:
        case 4:
        case 5:
          cr = 0;
          sr = rank / 2;
          break;
      }
    }
    this.setBarrageRank(br, cr, EnemyType.MORPHWEAK, mode);
    this.setBarrageShape(br, 0.75);
    br.xReverse = rand.nextInt(2) * 2 - 1;
    this.setEnemyShapeAndWings(EnemyType.MIDDLE);
    if (mode === EnemyType.ROLL) {
      this.shield = 40 + rand.nextInt(10);
      this.setBattery(sr, 1, BarrageManager.MIDDLESUB, EnemyType.NORMAL, 0, 0, 1, mode);
      this.fireInterval = 100 + rand.nextInt(60);
      this.firePeriod = truncTowardZero(this.fireInterval / (1.8 + rand.nextFloat(0.7)));
    } else {
      this.shield = 30 + rand.nextInt(8);
      this.setBattery(sr, 1, BarrageManager.MIDDLESUB_LOCK, EnemyType.NORMAL, 0, 0, 1, mode);
      this.fireInterval = 72 + rand.nextInt(30);
      this.firePeriod = truncTowardZero(this.fireInterval / (1.2 + rand.nextFloat(0.2)));
    }
    if (rank < 10) {
      this.firePeriod = truncTowardZero(this.firePeriod / (2 - rank * 0.1));
    }
  }

  public setLargeEnemyType(rank: number, mode: number): void {
    const rand = EnemyType.requireRand();
    this.type = EnemyType.LARGE;
    this.barragePatternNum = 1;
    this.wingCollision = false;
    this.setEnemyColorType();

    const br = this.barrage[0];
    this.setBarrageType(br, BarrageManager.LARGE, mode);

    let cr = 0;
    let sr1 = 0;
    let sr2 = 0;
    if (mode === EnemyType.ROLL) {
      switch (rand.nextInt(9)) {
        case 0:
        case 1:
        case 2:
        case 3:
          cr = rank;
          sr1 = 0;
          sr2 = 0;
          break;
        case 4:
          cr = (rank / 3) * 2;
          sr1 = (rank / 3) * 2;
          sr2 = 0;
          break;
        case 5:
          cr = (rank / 3) * 2;
          sr1 = 0;
          sr2 = (rank / 3) * 2;
          break;
        case 6:
        case 7:
        case 8:
          cr = 0;
          sr1 = (rank / 3) * 2;
          sr2 = (rank / 3) * 2;
          break;
      }
    } else {
      switch (rand.nextInt(9)) {
        case 0:
          cr = (rank / 4) * 3;
          sr1 = 0;
          sr2 = 0;
          break;
        case 1:
        case 2:
          cr = (rank / 4) * 2;
          sr1 = (rank / 3) * 2;
          sr2 = 0;
          break;
        case 3:
        case 4:
          cr = (rank / 4) * 2;
          sr1 = 0;
          sr2 = (rank / 3) * 2;
          break;
        case 5:
        case 6:
        case 7:
        case 8:
          cr = 0;
          sr1 = (rank / 3) * 2;
          sr2 = (rank / 3) * 2;
          break;
      }
    }
    this.setBarrageRank(br, cr, EnemyType.WEAK, mode);
    this.setBarrageShape(br, 0.8);
    br.xReverse = rand.nextInt(2) * 2 - 1;

    this.setEnemyShapeAndWings(EnemyType.LARGE);
    if (mode === EnemyType.ROLL) {
      this.shield = 60 + rand.nextInt(10);
      this.setBattery(sr1, 1, BarrageManager.MIDDLESUB, EnemyType.NORMAL, 0, 0, 1, mode);
      this.setBattery(sr2, 1, BarrageManager.MIDDLESUB, EnemyType.NORMAL, 2, 0, 1, mode);
      this.fireInterval = 150 + rand.nextInt(60);
      this.firePeriod = truncTowardZero(this.fireInterval / (1.3 + rand.nextFloat(0.8)));
    } else {
      this.shield = 45 + rand.nextInt(8);
      this.setBattery(sr1, 1, BarrageManager.MIDDLESUB_LOCK, EnemyType.NORMAL, 0, 0, 1, mode);
      this.setBattery(sr2, 1, BarrageManager.MIDDLESUB_LOCK, EnemyType.NORMAL, 2, 0, 1, mode);
      this.fireInterval = 100 + rand.nextInt(50);
      this.firePeriod = truncTowardZero(this.fireInterval / (1.2 + rand.nextFloat(0.2)));
    }
    if (rank < 10) {
      this.firePeriod = truncTowardZero(this.firePeriod / (2 - rank * 0.1));
    }
  }

  public setMiddleBossEnemyType(rank: number, mode: number): void {
    const rand = EnemyType.requireRand();
    this.type = EnemyType.MIDDLEBOSS;
    this.barragePatternNum = 2 + rand.nextInt(2);
    this.wingCollision = true;
    this.setEnemyColorType();
    const bn = 1 + rand.nextInt(2);

    for (let i = 0; i < this.barragePatternNum; i++) {
      const br = this.barrage[i];
      this.setBarrageType(br, BarrageManager.LARGE, mode);

      let cr = 0;
      let sr = 0;
      switch (rand.nextInt(3)) {
        case 0:
          cr = rank;
          sr = 0;
          break;
        case 1:
          cr = rank / 3;
          sr = rank / 3;
          break;
        case 2:
          cr = 0;
          sr = rank;
          break;
      }
      this.setBarrageRankSlow(br, cr, EnemyType.NORMAL, mode, 0.9);
      this.setBarrageShape(br, 0.9);
      br.xReverse = rand.nextInt(2) * 2 - 1;
      this.setEnemyShapeAndWings(EnemyType.MIDDLEBOSS);
      this.setBattery(sr, bn, BarrageManager.MIDDLE, EnemyType.WEAK, 0, i, 0.9, mode);
    }

    this.shield = 300 + rand.nextInt(50);
    this.fireInterval = 200 + rand.nextInt(40);
    this.firePeriod = truncTowardZero(this.fireInterval / (1.2 + rand.nextFloat(0.4)));
    if (rank < 10) {
      this.firePeriod = truncTowardZero(this.firePeriod / (2 - rank * 0.1));
    }
  }

  public setLargeBossEnemyType(rank: number, mode: number): void {
    const rand = EnemyType.requireRand();
    this.type = EnemyType.LARGEBOSS;
    this.barragePatternNum = 2 + rand.nextInt(3);
    this.wingCollision = true;
    this.setEnemyColorType();
    const bn1 = 1 + rand.nextInt(3);
    const bn2 = 1 + rand.nextInt(3);

    for (let i = 0; i < this.barragePatternNum; i++) {
      const br = this.barrage[i];
      this.setBarrageType(br, BarrageManager.LARGE, mode);

      let cr = 0;
      let sr1 = 0;
      let sr2 = 0;
      switch (rand.nextInt(3)) {
        case 0:
          cr = rank;
          sr1 = 0;
          sr2 = 0;
          break;
        case 1:
          cr = rank / 3;
          sr1 = rank / 3;
          sr2 = 0;
          break;
        case 2:
          cr = rank / 3;
          sr1 = 0;
          sr2 = rank / 3;
          break;
      }
      this.setBarrageRankSlow(br, cr, EnemyType.NORMAL, mode, 0.9);
      this.setBarrageShape(br, 1.0);
      br.xReverse = rand.nextInt(2) * 2 - 1;
      this.setEnemyShapeAndWings(EnemyType.LARGEBOSS);
      this.setBattery(sr1, bn1, BarrageManager.MIDDLE, EnemyType.NORMAL, 0, i, 0.9, mode);
      this.setBattery(sr2, bn2, BarrageManager.MIDDLE, EnemyType.NORMAL, 2, i, 0.9, mode);
    }

    this.shield = 400 + rand.nextInt(50);
    this.fireInterval = 220 + rand.nextInt(60);
    this.firePeriod = truncTowardZero(this.fireInterval / (1.2 + rand.nextFloat(0.3)));
    if (rank < 10) {
      this.firePeriod = truncTowardZero(this.firePeriod / (2 - rank * 0.1));
    }
  }
}
