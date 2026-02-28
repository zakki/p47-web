import { Actor, ActorPool } from "../util/actor";
import { Logger } from "../util/logger";
import { Rand } from "../util/rand";
import { GameManager as BaseGameManager } from "../util/sdl/gamemanager";
import { Music } from "../util/sdl/sound";
import { Pad } from "../util/sdl/pad";
import { Screen3D } from "../util/sdl/screen3d";
import { Vector } from "../util/vector";
import { BarrageManager } from "./barragemanager";
import { Bonus, BonusInitializer } from "./bonus";
import { BulletActor, BulletActorInitializer } from "./bulletactor";
import { BulletActorPool } from "./bulletactorpool";
import { Enemy, EnemyInitializer } from "./enemy";
import { EnemyType } from "./enemytype";
import { Field } from "./field";
import { Fragment, FragmentInitializer } from "./fragment";
import { LetterRender } from "./letterrender";
import { Lock, LockInitializer } from "./lock";
import { LuminousActor } from "./luminousactor";
import { LuminousActorPool } from "./luminousactorpool";
import { P47PrefManager } from "./prefmanager";
import { Roll, RollInitializer } from "./roll";
import { P47Screen } from "./screen";
import { Ship } from "./ship";
import { Shot, ShotInitializer } from "./shot";
import { SoundManager } from "./soundmanager";
import { StageManager } from "./stagemanager";
import { Title } from "./title";
import { Particle, ParticleInitializer } from "./particle";

const SDL_PRESSED = 1;
const SDLK_ESCAPE = 27;
const SDLK_p = 80;
const SDL_VIDEORESIZE = 16;

type BulletMLParserLike = {
  createRunner: () => unknown;
};

type StageManagerLike = StageManager & {
  parsec?: number;
  bossSection?: boolean;
  move?: () => void;
};

type TitleLike = Title & {
  start?: () => void;
  move?: () => void;
  draw?: () => void;
  setStatus?: () => void;
  changeMode?: () => void;
  getStartParsec?: (difficulty: number, parsecSlot: number) => number;
  waitForAssets?: () => Promise<boolean>;
};

type ScreenWithLuminousPass = P47Screen & {
  startRenderToTexture?: () => void;
  endRenderToTexture?: () => void;
  drawLuminous?: () => void;
  viewOrthoFixed?: () => void;
  viewPerspective?: () => void;
};

class NullActor extends Actor {
  public override init(_args: unknown[] | null): void {}
  public override move(): void {}
  public override draw(): void {}
}

class NullLuminousActor extends LuminousActor {
  public override init(_args: unknown[] | null): void {}
  public override move(): void {}
  public override draw(): void {}
  public override drawLuminous(): void {}
}

/**
 * Manage the game status and actor pools.
 */
export class P47GameManager extends BaseGameManager {
  public nowait = false;
  public difficulty = 1;
  public parsecSlot = 0;

  public static readonly ROLL = 0;
  public static readonly LOCK = 1;
  public mode = P47GameManager.ROLL;

  public static readonly TITLE = 0;
  public static readonly IN_GAME = 1;
  public static readonly GAMEOVER = 2;
  public static readonly PAUSE = 3;
  public state = P47GameManager.TITLE;

  public static readonly PRACTICE = 0;
  public static readonly NORMAL = 1;
  public static readonly HARD = 2;
  public static readonly EXTREME = 3;
  public static readonly QUIT = 4;

  private readonly ENEMY_MAX = 32;
  private readonly FIRST_EXTEND = 200000;
  private readonly EVERY_EXTEND = 500000;
  private readonly LEFT_MAX = 4;
  private readonly BOSS_WING_NUM = 4;
  private readonly SLOWDOWN_START_BULLETS_SPEED = [30, 42] as const;
  private readonly PAD_BUTTON1 = Pad.Button.A;
  private readonly PAD_BUTTON2 = Pad.Button.B;

  private pad!: Pad;
  private prefManager!: P47PrefManager;
  private screen!: ScreenWithLuminousPass;
  private rand!: Rand;
  private field!: Field;
  private ship!: Ship;
  private enemies!: ActorPool<Actor>;
  private particles!: LuminousActorPool<LuminousActor>;
  private fragments!: LuminousActorPool<LuminousActor>;
  private bullets!: BulletActorPool;
  private shots!: ActorPool<Actor>;
  private rolls!: ActorPool<Actor>;
  private locks!: ActorPool<Actor>;
  private bonuses!: ActorPool<Actor>;
  private barrageManager!: BarrageManager;
  private stageManager!: StageManagerLike;
  private title!: TitleLike;

