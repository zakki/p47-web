import { BulletMLParserAsset } from "../util/bulletml/runtime";
import { Logger } from "../util/logger";

type ImportMetaWithGlob = ImportMeta & {
  glob<T = unknown>(
    pattern: string,
    options: { eager: true; import: "default"; query: "?raw" },
  ): Record<string, T>;
};

type BarrageParser = BulletMLParserAsset;

export class BarrageManager {
  public static readonly MORPH = 0;
  public static readonly SMALL = 1;
  public static readonly SMALLMOVE = 2;
  public static readonly SMALLSIDEMOVE = 3;
  public static readonly MIDDLE = 4;
  public static readonly MIDDLESUB = 5;
  public static readonly MIDDLEMOVE = 6;
  public static readonly MIDDLEBACKMOVE = 7;
  public static readonly LARGE = 8;
  public static readonly LARGEMOVE = 9;
  public static readonly MORPH_LOCK = 10;
  public static readonly SMALL_LOCK = 11;
  public static readonly MIDDLESUB_LOCK = 12;

  public readonly BARRAGE_TYPE = 13;
  public readonly BARRAGE_MAX = 64;

  public readonly parser: Array<Array<BarrageParser | null>>;
  public readonly parserNum: number[];

  private readonly dirName = [
    "morph",
    "small",
    "smallmove",
    "smallsidemove",
    "middle",
    "middlesub",
    "middlemove",
    "middlebackmove",
    "large",
    "largemove",
    "morph_lock",
    "small_lock",
    "middlesub_lock",
  ] as const;

  public constructor() {
    this.parser = Array.from({ length: this.BARRAGE_TYPE }, () =>
      Array<BarrageParser | null>(this.BARRAGE_MAX).fill(null),
    );
    this.parserNum = Array<number>(this.BARRAGE_TYPE).fill(0);
  }

  public async loadBulletMLs(): Promise<void> {
    const sourceByDir = this.collectXmlTextByDir();
    const preloads: Array<Promise<void>> = [];
    for (let i = 0; i < this.BARRAGE_TYPE; i++) {
      const dir = this.dirName[i];
      const files = sourceByDir.get(dir) ?? [];
      let j = 0;
      for (const file of files) {
        if (j >= this.BARRAGE_MAX) break;
        const barrageName = `${dir}/${file.name}`;
        Logger.info(`Load BulletML: ${barrageName}`);
        const parser = new BulletMLParserAsset(
          barrageName,
          `data:text/xml;charset=utf-8,${encodeURIComponent(file.xmlText)}`,
        );
        this.parser[i][j] = parser;
        preloads.push(parser.preload());
        j++;
      }
      this.parserNum[i] = j;
    }
    await Promise.all(preloads);
  }

  public unloadBulletMLs(): void {
    for (let i = 0; i < this.BARRAGE_TYPE; i++) {
      for (let j = 0; j < this.parserNum[i]; j++) {
        this.parser[i][j] = null;
      }
      this.parserNum[i] = 0;
    }
  }

  private collectXmlTextByDir(): Map<string, Array<{ name: string; xmlText: string }>> {
    // @ts-expect-error TS1470:
    // This project currently typechecks in CommonJS mode, but Vite runtime supports import.meta.glob.
    const xmlFiles = (import.meta as ImportMetaWithGlob).glob<string>(
      "../../../{morph,small,smallmove,smallsidemove,middle,middlesub,middlemove,middlebackmove,large,largemove,morph_lock,small_lock,middlesub_lock}/*.xml",
      { eager: true, import: "default", query: "?raw" },
    );
    const map = new Map<string, Array<{ name: string; xmlText: string }>>();
    for (const [path, xmlText] of Object.entries(xmlFiles)) {
      const m = path.match(/\/([^/]+)\/([^/]+\.xml)$/);
      if (!m) continue;
      const dir = m[1];
      const name = m[2];
      const list = map.get(dir);
      if (list) {
        list.push({ name, xmlText });
      } else {
        map.set(dir, [{ name, xmlText }]);
      }
    }
    return map;
  }
}

// PORT_NOTE[D:BarrageManager.d#loadBulletMLs]:
// D版は同期的に BulletMLParserTinyXML を構築するが、Web版は fetch/DOMParser 経由で非同期ロードが必要。
// Web版は GameManager 側でロード完了待機を行ってからタイトル開始する。
