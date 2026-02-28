### BarrageManager.d -> barragemanager.ts
- 対応状況: 一部未完
- 一致させた項目:
  - バレッジ種別定数 (`MORPH`..`MIDDLESUB_LOCK`) と `BARRAGE_TYPE=13` / `BARRAGE_MAX=64`
  - `parser[type][index]` と `parserNum[type]` の2次元管理
  - 13ディレクトリを順に走査し、`Load BulletML: <dir>/<file>` を出力しながらロード
  - `unloadBulletMLs()` で全スロットを解放状態 (`null`) に戻す後始末
- 残差:
  - D版の同期ロード (`void loadBulletMLs`) に対し、Web版は `Promise<void>` の非同期ロードに変更
  - D版の `readdir` 列挙順は未規定だが、Web版は `import.meta.glob` の列挙順依存
- 追加した PORT_NOTE:
  - p47-web/src/abagames/p47/barragemanager.ts:114 - 同期ロード差分と async 初期化 TODO
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### Bonus.d -> bonus.ts
- 対応状況: 完了
- 一致させた項目:
  - `rate`/`bonusScore` と `BASE_SPEED`/`INHALE_WIDTH`/`ACQUIRE_WIDTH`/`RETRO_CNT`/`BOX_SIZE` 定数
  - `init`・`set`・`missBonus`・`getBonus`・`move`・`draw` の制御フローとしきい値
  - 吸引(`isInhaled`/`inhaleCnt`)と取得判定(`ship.cnt` と `INVINCIBLE_CNT`)の条件式
  - 取得時SE(`GET_BONUS`)と加点処理、取り逃し時 `bonusScore` リセット
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### BulletActor.d -> bulletactor.ts
- 対応状況: 一部未完
- 一致させた項目:
  - `init`/`resetTotalBulletsSpeed`/`set`/`setSimple`/`setInvisible`/`setTop`/`remove`/`toRetro` の状態遷移
  - `move` の更新順序（`ppos` 更新、runner 進行、`rtCnt` 遷移、`BULLET_DISAPPEAR_CNT`、移動式、被弾判定、field 判定）
  - `draw` と `drawRetro` の回転規則・レトロ描画分岐・色/形状テーブル
  - `createDisplayLists`/`deleteDisplayLists` の形状生成ロジック（`DisplayList` 利用で D 版 display list を再現）
- 残差:
  - `P47Bullet`/`MorphBullet`/`BulletActorPool` 側が未移植のため、`BulletActor` 内で互換ラッパを置いた暫定接続
  - `Field.checkHit` 未実装環境では D 式の境界判定を `BulletActor` 側で代替
- 追加した PORT_NOTE:
  - p47-web/src/abagames/p47/bulletactor.ts:295 - rewind 時の BulletML callback 再登録未完
  - p47-web/src/abagames/p47/bulletactor.ts:343 - `Ship.destroyed()` 未実装時の被弾副作用欠落
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### BulletActorPool.d -> bulletactorpool.ts
- 対応状況: 一部未完
- 一致させた項目:
  - `ActorPool` 継承 + `BulletsManager` 実装、および ctor 内 `Bullet.setBulletsManager(this)` / `BulletActor.init()` / `cnt=0`
  - `addBullet` の D版オーバーロード群（simple/state/runner/parser/morph 付き parser）を TS で同等分岐として実装
  - `move` の `super.move()` 後 `cnt++`、`getTurn`、`killMe` の id 整合チェック + `remove` 呼び出し
  - `clear` を D版同様「存在中 actor に remove() をかける」実装へ変更
  - `registFunctions` で BulletML callback を一括登録し、`getAimDirection` を `xReverse` 対応版へ差し替え
- 残差:
  - `BulletMLState` が TS 側で `unknown` 定義のため、`addBullet(state,...)` は `createRunner()` の実行時確認に依存
