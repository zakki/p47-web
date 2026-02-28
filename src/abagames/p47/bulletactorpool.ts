import { ActorPool } from "../util/actor";
import {
  Bullet,
  type BulletMLRunner,
  type BulletMLState,
  createBullet_,
  createSimpleBullet_,
  doAccelX_,
  doAccelY_,
  doChangeDirection_,
  doChangeSpeed_,
  doVanish_,
  getBulletDirection_,
  getBulletSpeed_,
  getBulletSpeedX_,
  getBulletSpeedY_,
  getDefaultSpeed_,
  getRand_,
  getRank_,
  getTurn_,
} from "../util/bulletml/bullet";
import type { BulletsManager } from "../util/bulletml/bulletsmanager";
import { BulletActor, BulletActorInitializer } from "./bulletactor";

type BulletMLParserLike = {
  createRunner: () => BulletMLRunner;
};

type P47BulletLike = Bullet & {
  isMorph?: boolean;
  speedRank?: number;
  shape?: number;
  color?: number;
  bulletSize?: number;
  xReverse?: number;
  morphParser?: BulletMLParserLike[];
  morphNum?: number;
  morphIdx?: number;
  morphCnt?: number;
};

/**
 * Bullet actor pool that works as the BulletsManager.
 */
export class BulletActorPool extends ActorPool<BulletActor> implements BulletsManager {
  private cnt = 0;

  public constructor(n: number, initializer: BulletActorInitializer) {
    super(n, [initializer], () => new BulletActor());
    Bullet.setBulletsManager(this);
    BulletActor.init();
    this.cnt = 0;
  }

  public addBullet(deg: number, speed: number): void;
  public addBullet(state: BulletMLState, deg: number, speed: number): void;
  public addBullet(
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
  ): BulletActor | null;
  public addBullet(
    parser: BulletMLParserLike,
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
  ): BulletActor | null;
  public addBullet(
    parser: BulletMLParserLike,
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
    morph: BulletMLParserLike[],
    morphNum: number,
    morphCnt: number,
  ): BulletActor | null;
  public addBullet(...args: unknown[]): void | BulletActor | null {
    if (args.length === 2 && typeof args[0] === "number" && typeof args[1] === "number") {
      this.addSimpleBullet(args[0], args[1]);
      return;
    }
    if (args.length === 3 && typeof args[1] === "number" && typeof args[2] === "number") {
      this.addStateBullet(args[0] as BulletMLState, args[1], args[2]);
      return;
    }
    if (args.length === 11) {
      return this.addManagedBullet(args as [
        BulletMLRunner,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ]);
    }
    if (args.length === 12) {
      const ba = this.addManagedBullet(args.slice(1) as [
        BulletMLRunner,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ]);
      if (!ba) return null;
      ba.setTop(args[0] as BulletMLParserLike);
      return ba;
    }
    if (args.length === 15) {
      const ba = this.acquireActor();
      if (!ba) return null;
      const parser = args[0] as BulletMLParserLike;
      const runner = args[1] as BulletMLRunner;
      ba.set(
        runner,
        args[2] as number,
        args[3] as number,
        args[4] as number,
        args[5] as number,
        args[6] as number,
        args[7] as number,
        args[8] as number,
        args[9] as number,
        args[10] as number,
        args[11] as number,
        args[12] as BulletMLParserLike[],
        args[13] as number,
        0,
        args[14] as number,
      );
      ba.setTop(parser);
      return ba;
    }
    throw new Error("BulletActorPool.addBullet: invalid argument pattern");
  }

  public override move(): void {
    super.move();
    this.cnt++;
  }

  public getTurn(): number {
    return this.cnt;
  }

  public killMe(bullet: Bullet): void {
    const byId = this.actor[bullet.id];
    if (byId && byId.bullet.id === bullet.id) {
      byId.remove();
      return;
    }
    for (let i = 0; i < this.actor.length; i++) {
      const ac = this.actor[i];
      if (!ac.exists) continue;
      const actorBullet = ac.bullet as unknown as Bullet;
      if (actorBullet === bullet || actorBullet.id === bullet.id) {
        ac.remove();
        return;
      }
    }
  }

  public override clear(): void {
    for (let i = 0; i < this.actor.length; i++) {
      if (this.actor[i].exists) {
        this.actor[i].remove();
      }
    }
  }