  private left = 0;
  private score = 0;
  private extendScore = this.FIRST_EXTEND;
  private cnt = 0;
  private pauseCnt = 0;
  private bossShield = 0;
  private bossWingShield = Array<number>(this.BOSS_WING_NUM).fill(0);
  private interval = 0;
  private pPrsd = true;
  private btnPrsd = true;
  private screenShakeCnt = 0;
  private screenShakeIntense = 0;
  private waitingForBarrageAssets = true;
  private barrageAssetsReady = false;
  private barrageAssetsFailed = false;
  private titleAssetsReady = false;
  private titleAssetsFailed = false;

  public override init(): void {
    this.pad = this.input as Pad;
    this.prefManager = this.abstPrefManager as P47PrefManager;
    this.screen = this.abstScreen as ScreenWithLuminousPass;

    this.difficulty = this.getPrefValue("selectedDifficulty", 1);
    this.parsecSlot = this.getPrefValue("selectedParsecSlot", 0);
    this.mode = this.getPrefValue("selectedMode", P47GameManager.ROLL);

    this.rand = new Rand();

    Field.createDisplayLists();
    this.field = new Field();
    this.field.init();

    Ship.createDisplayLists();
    this.ship = new Ship();
    this.ship.init(this.pad, this.field, this);

    this.particles = new LuminousActorPool<LuminousActor>(
      128,
      [new ParticleInitializer()],
      this.hasActorContract(Particle) ? (() => new Particle() as unknown as LuminousActor) : (() => new NullLuminousActor()),
    );
    this.fragments = new LuminousActorPool<LuminousActor>(128, [new FragmentInitializer()], () => new Fragment());

    BulletActor.createDisplayLists();
    this.bullets = new BulletActorPool(512, new BulletActorInitializer(this.field, this.ship));

    LetterRender.createDisplayLists();
    const shotInitializer = new (ShotInitializer as unknown as new (...args: unknown[]) => ShotInitializer)(this.field);
    this.shots = new ActorPool<Actor>(
      32,
      [shotInitializer],
      this.hasActorContract(Shot) ? (() => new Shot() as unknown as Actor) : (() => new NullActor()),
    );
    const rollInitializer = new (RollInitializer as unknown as new (...args: unknown[]) => RollInitializer)(
      this.ship,
      this.field,
      this,
    );
    this.rolls = new ActorPool<Actor>(
      4,
      [rollInitializer],
      this.hasActorContract(Roll) ? (() => new Roll() as unknown as Actor) : (() => new NullActor()),
    );
    Lock.init();
    this.locks = new ActorPool<Actor>(4, [new LockInitializer(this.ship, this.field, this)], () => new Lock());

    this.enemies = new ActorPool<Actor>(
      this.ENEMY_MAX,
      [new EnemyInitializer(this.field, this.bullets, this.shots, this.rolls, this.locks, this.ship, this)],
      () => new Enemy(),
    );
    Bonus.init();
    this.bonuses = new ActorPool<Actor>(128, [new BonusInitializer(this.field, this.ship, this)], () => new Bonus());

    this.barrageManager = new BarrageManager();
    EnemyType.init(this.barrageManager);
    void this.barrageManager
      .loadBulletMLs()
      .then(() => {
        this.onBarrageAssetsReady(false);
      })
      .catch((e: unknown) => {
        const err = e instanceof Error ? e : new Error(String(e));
        Logger.error(err);
        this.onBarrageAssetsReady(true);
      });

    this.stageManager = new StageManager() as StageManagerLike;
    this.stageManager.init(this, this.barrageManager, this.field);

    this.title = new Title() as TitleLike;
    this.title.init(this.pad, this, this.prefManager, this.field);
    void this.title
      .waitForAssets?.()
      .then((ok) => {
        this.onTitleAssetsReady(ok === false);
      })
      .catch((e: unknown) => {
        const err = e instanceof Error ? e : new Error(String(e));
        Logger.error(err);
        this.onTitleAssetsReady(true);
      });

    this.interval = this.mainLoop.INTERVAL_BASE;
    SoundManager.init(this);
  }