- 追加した PORT_NOTE:
  - p47-web/src/abagames/p47/bulletactorpool.ts:339 - `BulletMLState` 型の静的保証不足による実行時チェック
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### Enemy.d -> enemy.ts
- 対応状況: 一部未完
- 一致させた項目:
  - `set` / `setBoss` / `moveBoss` / `gotoNextPoint` / `controlFireCnt` の移動・弾発射制御
  - `checkHit` / `checkLocked` / `checkDamage` の当たり判定と `SHOT/ROLL/LOCK` ダメージ分岐
  - `addDamage` / `addDamageBattery` / `removeTopBullets` / `remove` の破壊副作用と後始末
  - `move` / `draw` の更新順序・出現/撃破/タイムアウト演出・ボスシールドメータ更新
  - `EnemyInitializer` の依存注入構造（`field/bullets/shots/rolls/locks/ship/manager`）
- 残差:
  - `EnemyType` / `Lock` / `Roll` / `Shot` / `P47GameManager` の TS 側がスタブのため、定数・状態参照はフォールバック付きで暫定接続
  - `BulletActorPool.registFunctions` 未実装時に callback 登録が欠落しうる
- 追加した PORT_NOTE:
  - p47-web/src/abagames/p47/enemy.ts:930 - `registFunctions` 未定義時の BulletML callback 未接続リスク
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### EnemyType.d -> enemytype.ts
- 対応状況: 完了
- 一致させた項目:
  - `Barrage` / `BatteryType` / `EnemyType` の状態変数・定数・初期化順序
  - `setBarrageType` / `setBarrageRank` / `setBarrageRankSlow` / `setBarrageShape` の弾幕生成ロジック
  - `setEnemyShapeAndWings` / `setBattery` の機体形状・翼・バッテリー配置計算
  - `setSmallEnemyType` / `setMiddleEnemyType` / `setLargeEnemyType` / `setMiddleBossEnemyType` / `setLargeBossEnemyType` の敵種別構築分岐
  - `clearIsExistList` と ID 採番 (`idCnt`) の静的管理
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### Field.d -> field.ts
- 対応状況: 一部未完
- 一致させた項目:
  - `TYPE_NUM`/`RING_NUM`/`RING_ANGLE_INT`/`RING_POS_NUM`/`RING_DEG`/`RING_RADIUS`/`RING_SIZE` の定数と内部状態 (`roll`/`yaw`/`z`/`speed`/`yawYBase`/`yawZBase`)
  - `init`/`setColor`/`move`/`setType`/`draw`/`checkHit` の制御フローと補間係数
  - ring 形状の display list 生成・破棄 (`createDisplayLists`/`deleteDisplayLists`) と `writeOneRing` の頂点列
