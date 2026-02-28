import { MorphBullet } from "./morphbullet";

export class P47Bullet extends MorphBullet {
  public speedRank = 0;
  public shape = 0;
  public color = 0;
  public bulletSize = 0;
  public xReverse = 0;

  public constructor(id: number) {
    super(id);
  }

  public setParam(sr: number, sh: number, cl: number, sz: number, xr: number): void {
    this.speedRank = sr;
    this.shape = sh;
    this.color = cl;
    this.bulletSize = sz;
    this.xReverse = xr;
  }
}