  public override start(): void {
    if (this.assetsReady()) {
      this.waitingForBarrageAssets = false;
      this.startTitle();
      return;
    }
    this.waitingForBarrageAssets = true;
    this.state = P47GameManager.TITLE;
    this.cnt = 0;
    Music.haltMusic();
  }

  public override close(): void {
    this.barrageManager.unloadBulletMLs();
    this.title.close();
    SoundManager.close();
    LetterRender.deleteDisplayLists();
    Field.deleteDisplayLists();
    Ship.deleteDisplayLists();
    BulletActor.deleteDisplayLists();
  }

  public addScore(sc: number): void {
    this.score += sc;
    if (this.score > this.extendScore) {
      if (this.left < this.LEFT_MAX) {
        SoundManager.playSe(SoundManager.EXTEND);
        this.left++;
      }
      if (this.extendScore <= this.FIRST_EXTEND) {
        this.extendScore = this.EVERY_EXTEND;
      } else {
        this.extendScore += this.EVERY_EXTEND;
      }
    }
  }

  public shipDestroyed(): void {
    if (this.mode === P47GameManager.ROLL) {
      this.releaseRoll();
    } else {
      this.releaseLock();
    }
    this.clearBullets();
    this.left--;
    if (this.left < 0) {
      this.startGameover();
    }
  }

  public addParticle(pos: Vector, deg: number, ofs: number, speed: number): void {
    const particle = this.particles.getInstanceForced() as {
      set?: (p: Vector, d: number, o: number, s: number) => void;
      exists?: boolean;
    };
    particle.exists = true;
    particle.set?.(pos, deg, ofs, speed);
  }

  public addFragments(
    n: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    z: number,
    speed: number,
    deg: number,
  ): void {
    for (let i = 0; i < n; i++) {
      const fragment = this.fragments.getInstanceForced() as {
        set?: (
          x1Arg: number,
          y1Arg: number,
          x2Arg: number,
          y2Arg: number,
          zArg: number,
          speedArg: number,
          degArg: number,
        ) => void;
        exists?: boolean;
      };
      fragment.exists = true;
      fragment.set?.(x1, y1, x2, y2, z, speed, deg);
    }
  }

  public addEnemy(pos: Vector, d: number, type: EnemyType, moveParser: BulletMLParserLike): void {
    const enemy = this.enemies.getInstance() as {
      set?: (p: Vector, deg: number, tp: EnemyType, parser: BulletMLParserLike) => void;
      exists?: boolean;
    } | null;
    if (!enemy) {
      return;
    }
    enemy.set?.(pos, d, type, moveParser);
    enemy.exists = true;
  }

  public clearBullets(): void {
    for (let i = 0; i < this.bullets.actor.length; i++) {
      const bullet = this.bullets.actor[i] as { exists: boolean; toRetro?: () => void };
      if (!bullet.exists) {
        continue;
      }
      bullet.toRetro?.();
    }
  }

  public addBoss(pos: Vector, d: number, type: EnemyType): void {
    const enemy = this.enemies.getInstance() as {
      setBoss?: (p: Vector, deg: number, tp: EnemyType) => void;
      exists?: boolean;
    } | null;
    if (!enemy) {
      return;
    }
    enemy.setBoss?.(pos, d, type);
    enemy.exists = true;
  }

  public addShot(pos: Vector, deg: number): void {
    const shot = this.shots.getInstance();
    if (!shot) {
      return;
    }
    this.callIfFunction(shot as unknown as Record<string, unknown>, "set", pos, deg);
    shot.exists = true;
  }

  public addRoll(): void {
    const roll = this.rolls.getInstance();
    if (!roll) {
      return;
    }
    this.callIfFunction(roll as unknown as Record<string, unknown>, "set");
    roll.exists = true;
  }

  public addLock(): void {
    const lock = this.locks.getInstance();
    if (!lock) {
      return;
    }
    this.callIfFunction(lock as unknown as Record<string, unknown>, "set");
    lock.exists = true;
  }

  public releaseRoll(): void {
    for (let i = 0; i < this.rolls.actor.length; i++) {
      const roll = this.rolls.actor[i] as { exists: boolean; released?: boolean };
      if (!roll.exists) {
        continue;
      }
      roll.released = true;
    }
  }