- 残差:
  - `P47GameManager` の `ROLL`/`LOCK` 定数が TS 側で未定義のため、`setColor` は `0/1` フォールバックで互換維持
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### Fragment.d -> fragment.ts
- 対応状況: 完了
- 一致させた項目:
  - `R/G/B`、`POINT_NUM`、`cnt`、`lumAlp`、`retro` を含む状態・定数
  - `init` で `pos[2]` / `vel[2]` / `impact` を初期化する手順
  - `set` の乱数補間座標生成、速度・impact 算出、寿命とアルファ初期化
  - `move` の寿命減算、消滅判定、`pos += vel + impact`、減衰係数 (`0.98/0.95/0.98/0.97`)
  - `draw` / `drawLuminous` の描画呼び出し順と `lumAlp < 0.2` の早期 return
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### LetterRender.d -> letterrender.ts
- 対応状況: 完了
- 一致させた項目:
  - `WHITE/RED` と `TO_RIGHT/TO_DOWN/TO_LEFT/TO_UP` の定数契約
  - `changeColor` / `drawString` / `drawNum` の文字インデックス変換・進行方向・桁処理
  - `drawBox` / `drawLetter(idx,r,g,b)` の比率係数 (`size*0.66` / `length*0.6`) と縦横判定
  - `createDisplayLists` / `deleteDisplayLists` の 2色×`LETTER_NUM(42)` 生成順
  - `spData` グリフ定義（42 文字）を D 版と同値で移植
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### Lock.d -> lock.ts
- 対応状況: 完了
- 一致させた項目:
  - `SEARCH/SEARCHED/LOCKING/LOCKED/FIRED/HIT/CANCELED` の状態定数、`LENGTH`/`NO_COLLISION_CNT`/`SPEED`/`LOCK_CNT` の定数
  - `init` / `reset` / `set` / `hit` / `move` / `draw` の制御フローと `LOCKED` からのフォールスルー挙動
  - 敵追尾座標更新（`lockedPart` による本体/バッテリー切替）と `CANCELED` 遷移条件
  - レーザー軌跡更新、場外時の再ロック/消滅分岐、`SoundManager.LOCK/LASER` 発火タイミング
  - `LockInitializer` の依存注入構造（`ship/field/manager`）
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### LuminousActor.d -> luminousactor.ts
- 対応状況: 完了
- 一致させた項目:
  - `Actor` 継承の抽象クラス定義
  - `drawLuminous()` 抽象メソッド契約
  - クラス責務（発光描画インターフェースのみ）
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### LuminousActorPool.d -> luminousactorpool.ts
- 対応状況: 完了
- 一致させた項目:
  - `ActorPool` 継承クラスとしての責務
  - コンストラクタで `ActorPool` 初期化を委譲する構造
  - `drawLuminous` で `actor.length` を走査し、`exists` 中 actor のみ `drawLuminous()` を呼ぶ更新順
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### LuminousScreen.d -> luminousscreen.ts
- 対応状況: 一部未完
- 一致させた項目:
  - `init` / `resized` / `close` / `startRenderToTexture` / `endRenderToTexture` / `draw` の API を D 版と同名で移植
  - 内部状態 (`luminousTextureWidth/Height=64`, `screenWidth`, `screenHeight`, `luminous`) と `lmOfs` / `lmOfsBs=5` を D 版準拠で実装
  - `draw` の描画手順（`GL_TEXTURE_2D` 有効化、`viewOrtho`、5 枚クアッド描画、`viewPerspective`、無効化）を一致
  - D 版の頂点オフセット計算（3,4頂点で `lmOfs[i][0]` を Y に使う式）を同じまま保持
- 残差:
  - D 版 `glCopyTexImage2D` + `glViewport` ベースのレンダーターゲット切替は、現行 GLCompat で FBO 未対応のため完全一致不可
- 追加した PORT_NOTE:
  - p47-web/src/abagames/p47/luminousscreen.ts:69 - `startRenderToTexture` の viewport 切替未再現
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### MorphBullet.d -> morphbullet.ts
- 対応状況: 完了
- 一致させた項目:
  - `Bullet` 継承と `MORPH_MAX=8` の定数契約
  - morph 状態 (`morphParser/morphNum/morphIdx/morphCnt/baseMorphIdx/baseMorphCnt/isMorph`) の保持
  - `setMorph` の `cnt<=0` 早期 return、`morphIdx` 正規化、ベース値保存の更新順
  - `resetMorph` の `morphIdx/morphCnt` 復元処理
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### P47Boot.d -> boot.ts
- 対応状況: 完了
- 一致させた項目:
  - `boot` の初期化順（`P47Screen`/`Pad`/`P47GameManager`/`P47PrefManager`/`MainLoop`）と `openJoystick` 例外握りつぶし
  - `parseArgs` の走査開始位置（`args[1]` から）と不正オプション時の `usage + Exception` 契約
  - `-brightness` / `-luminous` / `-nosound` / `-window` / `-reverse` / `-lowres` / `-slowship` / `-nowait` / `-accframe` の反映先
  - `usage` 表示文字列を D 版のオプション集合に整合
