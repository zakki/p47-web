import { Screen3D } from "../util/sdl/screen3d";

/**
 * Luminous effect texture.
 */
export class LuminousScreen {
  private luminousTexture: WebGLTexture | null = null;
  private readonly LUMINOUS_TEXTURE_WIDTH_MAX = 64;
  private readonly LUMINOUS_TEXTURE_HEIGHT_MAX = 64;
  private td = new Uint32Array(this.LUMINOUS_TEXTURE_WIDTH_MAX * this.LUMINOUS_TEXTURE_HEIGHT_MAX * 4);
  private luminousTextureWidth = 64;
  private luminousTextureHeight = 64;
  private screenWidth = 0;
  private screenHeight = 0;
  private luminous = 0;
  private captureCanvas: HTMLCanvasElement | null = null;
  private readonly lmOfs: number[][] = [
    [0, 0],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  private readonly lmOfsBs = 5;

  private makeLuminousTexture(): void {
    this.td.fill(0);
    const gl = Screen3D.gl;
    if (!gl || typeof document === "undefined") {
      this.luminousTexture = null;
      return;
    }
    if (!this.captureCanvas) {
      this.captureCanvas = document.createElement("canvas");
    }
    this.captureCanvas.width = this.luminousTextureWidth;
    this.captureCanvas.height = this.luminousTextureHeight;
    const ctx = this.captureCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, this.luminousTextureWidth, this.luminousTextureHeight);
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, this.luminousTextureWidth, this.luminousTextureHeight);
    }
    this.luminousTexture = gl.createTextureFromImage(this.captureCanvas);
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
    if (this.luminousTexture) {
      Screen3D.gl?.deleteTexture(this.luminousTexture);
      this.luminousTexture = null;
    }
  }

  public startRenderToTexture(): void {
    // PORT_NOTE[D:LuminousScreen.d#startRenderToTexture]:
    // D版のglViewport(0,0,64,64)はWeb移植基盤ではキャンバス全体リサイズ副作用を持つため未再現。
    // 影響: 発光元の取得解像度は描画ターゲット依存になる。
    // TODO: FBO相当をGLCompatに追加して忠実なレンダーターゲット切替を実装。
  }

  public endRenderToTexture(): void {
    const gl = Screen3D.gl;
    const src = Screen3D.canvas;
    if (!gl || !src || typeof document === "undefined") return;
    if (!this.captureCanvas) {
      this.captureCanvas = document.createElement("canvas");
    }
    this.captureCanvas.width = this.luminousTextureWidth;
    this.captureCanvas.height = this.luminousTextureHeight;
    const ctx = this.captureCanvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, this.luminousTextureWidth, this.luminousTextureHeight);
    ctx.drawImage(src, 0, 0, this.luminousTextureWidth, this.luminousTextureHeight);
    const nextTexture = gl.createTextureFromImage(this.captureCanvas);
    if (!nextTexture) return;
    if (this.luminousTexture) {
      gl.deleteTexture(this.luminousTexture);
    }
    this.luminousTexture = nextTexture;
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
    if (!this.luminousTexture) return;
    Screen3D.glEnable(Screen3D.GL_TEXTURE_2D);
    Screen3D.gl?.bindTexture(this.luminousTexture);
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