  public releaseLock(): void {
    for (let i = 0; i < this.locks.actor.length; i++) {
      const lock = this.locks.actor[i] as { exists: boolean; released?: boolean };
      if (!lock.exists) {
        continue;
      }
      lock.released = true;
    }
  }

  public addBonus(pos: Vector, ofs: Vector | null, num: number): void {
    for (let i = 0; i < num; i++) {
      const bonus = this.bonuses.getInstance();
      if (!bonus) {
        return;
      }
      this.callIfFunction(bonus as unknown as Record<string, unknown>, "set", pos, ofs);
      bonus.exists = true;
    }
  }

  public setBossShieldMeter(bs: number, s1: number, s2: number, s3: number, s4: number, r: number): void {
    const rr = r * 0.7;
    this.bossShield = (bs * rr) | 0;
    this.bossWingShield[0] = (s1 * rr) | 0;
    this.bossWingShield[1] = (s2 * rr) | 0;
    this.bossWingShield[2] = (s3 * rr) | 0;
    this.bossWingShield[3] = (s4 * rr) | 0;
  }

  public startStage(difficulty: number, parsecSlot: number, startParsec: number, mode: number): void {
    this.enemies.clear();
    this.bullets.clear();
    this.difficulty = difficulty;
    this.parsecSlot = parsecSlot;
    this.mode = mode;
    const stageType = this.rand.nextInt(99999);
    switch (difficulty) {
      case P47GameManager.PRACTICE:
        this.stageManager.setRank(1, 4, startParsec, stageType);
        this.ship.setSpeedRate(0.7);
        Bonus.setSpeedRate(0.6);
        break;
      case P47GameManager.NORMAL:
        this.stageManager.setRank(10, 8, startParsec, stageType);
        this.ship.setSpeedRate(0.9);
        Bonus.setSpeedRate(0.8);
        break;
      case P47GameManager.HARD:
        this.stageManager.setRank(22, 12, startParsec, stageType);
        this.ship.setSpeedRate(1);
        Bonus.setSpeedRate(1);
        break;
      case P47GameManager.EXTREME:
        this.stageManager.setRank(36, 16, startParsec, stageType);
        this.ship.setSpeedRate(1.2);
        Bonus.setSpeedRate(1.3);
        break;
      case P47GameManager.QUIT:
      default:
        this.stageManager.setRank(0, 0, 0, 0);
        this.ship.setSpeedRate(1);
        Bonus.setSpeedRate(1);
        break;
    }
  }

  public setScreenShake(cnt: number, intense: number): void {
    this.screenShakeCnt = cnt;
    this.screenShakeIntense = intense;
  }

  public override move(): void {
    if (this.pad.keys[SDLK_ESCAPE] === SDL_PRESSED) {
      this.mainLoop.breakLoop();
      return;
    }
    if (this.waitingForBarrageAssets) {
      this.cnt++;
      return;
    }
    switch (this.state) {
      case P47GameManager.IN_GAME:
        this.inGameMove();
        break;
      case P47GameManager.TITLE:
        this.titleMove();
        break;
      case P47GameManager.GAMEOVER:
        this.gameoverMove();
        break;
      case P47GameManager.PAUSE:
        this.pauseMove();
        break;
      default:
        break;
    }
    this.cnt++;
  }

  public override draw(): void {
    const event = this.mainLoop.event as {
      type?: number;
      resize?: {
        w?: number;
        h?: number;
      };
    };
    if (event.type === SDL_VIDEORESIZE) {
      const w = event.resize?.w ?? 0;
      const h = event.resize?.h ?? 0;
      if (w > 150 && h > 100) {
        this.screen.resized(w, h);
      }
    }
    if (this.waitingForBarrageAssets) {
      this.screen.viewOrthoFixed?.();
      this.drawLoadingStatus();
      this.screen.viewPerspective?.();
      return;
    }

    this.screen.startRenderToTexture?.();
    Screen3D.glPushMatrix();
    this.setEyepos();
    switch (this.state) {
      case P47GameManager.IN_GAME:
      case P47GameManager.PAUSE:
        this.inGameDrawLuminous();
        break;
      case P47GameManager.TITLE:
        this.titleDrawLuminous();
        break;
      case P47GameManager.GAMEOVER:
        this.gameoverDrawLuminous();
        break;
      default:
        break;
    }
    Screen3D.glPopMatrix();
    this.screen.endRenderToTexture?.();

    this.screen.clear();
    Screen3D.glPushMatrix();
    this.setEyepos();
    switch (this.state) {
      case P47GameManager.IN_GAME:
      case P47GameManager.PAUSE:
        this.inGameDraw();
        break;
      case P47GameManager.TITLE:
        this.titleDraw();
        break;
      case P47GameManager.GAMEOVER:
        this.gameoverDraw();
        break;
      default:
        break;
    }
    Screen3D.glPopMatrix();

    this.screen.drawLuminous?.();
    this.screen.viewOrthoFixed?.();
    switch (this.state) {
      case P47GameManager.IN_GAME:
        this.inGameDrawStatus();
        break;
      case P47GameManager.TITLE:
        this.titleDrawStatus();
        break;
      case P47GameManager.GAMEOVER:
        this.gameoverDrawStatus();
        break;
      case P47GameManager.PAUSE:
        this.pauseDrawStatus();
        break;
      default:
        break;
    }
    this.screen.viewPerspective?.();
  }

