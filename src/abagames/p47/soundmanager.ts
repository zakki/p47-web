import { Chunk, Music, SoundManager as SDLSoundManager } from "../util/sdl/sound";
import { P47GameManager } from "./gamemanager";

/**
 * Manage BGMs/SEs.
 */
export class SoundManager {
  public static readonly SHOT = 0;
  public static readonly ROLL_CHARGE = 1;
  public static readonly ROLL_RELEASE = 2;
  public static readonly SHIP_DESTROYED = 3;
  public static readonly GET_BONUS = 4;
  public static readonly EXTEND = 5;
  public static readonly ENEMY_DESTROYED = 6;
  public static readonly LARGE_ENEMY_DESTROYED = 7;
  public static readonly BOSS_DESTROYED = 8;
  public static readonly LOCK = 9;
  public static readonly LASER = 10;

  public static readonly BGM_NUM = 4;
  public static readonly SE_NUM = 11;

  private static manager: P47GameManager;
  private static bgm: Music[] = [];
  private static se: Chunk[] = [];

  private static readonly bgmFileName = ["ptn0.ogg", "ptn1.ogg", "ptn2.ogg", "ptn3.ogg"];
  private static readonly seFileName = [
    "shot.wav",
    "rollchg.wav",
    "rollrls.wav",
    "shipdst.wav",
    "getbonus.wav",
    "extend.wav",
    "enemydst.wav",
    "largedst.wav",
    "bossdst.wav",
    "lock.wav",
    "laser.wav",
  ];
  private static readonly seChannel = [0, 1, 2, 1, 3, 4, 5, 6, 7, 1, 2];

  public static init(gameManager: P47GameManager): void {
    this.manager = gameManager;
    if (SDLSoundManager.noSound) return;
    // p47 assets are placed directly under sounds/ (not sounds/musics or sounds/chunks).
    Music.dir = "sounds";
    Chunk.dir = "sounds";
    this.bgm = [];
    for (let i = 0; i < this.BGM_NUM; i++) {
      const music = new Music();
      music.load(this.bgmFileName[i]);
      this.bgm.push(music);
    }
    this.se = [];
    for (let i = 0; i < this.SE_NUM; i++) {
      const chunk = new Chunk();
      chunk.load(this.seFileName[i], this.seChannel[i]);
      this.se.push(chunk);
    }
  }

  public static close(): void {
    if (SDLSoundManager.noSound) return;
    for (let i = 0; i < this.bgm.length; i++) this.bgm[i].free();
    for (let i = 0; i < this.se.length; i++) this.se[i].free();
  }

  public static playBgm(n: number): void {
    if (SDLSoundManager.noSound || this.manager.state !== P47GameManager.IN_GAME) return;
    this.bgm[n].play();
  }

  public static playSe(n: number): void {
    if (SDLSoundManager.noSound || this.manager.state !== P47GameManager.IN_GAME) return;
    this.se[n].play();
  }

  public static stopSe(n: number): void {
    if (SDLSoundManager.noSound) return;
    this.se[n].halt();
  }
}
