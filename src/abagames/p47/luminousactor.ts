import { Actor } from "../util/actor";

/**
 * Actor with the luminous effect.
 */
export abstract class LuminousActor extends Actor {
  public abstract drawLuminous(): void;
}
