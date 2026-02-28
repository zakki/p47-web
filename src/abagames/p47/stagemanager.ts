import { Music } from "../util/sdl/sound";
import { Rand } from "../util/rand";
import { Vector } from "../util/vector";
import type { BulletMLParserAsset } from "../util/bulletml/runtime";
import { BarrageManager } from "./barragemanager";
import { Enemy } from "./enemy";
import { EnemyType } from "./enemytype";
import { Field } from "./field";
import type { P47GameManager } from "./gamemanager";
import { SoundManager } from "./soundmanager";

function truncTowardZero(v: number): number {
  return v < 0 ? Math.ceil(v) : Math.floor(v);
}

type EnemyAppearance = {
  type: EnemyType;
  moveParser: BulletMLParserAsset | null;
  point: number;
  pattern: number;
  sequence: number;
  pos: number;
  num: number;
  interval: number;
  groupInterval: number;
  cnt: number;
  left: number;
  side: number;
};

/**
 * Manage the stage data(enemies' appearance).
 */
export class StageManager {
  // Appearance point.
  private static readonly TOP = 0;
  private static readonly SIDE = 1;
  private static readonly BACK = 2;

  // Appearance pattern.
  private static readonly ONE_SIDE = 0;
  private static readonly ALTERNATE = 1;
  private static readonly BOTH_SIDES = 2;

  // Appearance position is fixed or not.
  private static readonly RANDOM = 0;
  private static readonly FIXED = 1;

  // Enemy type.
  private static readonly SMALL = 0;
  private static readonly MIDDLE = 1;
  private static readonly LARGE = 2;

  public static readonly STAGE_TYPE_NUM = 4;

  public parsec = 0;
  public bossSection = false;

  private gameManager!: P47GameManager;
  private barrageManager!: BarrageManager;
  private field!: Field;
  private rand!: Rand;

  private readonly SIMULTANEOUS_APPEARNCE_MAX = 4;
  private appearance: EnemyAppearance[] = [];

  private readonly SMALL_ENEMY_TYPE_MAX = 3;
  private smallType: EnemyType[] = [];

  private readonly MIDDLE_ENEMY_TYPE_MAX = 4;
  private middleType: EnemyType[] = [];

  private readonly LARGE_ENEMY_TYPE_MAX = 2;
  private largeType: EnemyType[] = [];

  private middleBossType!: EnemyType;
  private largeBossType!: EnemyType;

  private apNum = 0;
  private apos!: Vector;
  private sectionCnt = 0;
  private sectionIntervalCnt = 0;
  private section = 0;
  private rank = 0;
  private rankInc = 0;
  private middleRushSectionNum = 0;
  private middleRushSection = false;
  private stageType = 0;

