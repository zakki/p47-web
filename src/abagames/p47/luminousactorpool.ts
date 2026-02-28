export class LuminousActorPool<T = unknown> {
  public actor: T[] = [];
  public constructor(_n = 0, _actorClass?: unknown, _initializer?: unknown) {}
  public clear(): void {
    this.actor = [];
  }
}
