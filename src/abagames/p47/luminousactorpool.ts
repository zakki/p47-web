import { ActorPool } from "../util/actor";
import { LuminousActor } from "./luminousactor";

/**
 * Actor pool for the LuminousActor.
 */
export class LuminousActorPool<T extends LuminousActor> extends ActorPool<T> {
  public constructor(n: number, args: unknown[] | null, factory: () => T) {
    super(n, args, factory);
  }

  public drawLuminous(): void {
    for (let i = 0; i < this.actor.length; i++) {
      if (this.actor[i].exists) this.actor[i].drawLuminous();
    }
  }
}
