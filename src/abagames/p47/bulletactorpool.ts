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
import type { BulletMLParserAsset } from "../util/bulletml/runtime";
import type { BulletsManager } from "../util/bulletml/bulletsmanager";
import { BulletActor, BulletActorInitializer } from "./bulletactor";
import type { P47Bullet } from "./p47bullet";

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

  public addManagedBullet(
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
  ): BulletActor | null {
    const ba = this.acquireActor();
    if (!ba) return null;
    ba.setRunnerBullet(runner, x, y, deg, speed, rank, speedRank, shape, color, size, xReverse);
    ba.setInvisible();
    return ba;
  }

  public addTopBullet(
    parser: BulletMLParserAsset,
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
  ): BulletActor | null {
    const ba = this.addManagedBullet(runner, x, y, deg, speed, rank, speedRank, shape, color, size, xReverse);
    if (!ba) return null;
    ba.setTop(parser);
    return ba;
  }

  public addTopMorphBullet(
    parser: BulletMLParserAsset,
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
    morph: BulletMLParserAsset[],
    morphNum: number,
    morphCnt: number,
  ): BulletActor | null {
    const ba = this.acquireActor();
    if (!ba) return null;
    ba.setRunnerMorphBullet(
      runner,
      x,
      y,
      deg,
      speed,
      rank,
      speedRank,
      shape,
      color,
      size,
      xReverse,
      morph,
      morphNum,
      0,
      morphCnt,
    );
    ba.setTop(parser);
    return ba;
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

  public addSimpleBullet(deg: number, speed: number): void {
    const ba = this.acquireActor();
    if (!ba) return;
    const rb = Bullet.now as P47Bullet;
    const morphParser = rb.morphParser;
    const morphNum = rb.morphNum;
    const morphIdx = rb.morphIdx;
    const morphCnt = rb.morphCnt;
    if (rb.isMorph) {
      const parser = morphParser[morphIdx];
      if (!parser) {
        throw new Error(`Morph parser missing at index ${morphIdx} (morphNum=${morphNum})`);
      }
      const runner = parser.createRunner();
      BulletActorPool.registFunctions(runner);
      ba.setRunnerMorphBullet(
        runner,
        Bullet.now.pos.x,
        Bullet.now.pos.y,
        deg,
        speed,
        Bullet.now.rank,
        rb.speedRank,
        rb.shape,
        rb.color,
        rb.bulletSize,
        rb.xReverse,
        morphParser,
        morphNum,
        morphIdx + 1,
        morphCnt - 1,
      );
      return;
    }
    ba.setSimpleBullet(
      Bullet.now.pos.x,
      Bullet.now.pos.y,
      deg,
      speed,
      Bullet.now.rank,
      rb.speedRank,
      rb.shape,
      rb.color,
      rb.bulletSize,
      rb.xReverse,
    );
  }

  public addStateBullet(state: BulletMLState, deg: number, speed: number): void {
    const ba = this.acquireActor();
    if (!ba) return;
    const runner = this.createRunnerFromState(state);
    BulletActorPool.registFunctions(runner);
    const rb = Bullet.now as P47Bullet;
    if (rb.isMorph) {
      ba.setRunnerMorphBullet(
        runner,
        Bullet.now.pos.x,
        Bullet.now.pos.y,
        deg,
        speed,
        Bullet.now.rank,
        rb.speedRank,
        rb.shape,
        rb.color,
        rb.bulletSize,
        rb.xReverse,
        rb.morphParser,
        rb.morphNum,
        rb.morphIdx,
        rb.morphCnt,
      );
      return;
    }
    ba.setRunnerBullet(
      runner,
      Bullet.now.pos.x,
      Bullet.now.pos.y,
      deg,
      speed,
      Bullet.now.rank,
      rb.speedRank,
      rb.shape,
      rb.color,
      rb.bulletSize,
      rb.xReverse,
    );
  }

  private createRunnerFromState(state: BulletMLState): BulletMLRunner {
    return state.createRunner();
  }
}

function getAimDirectionWithXRev_(r: BulletMLRunner): number {
  const b = Bullet.now.pos;
  const t = Bullet.target;
  const xrev = (Bullet.now as P47Bullet).xReverse;
  return (Math.atan2(t.x - b.x, t.y - b.y) * xrev * 180) / Math.PI;
}
