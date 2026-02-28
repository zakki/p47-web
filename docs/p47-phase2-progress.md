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