  // [#smalltype, #middletype, #largetype]
  private readonly MIDDLE_RUSH_SECTION_PATTERN = 6;
  private readonly apparancePattern = [
    [
      [1, 0, 0],
      [2, 0, 0],
      [1, 1, 0],
      [1, 0, 1],
      [2, 1, 0],
      [2, 0, 1],
      [0, 1, 1],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 0],
      [1, 0, 1],
      [2, 1, 0],
      [1, 1, 1],
      [0, 1, 1],
    ],
  ] as const;

  public init(gameManager: P47GameManager, barrageManager: BarrageManager, field: Field): void {
    this.gameManager = gameManager;
    this.barrageManager = barrageManager;
    this.field = field;
    this.rand = new Rand();
    this.apos = new Vector();

    this.smallType = Array.from({ length: this.SMALL_ENEMY_TYPE_MAX }, () => new EnemyType());
    this.middleType = Array.from({ length: this.MIDDLE_ENEMY_TYPE_MAX }, () => new EnemyType());
    this.largeType = Array.from({ length: this.LARGE_ENEMY_TYPE_MAX }, () => new EnemyType());
    this.middleBossType = new EnemyType();
    this.largeBossType = new EnemyType();

    this.appearance = Array.from({ length: this.SIMULTANEOUS_APPEARNCE_MAX }, () => ({
      type: this.smallType[0],
      moveParser: null,
      point: StageManager.TOP,
      pattern: StageManager.ALTERNATE,
      sequence: StageManager.RANDOM,
      pos: 0,
      num: 0,
      interval: 0,
      groupInterval: 0,
      cnt: 0,
      left: 0,
      side: 1,
    }));
  }

  public close(): void {}

  public setRank(baseRank: number, inc: number, startParsec: number, type: number): void {
    this.rank = baseRank;
    this.rankInc = inc;
    this.rank += this.rankInc * truncTowardZero(startParsec / 10);
    this.section = -1;
    this.parsec = startParsec - 1;
    this.stageType = type;
    this.createStage();
    this.gotoNextSection();
  }

  public move(): void {
    for (let i = 0; i < this.apNum; i++) {
      const ap = this.appearance[i];
      ap.cnt--;
      if (ap.cnt > 0) {
        // Add the extra enemy.
        if (!this.middleRushSection) {
          if (ap.type.type === EnemyType.SMALL && !EnemyType.isExist[ap.type.id]) {
            ap.cnt = 0;
            EnemyType.isExist[ap.type.id] = true;
          }
        } else if (ap.type.type === EnemyType.MIDDLE && !EnemyType.isExist[ap.type.id]) {
          ap.cnt = 0;
          EnemyType.isExist[ap.type.id] = true;
        }
        continue;
      }

      let p = 0;
      switch (ap.sequence) {
        case StageManager.RANDOM:
          p = this.rand.nextFloat(1);
          break;
        case StageManager.FIXED:
          p = ap.pos;
          break;
        default:
          break;
      }

      let d = 0;
      switch (ap.point) {
        case StageManager.TOP:
          switch (ap.pattern) {
            case StageManager.BOTH_SIDES:
              this.apos.x = (p - 0.5) * this.field.size.x * 1.8;
              break;
            default:
              this.apos.x = (p * 0.6 + 0.2) * this.field.size.x * ap.side;
              break;
          }
          this.apos.y = this.field.size.y - Enemy.FIELD_SPACE;
          d = Math.PI;
          break;
        case StageManager.BACK:
          switch (ap.pattern) {
            case StageManager.BOTH_SIDES:
              this.apos.x = (p - 0.5) * this.field.size.x * 1.8;
              break;
            default:
              this.apos.x = (p * 0.6 + 0.2) * this.field.size.x * ap.side;
              break;
          }
          this.apos.y = -this.field.size.y + Enemy.FIELD_SPACE;
          d = 0;
          break;
        case StageManager.SIDE:
          switch (ap.pattern) {
            case StageManager.BOTH_SIDES:
              this.apos.x = (this.field.size.x - Enemy.FIELD_SPACE) * (this.rand.nextInt(2) * 2 - 1);
              break;
            default:
              this.apos.x = (this.field.size.x - Enemy.FIELD_SPACE) * ap.side;
              break;
          }
          this.apos.y = (p * 0.4 + 0.4) * this.field.size.y;
          if (this.apos.x < 0) {
            d = Math.PI / 2;
          } else {
            d = (Math.PI / 2) * 3;
          }
          break;
        default:
          break;
      }

      this.apos.x *= 0.88;
      if (ap.moveParser) {
        this.gameManager.addEnemy(this.apos, d, ap.type, ap.moveParser);
      }

      ap.left--;
      if (ap.left <= 0) {
        ap.cnt = ap.groupInterval;
        ap.left = ap.num;
        if (ap.pattern !== StageManager.ONE_SIDE) {
          ap.side *= -1;
        }
        ap.pos = this.rand.nextFloat(1);
      } else {
        ap.cnt = ap.interval;
      }
    }

    if (!this.bossSection || (!EnemyType.isExist[this.middleBossType.id] && !EnemyType.isExist[this.largeBossType.id])) {
      this.sectionCnt--;
    }

    if (this.sectionCnt < this.sectionIntervalCnt) {
      if (this.section === 9 && this.sectionCnt === this.sectionIntervalCnt - 1) {
        Music.fadeMusic();
      }
      this.apNum = 0;
      if (this.sectionCnt <= 0) {
        this.gotoNextSection();
      }
    }

    EnemyType.clearIsExistList();
  }

  private createEnemyData(): void {
    for (let i = 0; i < this.smallType.length; i++) {
      this.smallType[i].setSmallEnemyType(this.rank, this.gameManager.mode);
    }
    for (let i = 0; i < this.middleType.length; i++) {
      this.middleType[i].setMiddleEnemyType(this.rank, this.gameManager.mode);
    }
    for (let i = 0; i < this.largeType.length; i++) {
      this.largeType[i].setLargeEnemyType(this.rank, this.gameManager.mode);
    }
    this.middleBossType.setMiddleBossEnemyType(this.rank, this.gameManager.mode);
    this.largeBossType.setLargeBossEnemyType(this.rank, this.gameManager.mode);
  }

  private setAppearancePattern(ap: EnemyAppearance): void {
    switch (this.rand.nextInt(5)) {
      case 0:
        ap.pattern = StageManager.ONE_SIDE;
        break;
      case 1:
      case 2:
        ap.pattern = StageManager.ALTERNATE;
        break;
      case 3:
      case 4:
        ap.pattern = StageManager.BOTH_SIDES;
        break;
      default:
        break;
    }

    switch (this.rand.nextInt(3)) {
      case 0:
        ap.sequence = StageManager.RANDOM;
        break;
      case 1:
      case 2:
        ap.sequence = StageManager.FIXED;
        break;
      default:
        break;
    }
  }

  private getParser(mt: number): BulletMLParserAsset | null {
    const pn = this.barrageManager.parserNum[mt] ?? 0;
    if (pn <= 0) {
      // parser が 0 件のときは XML 欠落やロード失敗が疑われるため安全に出現を抑止する。
      return null;
    }
    return this.barrageManager.parser[mt][this.rand.nextInt(pn)] ?? null;
  }

  private setSmallAppearance(ap: EnemyAppearance): void {
    ap.type = this.smallType[this.rand.nextInt(this.smallType.length)];
    let mt = 0;
    if (this.rand.nextFloat(1) > 0.2) {
      ap.point = StageManager.TOP;
      mt = BarrageManager.SMALLMOVE;
    } else {
      ap.point = StageManager.SIDE;
      mt = BarrageManager.SMALLSIDEMOVE;
    }
    ap.moveParser = this.getParser(mt);
    this.setAppearancePattern(ap);
    if (ap.pattern === StageManager.ONE_SIDE) {
      ap.pattern = StageManager.ALTERNATE;
    }
    switch (this.rand.nextInt(4)) {
      case 0:
        ap.num = 7 + this.rand.nextInt(5);
        ap.groupInterval = 72 + this.rand.nextInt(15);
        ap.interval = 15 + this.rand.nextInt(5);
        break;
      case 1:
        ap.num = 5 + this.rand.nextInt(3);
        ap.groupInterval = 56 + this.rand.nextInt(10);
        ap.interval = 20 + this.rand.nextInt(5);
        break;
      case 2:
      case 3:
        ap.num = 2 + this.rand.nextInt(2);
        ap.groupInterval = 45 + this.rand.nextInt(20);
        ap.interval = 25 + this.rand.nextInt(5);
        break;
      default:
        break;
    }
  }

  private setMiddleAppearance(ap: EnemyAppearance): void {
    ap.type = this.middleType[this.rand.nextInt(this.middleType.length)];
    const mt = BarrageManager.MIDDLEMOVE;
    ap.point = StageManager.TOP;
    ap.moveParser = this.getParser(mt);
    this.setAppearancePattern(ap);
    switch (this.rand.nextInt(3)) {
      case 0:
        ap.num = 4;
        ap.groupInterval = 240 + this.rand.nextInt(150);
        ap.interval = 80 + this.rand.nextInt(30);
        break;
      case 1:
        ap.num = 2;
        ap.groupInterval = 180 + this.rand.nextInt(60);
        ap.interval = 180 + this.rand.nextInt(20);
        break;
      case 2:
        ap.num = 1;
        ap.groupInterval = 150 + this.rand.nextInt(50);
        ap.interval = 100;
        break;
      default:
        break;
    }
  }

  private setLargeAppearance(ap: EnemyAppearance): void {
    ap.type = this.largeType[this.rand.nextInt(this.largeType.length)];
    const mt = BarrageManager.LARGEMOVE;
    ap.point = StageManager.TOP;
    ap.moveParser = this.getParser(mt);
    this.setAppearancePattern(ap);
    switch (this.rand.nextInt(3)) {
      case 0:
        ap.num = 3;
        ap.groupInterval = 400 + this.rand.nextInt(100);
        ap.interval = 240 + this.rand.nextInt(40);
        break;
      case 1:
        ap.num = 2;
        ap.groupInterval = 400 + this.rand.nextInt(60);
        ap.interval = 300 + this.rand.nextInt(20);
        break;
      case 2:
        ap.num = 1;
        ap.groupInterval = 270 + this.rand.nextInt(50);
        ap.interval = 200;
        break;
      default:
        break;
    }
  }

  private setAppearance(ap: EnemyAppearance, type: number): void {
    switch (type) {
      case StageManager.SMALL:
        this.setSmallAppearance(ap);
        break;
      case StageManager.MIDDLE:
        this.setMiddleAppearance(ap);
        break;
      case StageManager.LARGE:
        this.setLargeAppearance(ap);
        break;
      default:
        break;
    }
    ap.cnt = 0;
    ap.left = ap.num;
    ap.side = this.rand.nextInt(2) * 2 - 1;
    ap.pos = this.rand.nextFloat(1);
  }

  private createSectionData(): void {
    this.apNum = 0;
    if (this.rank <= 0) {
      return;
    }

    this.field.aimSpeed = 0.1 + this.section * 0.02;
    if (this.section === 4) {
      // Set the middle boss.
      const pos = new Vector();
      pos.x = 0;
      pos.y = (this.field.size.y / 4) * 3;
      this.gameManager.addBoss(pos, Math.PI, this.middleBossType);
      this.bossSection = true;
      this.sectionIntervalCnt = this.sectionCnt = 2 * 60;
      this.field.aimZ = 11;
      return;
    }
    if (this.section === 9) {
      // Set the large boss.
      const pos = new Vector();
      pos.x = 0;
      pos.y = (this.field.size.y / 4) * 3;
      this.gameManager.addBoss(pos, Math.PI, this.largeBossType);
      this.bossSection = true;
      this.sectionIntervalCnt = this.sectionCnt = 3 * 60;
      this.field.aimZ = 12;
      return;
    }
    if (this.section === this.middleRushSectionNum) {
      // In this section, no small enemy.
      this.middleRushSection = true;
      this.field.aimZ = 9;
    } else {
      this.middleRushSection = false;
      this.field.aimZ = 10 + this.rand.nextSignedFloat(0.3);
    }

    this.bossSection = false;
    if (this.section === 3) {
      this.sectionIntervalCnt = 2 * 60;
    } else if (this.section === 3) {
      this.sectionIntervalCnt = 4 * 60;
    } else {
      this.sectionIntervalCnt = 1 * 60;
    }
    this.sectionCnt = this.sectionIntervalCnt + 10 * 60;

    const sp = truncTowardZero((this.section * 3) / 7) + 1;
    const ep = 3 + truncTowardZero((this.section * 3) / 10);
    let ap = sp + this.rand.nextInt(ep - sp + 1);
    if (this.section === 0) {
      ap = 0;
    } else if (this.middleRushSection) {
      ap = this.MIDDLE_RUSH_SECTION_PATTERN;
    }

    const modePattern = this.apparancePattern[this.gameManager.mode] ?? this.apparancePattern[0];
    const sectionPattern = modePattern[ap] ?? modePattern[0];

    for (let i = 0; i < sectionPattern[0]; i++, this.apNum++) {
      this.setAppearance(this.appearance[this.apNum], StageManager.SMALL);
    }
    for (let i = 0; i < sectionPattern[1]; i++, this.apNum++) {
      this.setAppearance(this.appearance[this.apNum], StageManager.MIDDLE);
    }
    for (let i = 0; i < sectionPattern[2]; i++, this.apNum++) {
      this.setAppearance(this.appearance[this.apNum], StageManager.LARGE);
    }
  }

  private createStage(): void {
    this.createEnemyData();
    this.middleRushSectionNum = 2 + this.rand.nextInt(6);
    if (this.middleRushSectionNum <= 4) {
      this.middleRushSectionNum++;
    }
    this.field.setType(this.stageType % Field.TYPE_NUM);
    SoundManager.playBgm(this.stageType % SoundManager.BGM_NUM);
    this.stageType++;
  }

  private gotoNextSection(): void {
    this.section++;
    this.parsec++;

    const managerClass = this.gameManager.constructor as { TITLE?: number };
    const titleState = managerClass.TITLE ?? 0;
    if (this.gameManager.state === titleState && this.section >= 4) {
      this.section = 0;
      this.parsec -= 4;
    }

    if (this.section >= 10) {
      this.section = 0;
      this.rank += this.rankInc;
      this.createStage();
    }

    this.createSectionData();
  }
}
