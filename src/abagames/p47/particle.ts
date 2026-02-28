import { Rand } from "../util/rand";
import { Vector } from "../util/vector";
import { Screen3D } from "../util/sdl/screen3d";
import { LuminousActor } from "./luminousactor";

/**
 * Particles.
 */
export class Particle extends LuminousActor {
  public static readonly R = 1;
  public static readonly G = 1;
  public static readonly B = 0.5;

  private static readonly rand = new Rand();

  private pos = new Vector();
  private ppos = new Vector();
  private vel = new Vector();
  private z = 0;
  private mz = 0;
  private pz = 0;
  private lumAlp = 0;
  private cnt = 0;

  public override init(args: unknown[] | null): void {
    const raw = Array.isArray(args) ? args[0] : args;
    if (!(raw instanceof ParticleInitializer)) {
      throw new Error("Particle.init requires ParticleInitializer");
    }
    this.pos = new Vector();
    this.ppos = new Vector();
    this.vel = new Vector();
  }

  public set(p: Vector, d: number, ofs: number, speed: number): void {
    if (ofs > 0) {
      this.pos.x = p.x + Math.sin(d) * ofs;
      this.pos.y = p.y + Math.cos(d) * ofs;
    } else {
      this.pos.x = p.x;
      this.pos.y = p.y;
    }
    this.z = 0;
    const sb = Particle.rand.nextFloat(0.5) + 0.75;
    this.vel.x = Math.sin(d) * speed * sb;
    this.vel.y = Math.cos(d) * speed * sb;
    this.mz = Particle.rand.nextSignedFloat(0.7);
    this.cnt = 12 + Particle.rand.nextInt(48);
    this.lumAlp = 0.8 + Particle.rand.nextFloat(0.2);
    this.exists = true;
  }

  public override move(): void {
    this.cnt--;
    if (this.cnt < 0) {
      this.exists = false;
      return;
    }
    this.ppos.x = this.pos.x;
    this.ppos.y = this.pos.y;
    this.pz = this.z;
    this.pos.opAddAssign(this.vel);
    this.vel.opMulAssign(0.98);
    this.z += this.mz;
    this.lumAlp *= 0.98;
  }

  public override draw(): void {
    Screen3D.glVertex3f(this.ppos.x, this.ppos.y, this.pz);
    Screen3D.glVertex3f(this.pos.x, this.pos.y, this.z);
  }

  public override drawLuminous(): void {
    if (this.lumAlp < 0.2) return;
    Screen3D.setColor(Particle.R, Particle.G, Particle.B, this.lumAlp);
    Screen3D.glVertex3f(this.ppos.x, this.ppos.y, this.pz);
    Screen3D.glVertex3f(this.pos.x, this.pos.y, this.z);
  }
}

export class ParticleInitializer {}