  private onBarrageAssetsReady(failed: boolean): void {
    this.barrageAssetsReady = true;
    this.barrageAssetsFailed = failed;
    this.tryLeaveAssetLoading();
  }

  private onTitleAssetsReady(failed: boolean): void {
    this.titleAssetsReady = true;
    this.titleAssetsFailed = failed;
    this.tryLeaveAssetLoading();
  }

  private tryLeaveAssetLoading(): void {
    if (!this.assetsReady()) {
      return;
    }
    if (!this.waitingForBarrageAssets) {
      return;
    }
    this.waitingForBarrageAssets = false;
    this.startTitle();
  }

  private assetsReady(): boolean {
    return this.barrageAssetsReady && this.titleAssetsReady;
  }

  private initShipState(): void {
    this.left = 2;
    this.score = 0;
    this.extendScore = this.FIRST_EXTEND;
    this.ship.start();
  }

  private startInGame(): void {
    this.state = P47GameManager.IN_GAME;
    this.initShipState();
    this.startStage(
      this.difficulty,
      this.parsecSlot,
      this.getStartParsec(this.difficulty, this.parsecSlot),
      this.mode,
    );
  }

  private startTitle(): void {
    this.state = P47GameManager.TITLE;
    this.title.start?.();
    this.initShipState();
    this.bullets.clear();
    this.ship.cnt = 0;
    this.startStage(
      this.difficulty,
      this.parsecSlot,
      this.getStartParsec(this.difficulty, this.parsecSlot),
      this.mode,
    );
    this.cnt = 0;
    Music.haltMusic();
  }

  private startGameover(): void {
    this.state = P47GameManager.GAMEOVER;
    this.bonuses.clear();
    this.shots.clear();
    this.rolls.clear();
    this.locks.clear();
    this.setScreenShake(0, 0);
    this.mainLoop.interval = this.interval = this.mainLoop.INTERVAL_BASE;
    this.cnt = 0;

    const highScore = this.getHiScore(this.mode, this.difficulty, this.parsecSlot);
    if (this.score > highScore) {
      this.setHiScore(this.mode, this.difficulty, this.parsecSlot, this.score);
    }
    const parsec = this.stageManager.parsec ?? 0;
    if (parsec > this.getReachedParsec(this.mode, this.difficulty)) {
      this.setReachedParsec(this.mode, this.difficulty, parsec);
    }
    Music.fadeMusic();
  }

  private startPause(): void {
    this.state = P47GameManager.PAUSE;
    this.pauseCnt = 0;
  }

  private resumePause(): void {
    this.state = P47GameManager.IN_GAME;
  }

  private stageMove(): void {
    this.stageManager.move?.();
  }

