import type { GLCompatStaticMesh } from "../util/sdl/glcompat";
import { Screen3D } from "../util/sdl/screen3d";
import { Vector } from "../util/vector";
import { P47GameManager } from "./gamemanager";

export class Field {
  public static readonly TYPE_NUM = 4;

  public size = new Vector();
  public eyeZ = 20;
  public aimZ = 10;
  public aimSpeed = 0.1;

  private static ringMeshes: GLCompatStaticMesh[] = [];
  private static meshColor: [number, number, number, number] | null = null;

  private static readonly RING_NUM = 16;
  private static readonly RING_ANGLE_INT = 10;

  private roll = 0;
  private yaw = 0;
  private z = 10;
  private speed = 0.1;
  private yawYBase = 0;
  private yawZBase = 0;
  private aimYawYBase = 0;
  private aimYawZBase = 0;
  private r = 0;
  private g = 0;
  private b = 0;

  private static readonly RING_POS_NUM = 16;
  private static readonly ringPos: Vector[] = Array.from({ length: Field.RING_POS_NUM }, () => new Vector());
  private static readonly RING_DEG = Math.PI / 3 / (Field.RING_POS_NUM / 2 + 0.5);
  private static readonly RING_RADIUS = 10;
  private static readonly RING_SIZE = 0.5;

  public init(): void {
    this.size.x = 11;
    this.size.y = 16;
    this.eyeZ = 20;
    this.roll = 0;
    this.yaw = 0;
    this.z = 10;
    this.aimZ = 10;
    this.speed = 0.1;
    this.aimSpeed = 0.1;
    this.yawYBase = 0;
    this.yawZBase = 0;
    this.aimYawYBase = 0;
    this.aimYawZBase = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
  }

  public setColor(mode: number): void {
    const managerClass = P47GameManager as unknown as { ROLL?: number; LOCK?: number };
    const rollMode = managerClass.ROLL ?? 0;
    const lockMode = managerClass.LOCK ?? 1;
    switch (mode) {
      case rollMode:
        this.r = 0.2;
        this.g = 0.2;
        this.b = 0.7;
        break;
      case lockMode:
        this.r = 0.5;
        this.g = 0.3;
        this.b = 0.6;
        break;
      default:
        break;
    }
  }

  public move(): void {
    this.roll += this.speed;
    if (this.roll >= Field.RING_ANGLE_INT) {
      this.roll -= Field.RING_ANGLE_INT;
    }
    this.yaw += this.speed;
    this.z += (this.aimZ - this.z) * 0.003;
    this.speed += (this.aimSpeed - this.speed) * 0.004;
    this.yawYBase += (this.aimYawYBase - this.yawYBase) * 0.002;
    this.yawZBase += (this.aimYawZBase - this.yawZBase) * 0.002;
  }

  public setType(type: number): void {
    switch (type) {
      case 0:
        this.aimYawYBase = 30;
        this.aimYawZBase = 0;
        break;
      case 1:
        this.aimYawYBase = 0;
        this.aimYawZBase = 20;
        break;
      case 2:
        this.aimYawYBase = 50;
        this.aimYawZBase = 10;
        break;
      case 3:
        this.aimYawYBase = 10;
        this.aimYawZBase = 30;
        break;
      default:
        break;
    }
  }

  public draw(): void {
    Field.ensureRingMeshes(this.r, this.g, this.b, 0.7);
    let d = (-Field.RING_NUM * Field.RING_ANGLE_INT) / 2 + this.roll;
    for (let i = 0; i < Field.RING_NUM; i++) {
      for (let j = 1; j < 8; j++) {
        const sc = j / 16 + 0.5;
        Screen3D.glPushMatrix();
        Screen3D.glTranslatef(0, 0, this.z);
        Screen3D.glRotatef(d, 1, 0, 0);
        const yawSin = Math.sin((this.yaw / 180) * Math.PI);
        Screen3D.glRotatef(yawSin * this.yawYBase, 0, 1, 0);
        Screen3D.glRotatef(yawSin * this.yawZBase, 0, 0, 1);
        Screen3D.glScalef(1, 1, sc);
        if (Field.ringMeshes.length > 0) {
          Field.drawRingMeshes();
        } else {
          Field.drawRingFallback(this.r, this.g, this.b, 0.7);
        }
        Screen3D.glPopMatrix();
      }
      d += Field.RING_ANGLE_INT;
    }
  }

  public checkHit(p: Vector, space = 0): boolean {
    return p.x < -this.size.x + space || p.x > this.size.x - space || p.y < -this.size.y + space || p.y > this.size.y - space;
  }

