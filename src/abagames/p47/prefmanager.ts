import type { PrefManager as PrefManagerBase } from "../util/prefmanager";

export class P47PrefManager implements PrefManagerBase {
  private static readonly VERSION = 1;
  private static readonly PREF_FILE = "p47.prf";
  public hiScore = 0;

  public load(): void {
    try {
      const raw = storageGet(P47PrefManager.PREF_FILE);
      if (!raw) throw new Error("No pref data");
      const data = JSON.parse(raw) as { version: number; hiScore: number };
      if (data.version !== P47PrefManager.VERSION) throw new Error("Version mismatch");
      this.hiScore = Math.max(0, data.hiScore | 0);
    } catch {
      this.hiScore = 0;
    }
  }

  public save(): void {
    storageSet(
      P47PrefManager.PREF_FILE,
      JSON.stringify({ version: P47PrefManager.VERSION, hiScore: this.hiScore | 0 }),
    );
  }
}

function storageGet(key: string): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(key);
}

function storageSet(key: string, value: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, value);
}
