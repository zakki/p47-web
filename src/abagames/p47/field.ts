import { Vector } from "../util/vector";

export class Field {
  public size = new Vector(11, 16);

  public static createDisplayLists(): void {}
  public static deleteDisplayLists(): void {}

  public init(): void {
    this.size.x = 11;
    this.size.y = 16;
  }
}