  private static buildRingElementVertices0(): number[] {
    const vertices: number[] = [];
    for (let i = 0; i <= Field.RING_POS_NUM / 2 - 2; i++) {
      vertices.push(Field.ringPos[i].x, Field.RING_SIZE, Field.ringPos[i].y);
    }
    for (let i = Field.RING_POS_NUM / 2 - 2; i >= 0; i--) {
      vertices.push(Field.ringPos[i].x, -Field.RING_SIZE, Field.ringPos[i].y);
    }
    vertices.push(Field.ringPos[0].x, Field.RING_SIZE, Field.ringPos[0].y);
    return vertices;
  }

  private static buildRingElementVertices1(): number[] {
    const vertices: number[] = [];
    vertices.push(Field.ringPos[Field.RING_POS_NUM / 2 - 1].x, Field.RING_SIZE, Field.ringPos[Field.RING_POS_NUM / 2 - 1].y);
    vertices.push(Field.ringPos[Field.RING_POS_NUM / 2].x, Field.RING_SIZE, Field.ringPos[Field.RING_POS_NUM / 2].y);
    vertices.push(Field.ringPos[Field.RING_POS_NUM / 2].x, -Field.RING_SIZE, Field.ringPos[Field.RING_POS_NUM / 2].y);
    vertices.push(Field.ringPos[Field.RING_POS_NUM / 2 - 1].x, -Field.RING_SIZE, Field.ringPos[Field.RING_POS_NUM / 2 - 1].y);
    vertices.push(Field.ringPos[Field.RING_POS_NUM / 2 - 1].x, Field.RING_SIZE, Field.ringPos[Field.RING_POS_NUM / 2 - 1].y);
    return vertices;
  }

  private static buildRingElementVertices2(): number[] {
    const vertices: number[] = [];
    for (let i = Field.RING_POS_NUM / 2 + 1; i <= Field.RING_POS_NUM - 1; i++) {
      vertices.push(Field.ringPos[i].x, Field.RING_SIZE, Field.ringPos[i].y);
    }
    for (let i = Field.RING_POS_NUM - 1; i >= Field.RING_POS_NUM / 2 + 1; i--) {
      vertices.push(Field.ringPos[i].x, -Field.RING_SIZE, Field.ringPos[i].y);
    }
    vertices.push(Field.ringPos[Field.RING_POS_NUM / 2 + 1].x, Field.RING_SIZE, Field.ringPos[Field.RING_POS_NUM / 2 + 1].y);
    return vertices;
  }

  private static createColors(vertexCount: number, r: number, g: number, b: number, a: number): number[] {
    const colors: number[] = [];
    for (let i = 0; i < vertexCount; i++) {
      colors.push(r, g, b, a);
    }
    return colors;
  }

  private static ensureRingMeshes(r: number, g: number, b: number, a: number): void {
    if (Field.meshColor && Field.meshColor[0] === r && Field.meshColor[1] === g && Field.meshColor[2] === b && Field.meshColor[3] === a) {
      return;
    }
    Field.clearRingMeshes();
    const verticesList = [
      Field.buildRingElementVertices0(),
      Field.buildRingElementVertices1(),
      Field.buildRingElementVertices2(),
    ];
    for (const vertices of verticesList) {
      const mesh = Screen3D.glCreateStaticMesh(
        Screen3D.GL_LINE_STRIP,
        vertices,
        Field.createColors(vertices.length / 3, r, g, b, a),
      );
      if (!mesh) {
        Field.clearRingMeshes();
        return;
      }
      Field.ringMeshes.push(mesh);
    }
    Field.meshColor = [r, g, b, a];
  }

  private static drawRingMeshes(): void {
    if (Field.ringMeshes.length <= 0) {
      return;
    }
    for (const mesh of Field.ringMeshes) {
      Screen3D.glDrawStaticMesh(mesh);
    }
  }

  private static drawRingFallback(r: number, g: number, b: number, a: number): void {
    const verticesList = [
      Field.buildRingElementVertices0(),
      Field.buildRingElementVertices1(),
      Field.buildRingElementVertices2(),
    ];
    for (const vertices of verticesList) {
      Screen3D.glDrawArrays(Screen3D.GL_LINE_STRIP, vertices, Field.createColors(vertices.length / 3, r, g, b, a));
    }
  }

  private static clearRingMeshes(): void {
    for (const mesh of Field.ringMeshes) {
      Screen3D.glDeleteStaticMesh(mesh);
    }
    Field.ringMeshes = [];
    Field.meshColor = null;
  }

  public static createDisplayLists(): void {
    Field.deleteDisplayLists();
    let d = -Field.RING_DEG * (Field.RING_POS_NUM / 2 - 0.5);
    for (let i = 0; i < Field.RING_POS_NUM; i++, d += Field.RING_DEG) {
      Field.ringPos[i].x = Math.sin(d) * Field.RING_RADIUS;
      Field.ringPos[i].y = Math.cos(d) * Field.RING_RADIUS;
    }
    Field.clearRingMeshes();
  }

  public static deleteDisplayLists(): void {
    Field.clearRingMeshes();
  }
}
