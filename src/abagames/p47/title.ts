import { Pad } from "../util/sdl/pad";
import { Screen3D } from "../util/sdl/screen3d";
import { Texture } from "../util/sdl/texture";
import { Field } from "./field";
import { P47GameManager } from "./gamemanager";
import { LetterRender } from "./letterrender";
import { P47PrefManager } from "./prefmanager";
import { P47Screen } from "./screen";

/**
 * Title.
 */
export class Title {
  private pad!: Pad;
  private gameManager!: P47GameManager;
  private prefManager!: P47PrefManager;
  private field!: Field;
  private readonly slotNum: number[][] = [];
  private readonly startReachedParsec: number[][] = [];
  private curX = 0;
  private curY = 0;
  private mode = 0;
  private static readonly BOX_COUNT = 16;
  private boxCnt = 0;
  private titleTexture: Texture | null = null;
  private padPrsd = true;

  private static readonly BOX_SMALL_SIZE = 24;
  private static readonly DIFFICULTY_SHORT_STR = ["P", "N", "H", "E", "Q"] as const;
  private static readonly DIFFICULTY_STR = ["PRACTICE", "NORMAL", "HARD", "EXTREME", "QUIT"] as const;
  private static readonly MODE_STR = ["ROLL", "LOCK"] as const;

  public init(pad: Pad, gameManager: P47GameManager, prefManager: P47PrefManager, field: Field): void {
    this.pad = pad;
    this.gameManager = gameManager;
    this.prefManager = prefManager;
    this.field = field;
    this.gameManager.difficulty = prefManager.selectedDifficulty;
    this.gameManager.parsecSlot = prefManager.selectedParsecSlot;
    this.gameManager.mode = prefManager.selectedMode;
    this.titleTexture = new Texture("title.bmp");

    this.slotNum.length = 0;
    this.startReachedParsec.length = 0;
    for (let mode = 0; mode < P47PrefManager.MODE_NUM; mode++) {
      this.slotNum.push(Array<number>(P47PrefManager.DIFFICULTY_NUM + 1).fill(0));
      this.startReachedParsec.push(Array<number>(P47PrefManager.DIFFICULTY_NUM).fill(0));
    }
  }

  public close(): void {
    this.titleTexture?.deleteTexture();
    this.titleTexture = null;
  }

  public start(): void {
    for (let k = 0; k < P47PrefManager.MODE_NUM; k++) {
      for (let i = 0; i < P47PrefManager.DIFFICULTY_NUM; i++) {
        this.slotNum[k][i] = (((this.prefManager.reachedParsec[k][i] - 1) / 10) | 0) + 1;
        this.startReachedParsec[k][i] = this.slotNum[k][i] * 10 + 1;
        if (this.slotNum[k][i] > 10) {
          this.slotNum[k][i] = 10;
        }
      }
      this.slotNum[k][P47PrefManager.DIFFICULTY_NUM] = 1;
    }
    this.curX = this.gameManager.parsecSlot;
    this.curY = this.gameManager.difficulty;
    this.mode = this.gameManager.mode;
    this.boxCnt = Title.BOX_COUNT;
    this.field.setColor(this.mode);
  }

  public getStartParsec(dif: number, psl: number): number {
    if (psl < P47PrefManager.REACHED_PARSEC_SLOT_NUM - 1) {
      return psl * 10 + 1;
    }
    let rp = this.prefManager.reachedParsec[this.mode][dif];
    rp--;
    rp = ((rp / 10) | 0) * 10;
    rp++;
    return rp;
  }

  public move(): void {
    const ps = this.pad.getDirState();
    if (!this.padPrsd) {
      if (ps & Pad.Dir.DOWN) {
        this.curY++;
        if (this.curY >= this.slotNum[this.mode].length) {
          this.curY = 0;
        }
        if (this.curX >= this.slotNum[this.mode][this.curY]) {
          this.curX = this.slotNum[this.mode][this.curY] - 1;
        }
      } else if (ps & Pad.Dir.UP) {
        this.curY--;
        if (this.curY < 0) {
          this.curY = this.slotNum[this.mode].length - 1;
        }
        if (this.curX >= this.slotNum[this.mode][this.curY]) {
          this.curX = this.slotNum[this.mode][this.curY] - 1;
        }
      } else if (ps & Pad.Dir.RIGHT) {
        this.curX++;
        if (this.curX >= this.slotNum[this.mode][this.curY]) {
          this.curX = 0;
        }
      } else if (ps & Pad.Dir.LEFT) {
        this.curX--;
        if (this.curX < 0) {
          this.curX = this.slotNum[this.mode][this.curY] - 1;
        }
      }
      if (ps !== 0) {
        this.boxCnt = Title.BOX_COUNT;
        this.padPrsd = true;
        this.gameManager.startStage(this.curY, this.curX, this.getStartParsec(this.curY, this.curX), this.mode);
      }
    } else if (ps === 0) {
      this.padPrsd = false;
    }
    if (this.boxCnt >= 0) {
      this.boxCnt--;
    }
  }

