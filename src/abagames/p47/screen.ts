import { Screen3D } from "../util/sdl/screen3d";

export class P47Screen extends Screen3D {
  public static readonly CAPTION = "PARSEC47";
  public static luminous = 0;

  protected override init(): void {
    this.setCaption(P47Screen.CAPTION);
    Screen3D.glLineWidth(1);
    Screen3D.glBlendFunc(Screen3D.GL_SRC_ALPHA, Screen3D.GL_ONE_MINUS_SRC_ALPHA);
    Screen3D.glEnable(Screen3D.GL_BLEND);
    Screen3D.glDisable(Screen3D.GL_COLOR_MATERIAL);
    Screen3D.glDisable(Screen3D.GL_CULL_FACE);
    Screen3D.glDisable(Screen3D.GL_DEPTH_TEST);
    Screen3D.glDisable(Screen3D.GL_LIGHTING);
    Screen3D.glDisable(Screen3D.GL_TEXTURE_2D);
    Screen3D.setClearColor(0, 0, 0, 1);
    Screen3D.farPlane = 10000;
    this.screenResized();
  }

  public override close(): void {}

  public override clear(): void {
    Screen3D.glClear(Screen3D.GL_COLOR_BUFFER_BIT);
  }
}
