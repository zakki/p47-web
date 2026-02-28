import type { PrefManager as PrefManagerBase } from "../util/prefmanager";

export class P47PrefManager implements PrefManagerBase {
  public static readonly PREV_VERSION_NUM = 10;
  public static readonly VERSION_NUM = 20;
  private static readonly PREF_FILE = "p47.prf";
  public static readonly MODE_NUM = 2;
  public static readonly DIFFICULTY_NUM = 4;
  public static readonly REACHED_PARSEC_SLOT_NUM = 10;

  public hiScore: number[][][] = [];
  public reachedParsec: number[][] = [];
  public selectedDifficulty = 1;
  public selectedParsecSlot = 0;
  public selectedMode = 0;

  public constructor() {
    this.init();
  }

  private init(): void {
    this.reachedParsec = [];
    this.hiScore = [];
    for (let k = 0; k < P47PrefManager.MODE_NUM; k++) {
      const reachedByDifficulty: number[] = [];
      const scoreByDifficulty: number[][] = [];
      for (let i = 0; i < P47PrefManager.DIFFICULTY_NUM; i++) {
        reachedByDifficulty.push(0);
        const scoreBySlot: number[] = [];
        for (let j = 0; j < P47PrefManager.REACHED_PARSEC_SLOT_NUM; j++) {
          scoreBySlot.push(0);
        }
        scoreByDifficulty.push(scoreBySlot);
      }
      this.reachedParsec.push(reachedByDifficulty);
      this.hiScore.push(scoreByDifficulty);
    }
    this.selectedDifficulty = 1;
    this.selectedParsecSlot = 0;
    this.selectedMode = 0;
  }

  private loadPrevVersionData(data: unknown): void {
    const obj = asRecord(data);
    for (let i = 0; i < P47PrefManager.DIFFICULTY_NUM; i++) {
      this.reachedParsec[0][i] = readIntFromNestedArray(obj, ["reachedParsec", i]);
      for (let j = 0; j < P47PrefManager.REACHED_PARSEC_SLOT_NUM; j++) {
        this.hiScore[0][i][j] = readIntFromNestedArray(obj, ["hiScore", i, j]);
      }
    }
    this.selectedDifficulty = readInt(obj, "selectedDifficulty");
    this.selectedParsecSlot = readInt(obj, "selectedParsecSlot");
  }

  public load(): void {
    try {
      const raw = storageGet(P47PrefManager.PREF_FILE);
      if (!raw) throw new Error("No pref data");
      const data = JSON.parse(raw) as unknown;
      const obj = asRecord(data);
      const version = readInt(obj, "version");

      if (version === P47PrefManager.PREV_VERSION_NUM) {
        this.init();
        this.loadPrevVersionData(obj);
        return;
      }
      if (version !== P47PrefManager.VERSION_NUM) {
        throw new Error("Wrong version num");
      }

      for (let k = 0; k < P47PrefManager.MODE_NUM; k++) {
        for (let i = 0; i < P47PrefManager.DIFFICULTY_NUM; i++) {
          this.reachedParsec[k][i] = readIntFromNestedArray(obj, ["reachedParsec", k, i]);
          for (let j = 0; j < P47PrefManager.REACHED_PARSEC_SLOT_NUM; j++) {
            this.hiScore[k][i][j] = readIntFromNestedArray(obj, ["hiScore", k, i, j]);
          }
        }
      }
      this.selectedDifficulty = readInt(obj, "selectedDifficulty");
      this.selectedParsecSlot = readInt(obj, "selectedParsecSlot");
      this.selectedMode = readInt(obj, "selectedMode");
    } catch {
      this.init();
    }
  }

  public save(): void {
    // PORT_NOTE[D:P47PrefManager.d#save-load]:
    // D版の std.stream.File によるバイナリ保存は Web 実行環境で利用不可。
    // 影響: 保存媒体がローカルファイルから localStorage(JSON) に変わる。
    // TODO: ネイティブ版との完全互換が必要なら ArrayBuffer + 固定レイアウトで再実装する。
    const data = {
      version: P47PrefManager.VERSION_NUM,
      reachedParsec: this.reachedParsec,
      hiScore: this.hiScore,
      selectedDifficulty: this.selectedDifficulty,
      selectedParsecSlot: this.selectedParsecSlot,
      selectedMode: this.selectedMode,
    };
    storageSet(
      P47PrefManager.PREF_FILE,
      JSON.stringify(data),
    );
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Invalid pref data");
  }
  return value as Record<string, unknown>;
}

function readInt(obj: Record<string, unknown>, key: string): number {
  const value = obj[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid integer value: ${key}`);
  }
  return value | 0;
}

function readIntFromNestedArray(obj: Record<string, unknown>, path: Array<string | number>): number {
  let cur: unknown = obj[path[0]];
  for (let i = 1; i < path.length; i++) {
    const idx = path[i];
    if (!Array.isArray(cur)) {
      throw new Error(`Invalid array path: ${path.join(".")}`);
    }
    cur = cur[idx as number];
  }
  if (typeof cur !== "number" || !Number.isFinite(cur)) {
    throw new Error(`Invalid integer value: ${path.join(".")}`);
  }
  return cur | 0;
}

function storageGet(key: string): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(key);
}

function storageSet(key: string, value: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, value);
}