  public setStatus(): void {
    this.gameManager.difficulty = this.curY;
    this.gameManager.parsecSlot = this.curX;
    this.gameManager.mode = this.mode;
    if (this.curY < P47PrefManager.DIFFICULTY_NUM) {
      this.prefManager.selectedDifficulty = this.curY;
      this.prefManager.selectedParsecSlot = this.curX;
      this.prefManager.selectedMode = this.mode;
    }
  }

  public changeMode(): void {
    this.mode++;
    if (this.mode >= P47PrefManager.MODE_NUM) {
      this.mode = 0;
    }
    if (this.curX >= this.slotNum[this.mode][this.curY]) {
      this.curX = this.slotNum[this.mode][this.curY] - 1;
    }
    this.field.setColor(this.mode);
    this.gameManager.startStage(this.curY, this.curX, this.getStartParsec(this.curY, this.curX), this.mode);
  }

  private drawBox(x: number, y: number, w: number, h: number): void {
    Screen3D.setColor(1, 1, 1, 1);
    P47Screen.drawBoxLine(x, y, w, h);
    Screen3D.setColor(1, 1, 1, 0.5);
    P47Screen.drawBoxSolid(x, y, w, h);
  }

  private drawBoxLight(x: number, y: number, w: number, h: number): void {
    Screen3D.setColor(1, 1, 1, 0.7);
    P47Screen.drawBoxLine(x, y, w, h);
    Screen3D.setColor(1, 1, 1, 0.3);
    P47Screen.drawBoxSolid(x, y, w, h);
  }

  private drawTitleBoard(): void {
    if (!this.titleTexture?.isLoaded) {
      // PORT_NOTE[D:Title.d#drawTitleBoard]:
      // D版は同期テクスチャロード前提だが、Web版 Texture は非同期ロード。
      // 影響: タイトル画像の読み込み完了前フレームでは看板が表示されない。
      // TODO: アセットプリロード完了待ちを導入して初回描画タイミングを揃える。
      return;
    }
    Screen3D.glEnable(Screen3D.GL_TEXTURE_2D);
    this.titleTexture.bind();
    P47Screen.setColor(1, 1, 1, 1);
    Screen3D.glBegin(Screen3D.GL_TRIANGLE_FAN);
    Screen3D.glTexCoord2f(0, 0);
    Screen3D.glVertex3f(180, 20, 0);
    Screen3D.glTexCoord2f(1, 0);
    Screen3D.glVertex3f(308, 20, 0);
    Screen3D.glTexCoord2f(1, 1);
    Screen3D.glVertex3f(308, 148, 0);
    Screen3D.glTexCoord2f(0, 1);
    Screen3D.glVertex3f(180, 148, 0);
    Screen3D.glEnd();
    Screen3D.glDisable(Screen3D.GL_TEXTURE_2D);
  }

  public draw(): void {
    let sx: number;
    let sy: number;
    const difficultyStr = Title.DIFFICULTY_STR[this.curY];
    LetterRender.drawString(difficultyStr, 470 - difficultyStr.length * 14, 150, 10, LetterRender.TO_RIGHT);
    const modeStr = Title.MODE_STR[this.mode];
    LetterRender.drawString(modeStr, 470 - modeStr.length * 14, 450, 10, LetterRender.TO_RIGHT);
    if (this.curX > 0) {
      LetterRender.drawString("START AT PARSEC", 290, 180, 6, LetterRender.TO_RIGHT);
      LetterRender.drawNum(this.getStartParsec(this.curY, this.curX), 470, 180, 6, LetterRender.TO_RIGHT);
    }
    if (this.curY < P47PrefManager.DIFFICULTY_NUM) {
      LetterRender.drawNum(this.prefManager.hiScore[this.mode][this.curY][this.curX], 470, 210, 10, LetterRender.TO_RIGHT);
    }
    sy = 260;
    for (let y = 0; y < P47PrefManager.DIFFICULTY_NUM + 1; y++) {
      sx = 180;
      for (let x = 0; x < this.slotNum[this.mode][y]; x++) {
        if (x === this.curX && y === this.curY) {
          const bs = ((Title.BOX_COUNT - this.boxCnt) / 2) | 0;
          this.drawBox(
            sx - bs,
            sy - bs,
            Title.BOX_SMALL_SIZE + bs * 2,
            Title.BOX_SMALL_SIZE + bs * 2,
          );
          if (x === 0) {
            LetterRender.drawString(Title.DIFFICULTY_SHORT_STR[y], sx + 13, sy + 13, 12, LetterRender.TO_RIGHT);
          } else {
            LetterRender.drawString(Title.DIFFICULTY_SHORT_STR[y], sx + 4, sy + 13, 12, LetterRender.TO_RIGHT);
            if (x >= P47PrefManager.REACHED_PARSEC_SLOT_NUM - 1) {
              LetterRender.drawString("X", sx + 21, sy + 14, 12, LetterRender.TO_RIGHT);
            } else {
              LetterRender.drawNum(x, sx + 22, sy + 13, 12, LetterRender.TO_RIGHT);
            }
          }
        } else {
          this.drawBoxLight(sx, sy, Title.BOX_SMALL_SIZE, Title.BOX_SMALL_SIZE);
        }
        sx += 28;
      }
      sy += 32;
      if (y === P47PrefManager.DIFFICULTY_NUM - 1) {
        sy += 15;
      }
    }
    this.drawTitleBoard();
  }
}
