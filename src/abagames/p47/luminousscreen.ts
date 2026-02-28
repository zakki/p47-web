import { Screen3D } from "../util/sdl/screen3d";
import type { GLCompatRenderTarget } from "../util/sdl/glcompat";

/**
 * Luminous effect texture.
 */
export class LuminousScreen {
  private renderTarget: GLCompatRenderTarget | null = null;
  private readonly LUMINOUS_TEXTURE_WIDTH_MAX = 64;
  private readonly LUMINOUS_TEXTURE_HEIGHT_MAX = 64;
  private luminousTextureWidth = 64;
  private luminousTextureHeight = 64;
  private screenWidth = 0;
  private screenHeight = 0;
  private luminous = 0;
  private renderingToTexture = false;
  private readonly lmOfs: number[][] = [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  private readonly lmOfsBs = 5;

  private makeLuminousTexture(): void {
    const gl = Screen3D.gl;
    if (!gl) {
      this.renderTarget = null;
      return;
    }
    if (this.renderTarget) {
      gl.deleteRenderTarget(this.renderTarget);
      this.renderTarget = null;
    }
    this.renderTarget = gl.createRenderTarget(this.luminousTextureWidth, this.luminousTextureHeight);
  }

  public init(luminous: number, width: number, height: number): void {
    this.makeLuminousTexture();
    this.luminous = luminous;
    this.resized(width, height);
  }

  public resized(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  public close(): void {
    if (this.renderTarget) {
      Screen3D.gl?.deleteRenderTarget(this.renderTarget);
      this.renderTarget = null;
    }
    this.renderingToTexture = false;
  }

  public startRenderToTexture(): void {
    if (!this.renderTarget) return;
    Screen3D.gl?.beginRenderTarget(this.renderTarget);
    this.renderingToTexture = true;
    Screen3D.glClear(Screen3D.GL_COLOR_BUFFER_BIT);
  }

  public endRenderToTexture(): void {
    if (!this.renderingToTexture) return;
    Screen3D.gl?.endRenderTarget();
    this.renderingToTexture = false;
  }

  public startRender(): void {
    this.startRenderToTexture();
  }

  public endRender(): void {
    this.endRenderToTexture();
  }

  private viewOrtho(): void {
    Screen3D.glMatrixMode(Screen3D.GL_PROJECTION);
    Screen3D.glPushMatrix();
    Screen3D.glLoadIdentity();
    Screen3D.glOrtho(0, this.screenWidth, this.screenHeight, 0, -1, 1);
    Screen3D.glMatrixMode(Screen3D.GL_MODELVIEW);
    Screen3D.glPushMatrix();
    Screen3D.glLoadIdentity();
  }

  private viewPerspective(): void {
    Screen3D.glMatrixMode(Screen3D.GL_PROJECTION);
    Screen3D.glPopMatrix();
    Screen3D.glMatrixMode(Screen3D.GL_MODELVIEW);
    Screen3D.glPopMatrix();
  }

  public draw(): void {
    if (!this.renderTarget) return;
    Screen3D.glEnable(Screen3D.GL_TEXTURE_2D);
    Screen3D.gl?.bindTexture(this.renderTarget.texture);
    this.viewOrtho();
    Screen3D.setColor(1, 0.8, 0.9, this.luminous);
    Screen3D.glBegin(Screen3D.GL_QUADS);
    for (let i = 0; i < 5; i++) {
      Screen3D.glTexCoord2f(0, 1);
      Screen3D.glVertex3f(0 + this.lmOfs[i][0] * this.lmOfsBs, 0 + this.lmOfs[i][1] * this.lmOfsBs, 0);
      Screen3D.glTexCoord2f(0, 0);
      Screen3D.glVertex3f(0 + this.lmOfs[i][0] * this.lmOfsBs, this.screenHeight + this.lmOfs[i][1] * this.lmOfsBs, 0);
      Screen3D.glTexCoord2f(1, 0);
      Screen3D.glVertex3f(
        this.screenWidth + this.lmOfs[i][0] * this.lmOfsBs,
        this.screenHeight + this.lmOfs[i][0] * this.lmOfsBs,
        0,
      );
      Screen3D.glTexCoord2f(1, 1);
      Screen3D.glVertex3f(this.screenWidth + this.lmOfs[i][0] * this.lmOfsBs, 0 + this.lmOfs[i][0] * this.lmOfsBs, 0);
    }
    Screen3D.glEnd();
    this.viewPerspective();
    Screen3D.glDisable(Screen3D.GL_TEXTURE_2D);
  }
}
