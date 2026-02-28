import type { GLCompatStaticMesh } from "../util/sdl/glcompat";
import { Screen3D } from "../util/sdl/screen3d";

/**
 * Letters' renderer.
 */
export class LetterRender {
  private static glyphs: GlyphMesh[] = [];
  public static colorIdx = 0;

  public static readonly WHITE = 0;
  public static readonly RED = 1;

  public static changeColor(c: number): void {
    LetterRender.colorIdx = c * LetterRender.LETTER_NUM;
  }

  private static drawLetter(n: number, x: number, y: number, s: number, d: number): void {
    const glyph = LetterRender.glyphs[n + LetterRender.colorIdx];
    if (!glyph) return;
    Screen3D.glPushMatrix();
    Screen3D.glTranslatef(x, y, 0);
    Screen3D.glScalef(s, s, s);
    Screen3D.glRotatef(d, 0, 0, 1);
    LetterRender.drawGlyphMesh(glyph);
    Screen3D.glPopMatrix();
  }

  public static readonly TO_RIGHT = 0;
  public static readonly TO_DOWN = 1;
  public static readonly TO_LEFT = 2;
  public static readonly TO_UP = 3;

  public static drawString(str: string, lx: number, y: number, s: number, d: number): void {
    let x = lx;
    let ld = 0;
    switch (d) {
      case LetterRender.TO_RIGHT:
        ld = 0;
        break;
      case LetterRender.TO_DOWN:
        ld = 90;
        break;
      case LetterRender.TO_LEFT:
        ld = 180;
        break;
      case LetterRender.TO_UP:
        ld = 270;
        break;
    }
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ch !== " ") {
        const c = ch.charCodeAt(0);
        let idx: number;
        if (c >= 48 && c <= 57) {
          idx = c - 48;
        } else if (c >= 65 && c <= 90) {
          idx = c - 65 + 10;
        } else if (c >= 97 && c <= 122) {
          idx = c - 97 + 10;
        } else if (ch === ".") {
          idx = 36;
        } else if (ch === "-") {
          idx = 38;
        } else if (ch === "+") {
          idx = 39;
        } else {
          idx = 37;
        }
        LetterRender.drawLetter(idx, x, y, s, ld);
      }
      switch (d) {
        case LetterRender.TO_RIGHT:
          x += s * 1.7;
          break;
        case LetterRender.TO_DOWN:
          y += s * 1.7;
          break;
        case LetterRender.TO_LEFT:
          x -= s * 1.7;
          break;
        case LetterRender.TO_UP:
          y -= s * 1.7;
          break;
      }
    }
  }

  public static drawNum(num: number, lx: number, y: number, s: number, d: number): void {
    let n = Math.trunc(num);
    let x = lx;
    let ld = 0;
    switch (d) {
      case LetterRender.TO_RIGHT:
        ld = 0;
        break;
      case LetterRender.TO_DOWN:
        ld = 90;
        break;
      case LetterRender.TO_LEFT:
        ld = 180;
        break;
      case LetterRender.TO_UP:
        ld = 270;
        break;
    }
    for (;;) {
      LetterRender.drawLetter(n % 10, x, y, s, ld);
      switch (d) {
        case LetterRender.TO_RIGHT:
          x -= s * 1.7;
          break;
        case LetterRender.TO_DOWN:
          y -= s * 1.7;
          break;
        case LetterRender.TO_LEFT:
          x += s * 1.7;
          break;
        case LetterRender.TO_UP:
          y += s * 1.7;
          break;
      }
      n = Math.trunc(n / 10);
      if (n <= 0) break;
    }
  }

  private static buildGlyphMesh(idx: number, r: number, g: number, b: number): GlyphMesh {
    const solidVertices: number[] = [];
    const solidColors: number[] = [];
    const lineVertices: number[] = [];
    const lineColors: number[] = [];
    for (let i = 0; ; i++) {
      let deg = LetterRender.spData[idx][i][4] | 0;
      if (deg > 99990) break;
      let x = -LetterRender.spData[idx][i][0];
      const y = -LetterRender.spData[idx][i][1];
      let size = LetterRender.spData[idx][i][2];
      let length = LetterRender.spData[idx][i][3];
      size *= 0.66;
      length *= 0.6;
      x = -x;
      deg %= 180;
      if (deg <= 45 || deg > 135) {
        LetterRender.appendBoxGeometry(x, y, size, length, r, g, b, solidVertices, solidColors, lineVertices, lineColors);
      } else {
        LetterRender.appendBoxGeometry(x, y, length, size, r, g, b, solidVertices, solidColors, lineVertices, lineColors);
      }
    }
    const solidMesh =
      solidVertices.length > 0 ? Screen3D.glCreateStaticMesh(Screen3D.GL_QUADS, solidVertices, solidColors) : null;
    const lineMesh = lineVertices.length > 0 ? Screen3D.glCreateStaticMesh(Screen3D.GL_LINES, lineVertices, lineColors) : null;
    return {
      solidVertices,
      solidColors,
      lineVertices,
      lineColors,
      solidMesh,
      lineMesh,
    };
  }

  private static appendBoxGeometry(
    x: number,
    y: number,
    width: number,
    height: number,
    r: number,
    g: number,
    b: number,
    solidVertices: number[],
    solidColors: number[],
    lineVertices: number[],
    lineColors: number[],
  ): void {
    const x1 = x - width;
    const y1 = y - height;
    const x2 = x + width;
    const y2 = y + height;
    solidVertices.push(x1, y1, 0, x2, y1, 0, x2, y2, 0, x1, y2, 0);
    for (let i = 0; i < 4; i++) {
      solidColors.push(r, g, b, 0.5);
    }
    lineVertices.push(x1, y1, 0, x2, y1, 0, x2, y1, 0, x2, y2, 0, x2, y2, 0, x1, y2, 0, x1, y2, 0, x1, y1, 0);
    for (let i = 0; i < 8; i++) {
      lineColors.push(r, g, b, 1);
    }
  }

  private static drawGlyphMesh(glyph: GlyphMesh): void {
    if (glyph.solidMesh && glyph.lineMesh) {
      Screen3D.glDrawStaticMesh(glyph.solidMesh);
      Screen3D.glDrawStaticMesh(glyph.lineMesh);
      return;
    }
    if (glyph.solidVertices.length > 0) {
      Screen3D.glDrawArrays(Screen3D.GL_QUADS, glyph.solidVertices, glyph.solidColors);
    }
    if (glyph.lineVertices.length > 0) {
      Screen3D.glDrawArrays(Screen3D.GL_LINES, glyph.lineVertices, glyph.lineColors);
    }
  }

  private static readonly LETTER_NUM = 42;

  public static createDisplayLists(): void {
    LetterRender.deleteDisplayLists();
    const glyphs: GlyphMesh[] = [];
    for (let i = 0; i < LetterRender.LETTER_NUM; i++) {
      glyphs.push(LetterRender.buildGlyphMesh(i, 1, 1, 1));
    }
    for (let i = 0; i < LetterRender.LETTER_NUM; i++) {
      glyphs.push(LetterRender.buildGlyphMesh(i, 1, 0.7, 0.7));
    }
    LetterRender.glyphs = glyphs;
    LetterRender.colorIdx = 0;
  }

  public static deleteDisplayLists(): void {
    for (const glyph of LetterRender.glyphs) {
      if (glyph.solidMesh) Screen3D.glDeleteStaticMesh(glyph.solidMesh);
      if (glyph.lineMesh) Screen3D.glDeleteStaticMesh(glyph.lineMesh);
    }
    LetterRender.glyphs = [];
  }

  private static readonly spData: number[][][] = [
    [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.6, 0.55, 0.65, 0.3, 90], [0.6, 0.55, 0.65, 0.3, 90],
      [-0.6, -0.55, 0.65, 0.3, 90], [0.6, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 0.55, 0.65, 0.3, 90],
      [0, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [0.65, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [0.65, 0.55, 0.65, 0.3, 90],
      [0.65, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      // A
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.1, 1.15, 0.45, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.45, 0.55, 0.65, 0.3, 90],
      [-0.1, 0, 0.45, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.1, 1.15, 0.45, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.45, 0.4, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      // F
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90],
      [0.25, 0, 0.25, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 0.55, 0.65, 0.3, 90],
      [0, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.65, 0.55, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.75, 0.25, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      // K
      [-0.65, 0.55, 0.65, 0.3, 90], [0.45, 0.55, 0.65, 0.3, 90],
      [-0.1, 0, 0.45, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.65, 0.55, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.3, 1.15, 0.25, 0.3, 0], [0.3, 1.15, 0.25, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, 0.55, 0.65, 0.3, 90],
      [0, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      // P
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0.2, -0.6, 0.45, 0.3, 360 - 300],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [-0.1, 0, 0.45, 0.3, 0],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.45, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [-0.65, 0.55, 0.65, 0.3, 90],
      [0, 0, 0.65, 0.3, 0],
      [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.4, 1.15, 0.45, 0.3, 0], [0.4, 1.15, 0.45, 0.3, 0],
      [0, 0.55, 0.65, 0.3, 90],
      [0, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      // U
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [-0.5, -0.55, 0.65, 0.3, 90], [0.5, -0.55, 0.65, 0.3, 90],
      [0, -1.15, 0.45, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.65, 0.55, 0.65, 0.3, 90], [0.65, 0.55, 0.65, 0.3, 90],
      [-0.65, -0.55, 0.65, 0.3, 90], [0.65, -0.55, 0.65, 0.3, 90],
      [-0.3, -1.15, 0.25, 0.3, 0], [0.3, -1.15, 0.25, 0.3, 0],
      [0, 0.55, 0.65, 0.3, 90],
      [0, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.4, 0.6, 0.85, 0.3, 360 - 120],
      [0.4, 0.6, 0.85, 0.3, 360 - 60],
      [-0.4, -0.6, 0.85, 0.3, 360 - 240],
      [0.4, -0.6, 0.85, 0.3, 360 - 300],
      [0, 0, 0, 0, 99999],
    ], [
      [-0.4, 0.6, 0.85, 0.3, 360 - 120],
      [0.4, 0.6, 0.85, 0.3, 360 - 60],
      [0, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      [0, 1.15, 0.65, 0.3, 0],
      [0.35, 0.5, 0.65, 0.3, 360 - 60],
      [-0.35, -0.5, 0.65, 0.3, 360 - 240],
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      // .
      [0, -1.15, 0.05, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      // _
      [0, -1.15, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      // -
      [0, 0, 0.65, 0.3, 0],
      [0, 0, 0, 0, 99999],
    ], [
      //+
      [-0.4, 0, 0.45, 0.3, 0], [0.4, 0, 0.45, 0.3, 0],
      [0, 0.55, 0.65, 0.3, 90],
      [0, -0.55, 0.65, 0.3, 90],
      [0, 0, 0, 0, 99999],
    ], [
      //'
      [0, 1.0, 0.4, 0.2, 90],
      [0, 0, 0, 0, 99999],
    ], [
      //''
      [-0.19, 1.0, 0.4, 0.2, 90],
      [0.2, 1.0, 0.4, 0.2, 90],
      [0, 0, 0, 0, 99999],
    ],
  ];
}

interface GlyphMesh {
  solidVertices: number[];
  solidColors: number[];
  lineVertices: number[];
  lineColors: number[];
  solidMesh: GLCompatStaticMesh | null;
  lineMesh: GLCompatStaticMesh | null;
}