  private inGameMove(): void {
    this.stageMove();
    this.field.move();
    this.callIfFunction(this.ship as unknown as Record<string, unknown>, "move");
    this.bonuses.move();
    this.shots.move();
    this.enemies.move();
    if (this.mode === P47GameManager.ROLL) {
      this.rolls.move();
    } else {
      this.locks.move();
    }
    BulletActor.resetTotalBulletsSpeed();
    this.bullets.move();
    this.particles.move();
    this.fragments.move();
    this.moveScreenShake();

    if (this.pad.keys[SDLK_p] === SDL_PRESSED) {
      if (!this.pPrsd) {
        this.pPrsd = true;
        this.startPause();
      }
    } else {
      this.pPrsd = false;
    }

    if (!this.nowait) {
      const slowdownStart = this.SLOWDOWN_START_BULLETS_SPEED[this.mode] ?? this.SLOWDOWN_START_BULLETS_SPEED[0];
      if (BulletActor.totalBulletsSpeed > slowdownStart) {
        let sm = BulletActor.totalBulletsSpeed / slowdownStart;
        if (sm > 1.75) {
          sm = 1.75;
        }
        this.interval += (sm * this.mainLoop.INTERVAL_BASE - this.interval) * 0.1;
      } else {
        this.interval += (this.mainLoop.INTERVAL_BASE - this.interval) * 0.08;
      }
      this.mainLoop.interval = this.interval;
    }
  }

  private titleMove(): void {
    this.title.move?.();
    if (this.cnt <= 8) {
      this.btnPrsd = true;
    } else {
      const btn = this.pad.getButtonState();
      if ((btn & this.PAD_BUTTON1) !== 0) {
        if (!this.btnPrsd) {
          this.title.setStatus?.();
          if (this.difficulty >= 4) {
            this.mainLoop.breakLoop();
          } else {
            this.startInGame();
          }
          return;
        }
      } else if ((btn & this.PAD_BUTTON2) !== 0) {
        if (!this.btnPrsd) {
          this.title.changeMode?.();
          this.btnPrsd = true;
        }
      } else {
        this.btnPrsd = false;
      }
    }
    this.stageMove();
    this.field.move();
    this.enemies.move();
    this.bullets.move();
  }

  private gameoverMove(): void {
    let gotoNextState = false;
    if (this.cnt <= 64) {
      this.btnPrsd = true;
    } else {
      if ((this.pad.getButtonState() & (this.PAD_BUTTON1 | this.PAD_BUTTON2)) !== 0) {
        if (!this.btnPrsd) {
          gotoNextState = true;
        }
      } else {
        this.btnPrsd = false;
      }
    }

    if (this.cnt > 64 && gotoNextState) {
      this.startTitle();
    } else if (this.cnt > 500) {
      this.startTitle();
    }

    this.field.move();
    this.enemies.move();
    this.bullets.move();
    this.particles.move();
    this.fragments.move();
  }

  private pauseMove(): void {
    this.pauseCnt++;
    if (this.pad.keys[SDLK_p] === SDL_PRESSED) {
      if (!this.pPrsd) {
        this.pPrsd = true;
        this.resumePause();
      }
    } else {
      this.pPrsd = false;
    }
  }

  private inGameDraw(): void {
    this.field.draw();
    P47Screen.setRetroColor(0.2, 0.7, 0.5, 1);
    Screen3D.glBlendFunc(Screen3D.GL_SRC_ALPHA, Screen3D.GL_ONE_MINUS_SRC_ALPHA);
    this.bonuses.draw();
    Screen3D.glBlendFunc(Screen3D.GL_SRC_ALPHA, Screen3D.GL_ONE);
    Screen3D.setColor(0.3, 0.7, 1, 1);
    Screen3D.glBegin(Screen3D.GL_LINES);
    this.particles.draw();
    Screen3D.glEnd();
    P47Screen.setRetroColor(Fragment.R, Fragment.G, Fragment.B, 1);
    this.fragments.draw();
    P47Screen.setRetroZ(0);
    this.callIfFunction(this.ship as unknown as Record<string, unknown>, "draw");
    P47Screen.setRetroColor(0.8, 0.8, 0.2, 0.8);
    this.shots.draw();
    P47Screen.setRetroColor(1, 0.8, 0.5, 1);
    if (this.mode === P47GameManager.ROLL) {
      this.rolls.draw();
    } else {
      this.locks.draw();
    }
    this.enemies.draw();
    this.bullets.draw();
  }

  private titleDraw(): void {
    this.field.draw();
    this.enemies.draw();
    this.bullets.draw();
  }

  private gameoverDraw(): void {
    this.field.draw();
    Screen3D.setColor(0.3, 0.7, 1, 1);
    Screen3D.glBegin(Screen3D.GL_LINES);
    this.particles.draw();
    Screen3D.glEnd();
    P47Screen.setRetroColor(Fragment.R, Fragment.G, Fragment.B, 1);
    this.fragments.draw();
    P47Screen.setRetroZ(0);
    this.enemies.draw();
    this.bullets.draw();
  }

