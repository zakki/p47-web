import { Logger } from "../util/logger";
import { MainLoop } from "../util/sdl/mainloop";
import { Pad } from "../util/sdl/pad";
import { Screen3D } from "../util/sdl/screen3d";
import { SoundManager } from "../util/sdl/sound";
import { P47GameManager } from "./gamemanager";
import { P47PrefManager } from "./prefmanager";
import { Ship } from "./ship";
import { P47Screen } from "./screen";

let screen: P47Screen | null = null;
let pad: Pad | null = null;
let gameManager: P47GameManager | null = null;
let prefManager: P47PrefManager | null = null;
let mainLoop: MainLoop | null = null;

export function boot(args: string[]): number {
  screen = new P47Screen();
  pad = new Pad();
  try {
    pad.openJoystick();
  } catch {
    // optional in browser environments
  }
  gameManager = new P47GameManager();
  prefManager = new P47PrefManager();
  mainLoop = new MainLoop(screen, pad, gameManager, prefManager);

  try {
    parseArgs(args);
  } catch {
    return 1;
  }

  mainLoop.loop();
  return 0;
}

function parseArgs(commandArgs: string[]): void {
  const progName = commandArgs[0] ?? "p47-web";
  for (let i = 1; i < commandArgs.length; i++) {
    switch (commandArgs[i]) {
      case "-brightness": {
        if (i >= commandArgs.length - 1) throwInvalidOptions(progName);
        i++;
        const b = parseInt(commandArgs[i], 10) / 100;
        if (!(b >= 0 && b <= 1)) throwInvalidOptions(progName);
        Screen3D.brightness = b;
        break;
      }
      case "-luminous": {
        if (i >= commandArgs.length - 1) throwInvalidOptions(progName);
        i++;
        const l = parseInt(commandArgs[i], 10) / 100;
        if (!(l >= 0 && l <= 1)) throwInvalidOptions(progName);
        P47Screen.luminous = l;
        break;
      }
      case "-nosound":
        SoundManager.noSound = true;
        break;
      case "-window":
        Screen3D.windowMode = true;
        break;
      case "-reverse":
        if (pad) pad.buttonReversed = true;
        break;
      case "-lowres":
        Screen3D.width = 320;
        Screen3D.height = 240;
        break;
      case "-nowait":
        if (gameManager) gameManager.nowait = true;
        break;
      case "-accframe":
        if (mainLoop) mainLoop.accframe = 1;
        break;
      case "-slowship":
        Ship.isSlow = true;
        break;
      default:
        throwInvalidOptions(progName);
    }
  }
}

function usage(progName: string): void {
  Logger.error(
    `Usage: ${progName} [-brightness [0-100]] [-luminous [0-100]] [-nosound] [-window] [-reverse] [-lowres] [-slowship] [-nowait] [-accframe]`,
  );
}

function throwInvalidOptions(progName: string): never {
  usage(progName);
  throw new Error("Invalid options");
}