- 残差:
  - D版の `main` / `WinMain` エントリポイント分岐は Web 版の起動構成（`src/main.ts`）により対象外
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### P47Bullet.d -> p47bullet.ts
- 対応状況: 完了
- 一致させた項目:
  - `MorphBullet` 継承と `constructor(id)` での `super(id)` 呼び出し
  - `speedRank` / `shape` / `color` / `bulletSize` / `xReverse` の公開状態
  - `setParam(sr, sh, cl, sz, xr)` の代入順と責務
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### P47GameManager.d -> gamemanager.ts
- 対応状況: 一部未完
- 一致させた項目:
  - `init/start/close/move/draw` の状態遷移と呼び出し順（`TITLE/IN_GAME/GAMEOVER/PAUSE`）
  - スコア/エクステンド/残機管理 (`addScore`, `shipDestroyed`, `startGameover`)
  - actor pool 初期化順・`startStage` 難易度分岐・減速制御 (`SLOWDOWN_START_BULLETS_SPEED`)
  - `inGame/title/gameover/pause` の move/draw 系分岐とサイド情報描画
  - 画面シェイク (`setScreenShake`, `moveScreenShake`, `setEyepos`) とボスシールドメータ描画
- 残差:
  - `BarrageManager` の非同期ロードにより、D版の「初期化完了時点で弾幕ロード済み」保証は未達
  - `Title/StageManager/Shot/Roll/Particle/P47PrefManager` の一部がスタブのため、該当箇所は防御的呼び出しで接続
- 追加した PORT_NOTE:
  - p47-web/src/abagames/p47/gamemanager.ts:199 - BulletML ロード非同期化による起動直後差分
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### P47Screen.d -> screen.ts
- 対応状況: 完了
- 一致させた項目:
  - `init` の OpenGL 初期化順と状態（`GL_LINE_SMOOTH` 有効化、`GL_SRC_ALPHA/GL_ONE` ブレンド、各 `glDisable` 呼び出し）
  - `luminous` 設定に応じた `LuminousScreen` の生成/破棄と `startRenderToTexture` / `endRenderToTexture` / `drawLuminous` の中継
  - `resized` の `LuminousScreen.resized` → `super.resized` 呼び出し順
  - `viewOrthoFixed` / `viewPerspective` の行列 push/pop と固定 640x480 オーソ投影
  - `rand` の `init` 時再初期化と retro 描画ロジックの維持
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### P47PrefManager.d -> prefmanager.ts
- 対応状況: 一部未完
- 一致させた項目:
  - `PREV_VERSION_NUM=10` / `VERSION_NUM=20` / `MODE_NUM=2` / `DIFFICULTY_NUM=4` / `REACHED_PARSEC_SLOT_NUM=10` の定数契約
  - `init` で `hiScore[mode][difficulty][slot]` と `reachedParsec[mode][difficulty]` を 0 初期化し、`selectedDifficulty=1` / `selectedParsecSlot=0` / `selectedMode=0` を設定
  - `loadPrevVersionData` で旧バージョン（モード次元なし）のデータを mode 0 に移行する処理
  - `load` のバージョン分岐（`ver==10` は旧データ読込、`ver!=20` は初期化）と例外時 `init()` のフォールバック
  - `save` で現行バージョン構造の全フィールドを永続化する処理
- 残差:
  - D版 `std.stream.File` バイナリI/O を Web 環境では使用できないため、localStorage(JSON) で代替
- 追加した PORT_NOTE:
  - p47-web/src/abagames/p47/prefmanager.ts:76 - バイナリファイル保存との差分と再実装 TODO
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施

### Particle.d -> particle.ts
- 対応状況: 完了
- 一致させた項目:
  - `R/G/B` と `pos/ppos/vel/z/mz/pz/lumAlp/cnt` の状態変数を D 版同等で実装
  - `init` で `Vector` を再初期化する手順と `ParticleInitializer` 契約
  - `set` の位置オフセット、速度係数 `sb`、`mz`/寿命/発光アルファの乱数初期化
  - `move` の更新順（寿命減算・消滅判定・`ppos/pz` 保持・位置更新・減衰）
  - `draw` / `drawLuminous` の線分頂点出力と `lumAlp < 0.2` 早期 return
- 残差:
  - なし
- 追加した PORT_NOTE:
  - なし
- 検証:
  - typecheck: pass
  - build: pass
  - 手動確認: 未実施
