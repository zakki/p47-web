import { Bullet } from "../util/bulletml/bullet";
import type { BulletMLParserAsset } from "../util/bulletml/runtime";

export class MorphBullet extends Bullet {
  public static readonly MORPH_MAX = 8;

  public morphParser: BulletMLParserAsset[] = [];
  public morphNum = 0;
  public morphIdx = 0;
  public morphCnt = 0;
  public baseMorphIdx = 0;
  public baseMorphCnt = 0;
  public isMorph = false;

  public constructor(id: number) {
    super(id);
  }

  public setMorph(mrp: BulletMLParserAsset[], num: number, idx: number, cnt: number): void {
    if (cnt <= 0) {
      this.isMorph = false;
      return;
    }
    this.isMorph = true;
    this.baseMorphCnt = this.morphCnt = cnt;
    this.morphNum = num;
    for (let i = 0; i < num; i++) {
      this.morphParser[i] = mrp[i];
    }
    this.morphIdx = idx;
    if (this.morphIdx >= this.morphNum) {
      this.morphIdx = 0;
    }
    this.baseMorphIdx = this.morphIdx;
  }

  public resetMorph(): void {
    this.morphIdx = this.baseMorphIdx;
    this.morphCnt = this.baseMorphCnt;
  }
}
