import { GameManager as BaseGameManager } from "../util/sdl/gamemanager";
import { Pad } from "../util/sdl/pad";
import { Screen3D } from "../util/sdl/screen3d";
import type { P47PrefManager } from "./prefmanager";

const SDL_PRESSED = 1;
const SDLK_ESCAPE = 27;
const SDLK_p = 80;

export class P47GameManager extends BaseGameManager {
  public nowait = false;
  public score = 0;
  private pad!: Pad;
  private prefManager!: P47PrefManager;
  private frame = 0;
  private pause = false;
  private escPressed = false;
  private pausePressed = false;

  public override init(): void {
    this.pad = this.input as Pad;
    this.prefManager = this.abstPrefManager as P47PrefManager;
  }

  public override start(): void {
    this.frame = 0;
  }

  public override close(): void {}

  public override move(): void {
    if (this.pad.keys[SDLK_ESCAPE] === SDL_PRESSED) {
      if (!this.escPressed) {
        this.mainLoop.breakLoop();
        return;
      }
      this.escPressed = true;
    } else {
      this.escPressed = false;
    }

    if (this.pad.keys[SDLK_p] === SDL_PRESSED) {
      if (!this.pausePressed) this.pause = !this.pause;
      this.pausePressed = true;
    } else {
      this.pausePressed = false;
    }

    if (!this.pause) this.frame++;
  }

  public override draw(): void {
    const t = this.frame * 0.02;
    const cx = Screen3D.width * 0.5;
    const cy = Screen3D.height * 0.5;
    const r = Math.min(Screen3D.width, Screen3D.height) * 0.2;

    Screen3D.setColor(0.35, 0.9, 1, 0.5);
    Screen3D.glBegin(Screen3D.GL_LINE_LOOP);
    for (let i = 0; i < 64; i++) {
      const a = ((Math.PI * 2) / 64) * i + t;
      Screen3D.glVertexXYZ(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0);
    }
    Screen3D.glEnd();

    const ctx = Screen3D.ctx2d;
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(160, 255, 200, 0.92)";
    ctx.font = "16px monospace";
    ctx.fillText("PARSEC47 WEB PORT", 20, 26);
    ctx.fillStyle = "rgba(180, 220, 255, 0.85)";
    ctx.font = "13px monospace";
    ctx.fillText("Phase0 scaffold from tt-web runtime", 20, 48);
    ctx.fillText("Original source: p47/src/abagames/p47/*.d", 20, 66);
    ctx.fillText(`HI-SCORE: ${this.prefManager.hiScore}`, 20, 90);
    ctx.fillText("Controls: Arrow / Z / X / P / ESC", 20, 114);
    if (this.pause) ctx.fillText("PAUSE", 20, 138);
    ctx.restore();
  }

  public addScore(sc: number): void {
    this.score += sc;
  }
}
