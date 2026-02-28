import { Screen3D } from "../util/sdl/screen3d";
import { Rand } from "../util/rand";
import { LuminousScreen } from "./luminousscreen";

export class P47Screen extends Screen3D {
  public static readonly CAPTION = "PARSEC47";
  public static luminous = 0;
  private static rand: Rand;
  private static retro = 0;
  private static retroSize = 0.2;
  public static retroR = 1;
  public static retroG = 1;
  public static retroB = 1;
  public static retroA = 1;
  private static retroZ = 0;
  private static readonly RETRO_SEGMENT_MAX = 256;
  private luminousScreen: LuminousScreen | null = null;

  protected override init(): void {
    this.setCaption(P47Screen.CAPTION);
    Screen3D.glLineWidth(1);
    Screen3D.glEnable(Screen3D.GL_LINE_SMOOTH);
    Screen3D.glBlendFunc(Screen3D.GL_SRC_ALPHA, Screen3D.GL_ONE);
    Screen3D.glEnable(Screen3D.GL_BLEND);
    Screen3D.glDisable(Screen3D.GL_LIGHTING);
    Screen3D.glDisable(Screen3D.GL_CULL_FACE);
    Screen3D.glDisable(Screen3D.GL_DEPTH_TEST);
    Screen3D.glDisable(Screen3D.GL_TEXTURE_2D);
    Screen3D.glDisable(Screen3D.GL_COLOR_MATERIAL);
    P47Screen.rand = new Rand();
    if (P47Screen.luminous > 0) {
      this.luminousScreen = new LuminousScreen();
      this.luminousScreen.init(P47Screen.luminous, Screen3D.width, Screen3D.height);
    } else {
      this.luminousScreen = null;
    }
  }

  protected override close(): void {
    this.luminousScreen?.close();
  }

  public startRenderToTexture(): void {
    this.luminousScreen?.startRenderToTexture();
  }

  public endRenderToTexture(): void {
    this.luminousScreen?.endRenderToTexture();
  }

  public drawLuminous(): void {
    this.luminousScreen?.draw();
  }

  public override resized(width: number, height: number): void {
    this.luminousScreen?.resized(width, height);
    super.resized(width, height);
  }

  public viewOrthoFixed(): void {
    Screen3D.glMatrixMode(Screen3D.GL_PROJECTION);
    Screen3D.glPushMatrix();
    Screen3D.glLoadIdentity();
    Screen3D.glOrtho(0, 640, 480, 0, -1, 1);
    Screen3D.glMatrixMode(Screen3D.GL_MODELVIEW);
    Screen3D.glPushMatrix();
    Screen3D.glLoadIdentity();
  }

  public viewPerspective(): void {
    Screen3D.glMatrixMode(Screen3D.GL_PROJECTION);
    Screen3D.glPopMatrix();
    Screen3D.glMatrixMode(Screen3D.GL_MODELVIEW);
    Screen3D.glPopMatrix();
  }

  public static setRetroParam(r: number, sz: number): void {
    P47Screen.retro = r;
    P47Screen.retroSize = sz;
  }

  public static setRetroColor(r: number, g: number, b: number, a: number): void {
    P47Screen.retroR = r;
    P47Screen.retroG = g;
    P47Screen.retroB = b;
    P47Screen.retroA = a;
  }

  public static setRetroZ(z: number): void {
    P47Screen.retroZ = z;
  }