  private inGameDrawLuminous(): void {
    Screen3D.glBegin(Screen3D.GL_LINES);
    this.particles.drawLuminous();
    this.fragments.drawLuminous();
    Screen3D.glEnd();
  }

  private titleDrawLuminous(): void {}

  private gameoverDrawLuminous(): void {
    Screen3D.glBegin(Screen3D.GL_LINES);
    this.particles.drawLuminous();
    this.fragments.drawLuminous();
    Screen3D.glEnd();
  }

  private drawBoard(x: number, y: number, width: number, height: number): void {
    Screen3D.setColor(0, 0, 0, 1);
    Screen3D.glBegin(Screen3D.GL_QUADS);
    Screen3D.glVertexXYZ(x, y, 0);
    Screen3D.glVertexXYZ(x + width, y, 0);
    Screen3D.glVertexXYZ(x + width, y + height, 0);
    Screen3D.glVertexXYZ(x, y + height, 0);
    Screen3D.glEnd();
  }

  private drawSideBoards(): void {
    Screen3D.glDisable(Screen3D.GL_BLEND);
    this.drawBoard(0, 0, 160, 480);
    this.drawBoard(480, 0, 160, 480);
    Screen3D.glEnable(Screen3D.GL_BLEND);
  }

  private drawScore(): void {
    LetterRender.drawNum(this.score, 120, 28, 25, LetterRender.TO_UP);
    LetterRender.drawNum(Bonus.bonusScore, 24, 20, 12, LetterRender.TO_UP);
  }

  private drawLeft(): void {
    if (this.left < 0) {
      return;
    }
    LetterRender.drawString("LEFT", 520, 260, 25, LetterRender.TO_DOWN);
    LetterRender.changeColor(LetterRender.RED);
    LetterRender.drawNum(this.left, 520, 450, 25, LetterRender.TO_DOWN);
    LetterRender.changeColor(LetterRender.WHITE);
  }

  private drawParsec(): void {
    const ps = this.stageManager.parsec ?? 0;
    if (ps < 10) {
      LetterRender.drawNum(ps, 600, 26, 25, LetterRender.TO_DOWN);
    } else if (ps < 100) {
      LetterRender.drawNum(ps, 600, 68, 25, LetterRender.TO_DOWN);
    } else {
      LetterRender.drawNum(ps, 600, 110, 25, LetterRender.TO_DOWN);
    }
  }

  private drawBox(x: number, y: number, w: number, h: number): void {
    if (w <= 0) {
      return;
    }
    Screen3D.setColor(1, 1, 1, 0.5);
    P47Screen.drawBoxSolid(x, y, w, h);
    Screen3D.setColor(1, 1, 1, 1);
    P47Screen.drawBoxLine(x, y, w, h);
  }

  private drawBossShieldMeter(): void {
    this.drawBox(165, 6, this.bossShield, 6);
    let y = 24;
    for (let i = 0; i < this.BOSS_WING_NUM; i++) {
      switch (i % 2) {
        case 0:
          this.drawBox(165, y, this.bossWingShield[i], 6);
          break;
        case 1:
          this.drawBox(475 - this.bossWingShield[i], y, this.bossWingShield[i], 6);
          y += 12;
          break;
      }
    }
  }

  private drawSideInfo(): void {
    this.drawSideBoards();
    this.drawScore();
    this.drawLeft();
    this.drawParsec();
  }

  private inGameDrawStatus(): void {
    this.drawSideInfo();
    if (this.stageManager.bossSection) {
      this.drawBossShieldMeter();
    }
  }

  private titleDrawStatus(): void {
    this.drawSideBoards();
    this.drawScore();
    this.title.draw?.();
  }

  private gameoverDrawStatus(): void {
    this.drawSideInfo();
    if (this.cnt > 64) {
      LetterRender.drawString("GAME OVER", 220, 200, 15, LetterRender.TO_RIGHT);
    }
  }

  private pauseDrawStatus(): void {
    this.drawSideInfo();
    if (this.pauseCnt % 60 < 30) {
      LetterRender.drawString("PAUSE", 280, 220, 12, LetterRender.TO_RIGHT);
    }
  }

