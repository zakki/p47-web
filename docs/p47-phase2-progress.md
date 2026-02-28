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