  public static drawLineRetro(x1: number, y1: number, x2: number, y2: number): void {
    if (
      !Number.isFinite(x1) ||
      !Number.isFinite(y1) ||
      !Number.isFinite(x2) ||
      !Number.isFinite(y2)
    ) {
      return;
    }
    const cf = (1 - P47Screen.retro) * 0.5;
    let r = P47Screen.retroR + (1 - P47Screen.retroR) * cf;
    let g = P47Screen.retroG + (1 - P47Screen.retroG) * cf;
    let b = P47Screen.retroB + (1 - P47Screen.retroB) * cf;
    let a = P47Screen.retroA * (cf + 0.5);
    if (P47Screen.rand.nextInt(7) === 0) {
      r = Math.min(r * 1.5, 1);
      g = Math.min(g * 1.5, 1);
      b = Math.min(b * 1.5, 1);
      a = Math.min(a * 1.5, 1);
    }
    Screen3D.setColor(r, g, b, a);
    if (P47Screen.retro < 0.2) {
      Screen3D.glBegin(Screen3D.GL_LINES);
      Screen3D.glVertex3f(x1, y1, P47Screen.retroZ);
      Screen3D.glVertex3f(x2, y2, P47Screen.retroZ);
      Screen3D.glEnd();
      return;
    }
    const ds = P47Screen.retroSize * P47Screen.retro;
    if (!Number.isFinite(ds) || ds <= 0.0001) {
      Screen3D.glBegin(Screen3D.GL_LINES);
      Screen3D.glVertex3f(x1, y1, P47Screen.retroZ);
      Screen3D.glVertex3f(x2, y2, P47Screen.retroZ);
      Screen3D.glEnd();
      return;
    }
    const ds2 = ds / 2;
    const lx = Math.abs(x2 - x1);
    const ly = Math.abs(y2 - y1);
    Screen3D.glBegin(Screen3D.GL_QUADS);
    if (lx < ly) {
      const n = Math.min(Math.floor(ly / ds), P47Screen.RETRO_SEGMENT_MAX);
      if (n > 0) {
        const xo = (x2 - x1) / n;
        let xos = 0;
        const yo = y2 < y1 ? -ds : ds;
        let x = x1;
        let y = y1;
        for (let i = 0; i <= n; i++, xos += xo, y += yo) {
          if (xos >= ds) {
            x += ds;
            xos -= ds;
          } else if (xos <= -ds) {
            x -= ds;
            xos += ds;
          }
          Screen3D.glVertex3f(x - ds2, y - ds2, P47Screen.retroZ);
          Screen3D.glVertex3f(x + ds2, y - ds2, P47Screen.retroZ);
          Screen3D.glVertex3f(x + ds2, y + ds2, P47Screen.retroZ);
          Screen3D.glVertex3f(x - ds2, y + ds2, P47Screen.retroZ);
        }
      }
    } else {
      const n = Math.min(Math.floor(lx / ds), P47Screen.RETRO_SEGMENT_MAX);
      if (n > 0) {
        const yo = (y2 - y1) / n;
        let yos = 0;
        const xo = x2 < x1 ? -ds : ds;
        let x = x1;
        let y = y1;
        for (let i = 0; i <= n; i++, x += xo, yos += yo) {
          if (yos >= ds) {
            y += ds;
            yos -= ds;
          } else if (yos <= -ds) {
            y -= ds;
            yos += ds;
          }
          Screen3D.glVertex3f(x - ds2, y - ds2, P47Screen.retroZ);
          Screen3D.glVertex3f(x + ds2, y - ds2, P47Screen.retroZ);
          Screen3D.glVertex3f(x + ds2, y + ds2, P47Screen.retroZ);
          Screen3D.glVertex3f(x - ds2, y + ds2, P47Screen.retroZ);
        }
      }
    }
    Screen3D.glEnd();
  }

  public static drawBoxRetro(x: number, y: number, width: number, height: number, deg: number): void {
    const w1 = width * Math.cos(deg) - height * Math.sin(deg);
    const h1 = width * Math.sin(deg) + height * Math.cos(deg);
    const w2 = -width * Math.cos(deg) - height * Math.sin(deg);
    const h2 = -width * Math.sin(deg) + height * Math.cos(deg);
    P47Screen.drawLineRetro(x + w2, y - h2, x + w1, y - h1);
    P47Screen.drawLineRetro(x + w1, y - h1, x - w2, y + h2);
    P47Screen.drawLineRetro(x - w2, y + h2, x - w1, y + h1);
    P47Screen.drawLineRetro(x - w1, y + h1, x + w2, y - h2);
  }

  public static drawBoxLine(x: number, y: number, width: number, height: number): void {
    Screen3D.glBegin(Screen3D.GL_LINE_LOOP);
    Screen3D.glVertex3f(x, y, 0);
    Screen3D.glVertex3f(x + width, y, 0);
    Screen3D.glVertex3f(x + width, y + height, 0);
    Screen3D.glVertex3f(x, y + height, 0);
    Screen3D.glEnd();
  }

  public static drawBoxSolid(x: number, y: number, width: number, height: number): void {
    Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
    Screen3D.glVertex3f(x, y, 0);
    Screen3D.glVertex3f(x + width, y, 0);
    Screen3D.glVertex3f(x + width, y + height, 0);
    Screen3D.glVertex3f(x, y + height, 0);
    Screen3D.glEnd();
  }
}