  private drawLoadingStatus(): void {
    this.drawSideBoards();
    LetterRender.drawString("LOADING ASSETS", 234, 192, 10, LetterRender.TO_RIGHT);
    LetterRender.drawString(this.barrageAssetsReady ? "BULLETML: OK" : "BULLETML: ...", 230, 224, 8, LetterRender.TO_RIGHT);
    LetterRender.drawString(this.titleAssetsReady ? "TITLE BMP: OK" : "TITLE BMP: ...", 230, 250, 8, LetterRender.TO_RIGHT);
    if (this.barrageAssetsFailed || this.titleAssetsFailed) {
      LetterRender.changeColor(LetterRender.RED);
      LetterRender.drawString("LOAD FAILED", 252, 286, 10, LetterRender.TO_RIGHT);
      LetterRender.changeColor(LetterRender.WHITE);
    }
  }

  private moveScreenShake(): void {
    if (this.screenShakeCnt > 0) {
      this.screenShakeCnt--;
    }
  }

  private setEyepos(): void {
    let x = 0;
    let y = 0;
    if (this.screenShakeCnt > 0) {
      x = this.rand.nextSignedFloat(this.screenShakeIntense * (this.screenShakeCnt + 10));
      y = this.rand.nextSignedFloat(this.screenShakeIntense * (this.screenShakeCnt + 10));
    }
    Screen3D.glTranslatef(x, y, -this.field.eyeZ);
  }

  private getStartParsec(difficulty: number, slot: number): number {
    if (this.title.getStartParsec) {
      return this.title.getStartParsec(difficulty, slot);
    }
    return slot * 10 + 1;
  }

  private getPrefValue(key: "selectedDifficulty" | "selectedParsecSlot" | "selectedMode", fallback: number): number {
    const value = (this.prefManager as unknown as Record<string, unknown>)[key];
    return typeof value === "number" ? value : fallback;
  }

  private getHiScore(mode: number, difficulty: number, parsecSlot: number): number {
    const hiScore = (this.prefManager as unknown as Record<string, unknown>).hiScore;
    if (typeof hiScore === "number") {
      return hiScore;
    }
    if (!Array.isArray(hiScore)) {
      return 0;
    }
    const byMode = hiScore[mode];
    if (!Array.isArray(byMode)) {
      return 0;
    }
    const byDifficulty = byMode[difficulty];
    if (!Array.isArray(byDifficulty)) {
      return 0;
    }
    const value = byDifficulty[parsecSlot];
    return typeof value === "number" ? value : 0;
  }

  private setHiScore(mode: number, difficulty: number, parsecSlot: number, value: number): void {
    const pref = this.prefManager as unknown as Record<string, unknown>;
    if (typeof pref.hiScore === "number") {
      pref.hiScore = value;
      return;
    }
    if (!Array.isArray(pref.hiScore)) {
      return;
    }
    const byMode = pref.hiScore[mode];
    if (!Array.isArray(byMode)) {
      return;
    }
    const byDifficulty = byMode[difficulty];
    if (!Array.isArray(byDifficulty)) {
      return;
    }
    byDifficulty[parsecSlot] = value;
  }

  private getReachedParsec(mode: number, difficulty: number): number {
    const reachedParsec = (this.prefManager as unknown as Record<string, unknown>).reachedParsec;
    if (!Array.isArray(reachedParsec)) {
      return 0;
    }
    const byMode = reachedParsec[mode];
    if (!Array.isArray(byMode)) {
      return 0;
    }
    const value = byMode[difficulty];
    return typeof value === "number" ? value : 0;
  }

  private setReachedParsec(mode: number, difficulty: number, value: number): void {
    const pref = this.prefManager as unknown as Record<string, unknown>;
    if (!Array.isArray(pref.reachedParsec)) {
      return;
    }
    const byMode = pref.reachedParsec[mode];
    if (!Array.isArray(byMode)) {
      return;
    }
    byMode[difficulty] = value;
  }

  private hasActorContract(
    ctor: new (...args: never[]) => unknown,
  ): boolean {
    const p = ctor.prototype as Record<string, unknown> | undefined;
    if (!p) {
      return false;
    }
    return (
      typeof p.init === "function" &&
      typeof p.move === "function" &&
      typeof p.draw === "function"
    );
  }

  private callIfFunction(target: Record<string, unknown>, name: string, ...args: unknown[]): void {
    const fn = target[name];
    if (typeof fn === "function") {
      (fn as (...fnArgs: unknown[]) => void).apply(target, args);
    }
  }
}