  public static registFunctions(runner: BulletMLRunner): void {
    const callbacks = (runner.callbacks ??= {});
    callbacks.getBulletDirection = getBulletDirection_;
    callbacks.getAimDirection = getAimDirectionWithXRev_;
    callbacks.getBulletSpeed = getBulletSpeed_;
    callbacks.getDefaultSpeed = getDefaultSpeed_;
    callbacks.getRank = getRank_;
    callbacks.createSimpleBullet = createSimpleBullet_;
    callbacks.createBullet = createBullet_;
    callbacks.getTurn = getTurn_;
    callbacks.doVanish = doVanish_;

    callbacks.doChangeDirection = doChangeDirection_;
    callbacks.doChangeSpeed = doChangeSpeed_;
    callbacks.doAccelX = doAccelX_;
    callbacks.doAccelY = doAccelY_;
    callbacks.getBulletSpeedX = getBulletSpeedX_;
    callbacks.getBulletSpeedY = getBulletSpeedY_;
    callbacks.getRand = getRand_;
  }

  private acquireActor(): BulletActor | null {
    return this.getInstance();
  }

  private addSimpleBullet(deg: number, speed: number): void {
    const ba = this.acquireActor();
    if (!ba) return;
    const rb = Bullet.now as P47BulletLike;
    const morphParser = rb.morphParser ?? [];
    const morphNum = rb.morphNum ?? 0;
    const morphIdx = rb.morphIdx ?? 0;
    const morphCnt = rb.morphCnt ?? 0;
    if (rb.isMorph) {
      const parser = morphParser[morphIdx];
      if (!parser) {
        return;
      }
      const runner = parser.createRunner();
      BulletActorPool.registFunctions(runner);
      ba.set(
        runner,
        Bullet.now.pos.x,
        Bullet.now.pos.y,
        deg,
        speed,
        Bullet.now.rank,
        rb.speedRank ?? 1,
        rb.shape ?? 0,
        rb.color ?? 0,
        rb.bulletSize ?? 1,
        rb.xReverse ?? 1,
        morphParser,
        morphNum,
        morphIdx + 1,
        morphCnt - 1,
      );
      return;
    }
    ba.setSimple(
      Bullet.now.pos.x,
      Bullet.now.pos.y,
      deg,
      speed,
      Bullet.now.rank,
      rb.speedRank ?? 1,
      rb.shape ?? 0,
      rb.color ?? 0,
      rb.bulletSize ?? 1,
      rb.xReverse ?? 1,
    );
  }

  private addStateBullet(state: BulletMLState, deg: number, speed: number): void {
    const ba = this.acquireActor();
    if (!ba) return;
    const runner = this.createRunnerFromState(state);
    BulletActorPool.registFunctions(runner);
    const rb = Bullet.now as P47BulletLike;
    if (rb.isMorph) {
      ba.set(
        runner,
        Bullet.now.pos.x,
        Bullet.now.pos.y,
        deg,
        speed,
        Bullet.now.rank,
        rb.speedRank ?? 1,
        rb.shape ?? 0,
        rb.color ?? 0,
        rb.bulletSize ?? 1,
        rb.xReverse ?? 1,
        rb.morphParser ?? [],
        rb.morphNum ?? 0,
        rb.morphIdx ?? 0,
        rb.morphCnt ?? 0,
      );
      return;
    }
    ba.set(
      runner,
      Bullet.now.pos.x,
      Bullet.now.pos.y,
      deg,
      speed,
      Bullet.now.rank,
      rb.speedRank ?? 1,
      rb.shape ?? 0,
      rb.color ?? 0,
      rb.bulletSize ?? 1,
      rb.xReverse ?? 1,
    );
  }

  private addManagedBullet(args: [
    BulletMLRunner,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ]): BulletActor | null {
    const ba = this.acquireActor();
    if (!ba) return null;
    ba.set(...args);
    ba.setInvisible();
    return ba;
  }

  private createRunnerFromState(state: BulletMLState): BulletMLRunner {
    return state.createRunner();
  }
}

function getAimDirectionWithXRev_(r: BulletMLRunner): number {
  const b = Bullet.now.pos;
  const t = Bullet.target;
  const xrev = (Bullet.now as P47BulletLike).xReverse ?? 1;
  return (Math.atan2(t.x - b.x, t.y - b.y) * xrev * 180) / Math.PI;
}
