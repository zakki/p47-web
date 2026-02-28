import { Rand } from "../util/rand";
import { Vector } from "../util/vector";
import { Screen3D } from "../util/sdl/screen3d";
import { P47Screen } from "./screen";
import { LuminousActor } from "./luminousactor";

/**
 * Enemies' fragments.
 */
export class Fragment extends LuminousActor {
  public static readonly R = 1;
  public static readonly G = 0.8;
  public static readonly B = 0.6;

  private static readonly POINT_NUM = 2;
  private static readonly rand = new Rand();

  private pos: Vector[] = [];
  private vel: Vector[] = [];
  private impact = new Vector();
  private z = 0;
  private lumAlp = 0;
  private retro = 0;
  private cnt = 0;

  public override init(args: unknown[] | null): void {
    const raw = Array.isArray(args) ? args[0] : args;
    if (!(raw instanceof FragmentInitializer)) {
      throw new Error("Fragment.init requires FragmentInitializer");
    }
    this.pos = Array.from({ length: Fragment.POINT_NUM }, () => new Vector());
    this.vel = Array.from({ length: Fragment.POINT_NUM }, () => new Vector());
    this.impact = new Vector();
  }

  public set(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    z: number,
    speed: number,
    deg: number,
  ): void {
    const r1 = Fragment.rand.nextFloat(1);
    const r2 = Fragment.rand.nextFloat(1);
    this.pos[0].x = x1 * r1 + x2 * (1 - r1);
    this.pos[0].y = y1 * r1 + y2 * (1 - r1);
    this.pos[1].x = x1 * r2 + x2 * (1 - r2);
    this.pos[1].y = y1 * r2 + y2 * (1 - r2);
    for (let i = 0; i < Fragment.POINT_NUM; i++) {
      this.vel[i].x = Fragment.rand.nextSignedFloat(1) * speed;
      this.vel[i].y = Fragment.rand.nextSignedFloat(1) * speed;
    }
    this.impact.x = Math.sin(deg) * speed * 4;
    this.impact.y = Math.cos(deg) * speed * 4;
    this.z = z;
    this.cnt = 32 + Fragment.rand.nextInt(24);
    this.lumAlp = 0.8 + Fragment.rand.nextFloat(0.2);
    this.retro = 1;
    this.exists = true;
  }

  public override move(): void {
    this.cnt--;
    if (this.cnt < 0) {
      this.exists = false;
      return;
    }
    for (let i = 0; i < Fragment.POINT_NUM; i++) {
      this.pos[i].opAddAssign(this.vel[i]);
      this.pos[i].opAddAssign(this.impact);
      this.vel[i].opMulAssign(0.98);
    }
    this.impact.opMulAssign(0.95);
    this.lumAlp *= 0.98;
    this.retro *= 0.97;
  }

  public override draw(): void {
    P47Screen.setRetroZ(this.z);
    P47Screen.setRetroParam(this.retro, 0.2);
    P47Screen.drawLineRetro(this.pos[0].x, this.pos[0].y, this.pos[1].x, this.pos[1].y);
  }

  public override drawLuminous(): void {
    if (this.lumAlp < 0.2) return;
    Screen3D.setColor(Fragment.R, Fragment.G, Fragment.B, this.lumAlp);
    Screen3D.glVertex3f(this.pos[0].x, this.pos[0].y, this.z);
    Screen3D.glVertex3f(this.pos[1].x, this.pos[1].y, this.z);
  }
}

export class FragmentInitializer {}
