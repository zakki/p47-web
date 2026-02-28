# D→TypeScript 忠実移植プレイブック（1ファイル単位）

## 目的

- 新規実装ではなく、`p47` の D 言語版を基準として TypeScript 版を忠実移植する。
- 1ファイルずつ差分を潰し、未移植・移植困難箇所は必ずコメントと記録を残す。

## 基本方針

- 正は常に D 版。
- TS 側の独自仕様・改善は原則禁止。
- 挙動差がある場合は「直す」か「なぜ直せないかを明記する」の二択。

## 対象の対応付け

- D: `p47/src/abagames/p47/<Name>.d`
- TS: `p47-web/src/abagames/p47/<name>.ts`

## 作業対象ファイル一覧（D↔TS）

優先度 `P0` から順に 1ファイルずつ進める。

| Priority | D file | TS file | Notes |
|---|---|---|---|
| P0 | `P47GameManager.d` | `gamemanager.ts` | 全体状態遷移・更新順の基準 |
| P0 | `StageManager.d` | `stagemanager.ts` | 出現/進行/BGMトリガ |
| P0 | `Enemy.d` | `enemy.ts` | 敵行動・被弾・撃破副作用 |
| P0 | `EnemyType.d` | `enemytype.ts` | 弾幕割当テーブルの中心 |
| P0 | `SoundManager.d` | `soundmanager.ts` | BGM/SE呼び出し契約 |
| P1 | `Ship.d` | `ship.ts` | 自機入力/ショット/被弾 |
| P1 | `BulletActor.d` | `bulletactor.ts` | 敵弾表現/移動 |
| P1 | `BulletActorPool.d` | `bulletactorpool.ts` | 弾管理・BulletML接続点 |
| P1 | `Shot.d` | `shot.ts` | 自機弾仕様 |
| P1 | `Roll.d` | `roll.ts` | ROLLモード挙動 |
| P1 | `Lock.d` | `lock.ts` | LOCKモード挙動 |
| P1 | `Bonus.d` | `bonus.ts` | ボーナス計算/取得副作用 |
| P1 | `Field.d` | `field.ts` | 視覚/スクロール/色 |
| P1 | `Title.d` | `title.ts` | タイトル状態/UI遷移 |
| P2 | `P47Screen.d` | `screen.ts` | 投影/描画設定 |
| P2 | `LetterRender.d` | `letterrender.ts` | 文字描画仕様 |
| P2 | `P47PrefManager.d` | `prefmanager.ts` | セーブデータ互換 |
| P2 | `BarrageManager.d` | `barragemanager.ts` | XMLロード/選択 |
| P3 | `Particle.d` | `particle.ts` | 演出粒子 |
| P3 | `Fragment.d` | `fragment.ts` | 破片演出 |
| P3 | `MorphBullet.d` | `morphbullet.ts` | Morph弾仕様 |
| P3 | `P47Bullet.d` | `p47bullet.ts` | 弾基底 |
| P3 | `LuminousActor.d` | `luminousactor.ts` | 発光演出基底 |
| P3 | `LuminousActorPool.d` | `luminousactorpool.ts` | 発光演出管理 |
| P3 | `LuminousScreen.d` | `luminousscreen.ts` | 発光描画 |
| P4 | `P47Boot.d` | `boot.ts` | 起動オプション差分確認 |

補足:
- D 側に存在して TS 側が実質スタブのものは、優先度を 1 段階引き上げて先に処理する。
- `*.Initializer` 系は対象本体の作業時に同時確認する。

## 1ファイル移植手順

1. 対象ファイルを固定する
   - 例: `Enemy.d` ↔ `enemy.ts`
2. D版の責務を抽出する
   - public API、状態、初期化、更新、描画、サウンド、副作用を箇条書き化
3. TS版の同名責務を対応付ける
   - 「存在する/不一致/欠落」の3分類でマーキング
4. 挙動差を D 基準で修正する
   - 分岐条件、定数、乱数、呼び出し順、状態遷移を優先
5. 移植不能箇所にコメントを残す
   - 下記「コメント規約」を使用
6. 検証する
   - `npm run typecheck`
   - `npm run build`
   - 必要なら手動確認（該当機能）
   - エラー解消のために設計変更が必要な場合は、このステップでは無視し、次の統合ステップで解消する
   - このステップで解決しないエラー部分は、コメントアウトし問題内容をコメントで残す
7. 進捗記録を更新する
   - 下記「ファイル別記録テンプレート」を追記

## コメント規約（移植不能箇所）

移植不能・暫定実装の箇所には、TSコード内に以下形式でコメントを残す。

```ts
// PORT_NOTE[D:<file>#<section>]:
// D版準拠にできていない理由: <理由>
// 影響: <挙動差>
// TODO: <今後の対応>
```

例:

```ts
// PORT_NOTE[D:Enemy.d#moveParser]:
// D版の外部依存(BulletML C API)が未接続のため完全移植不可。
// 影響: 一部弾幕分岐が簡略化される。
// TODO: util/bulletml ランナー接続後に再実装。
```

## ファイル別チェックリスト（毎回使う）

- [ ] D/TS の対象ファイルを固定した
- [ ] D版の public API を列挙した
- [ ] D版の状態変数/定数を列挙した
- [ ] 初期化順序 (`init/start`) を一致させた
- [ ] 更新順序 (`move`) を一致させた
- [ ] 描画順序 (`draw`) を一致させた
- [ ] 乱数利用箇所（seed含む）を一致させた
- [ ] サウンド呼び出し箇所/タイミングを一致させた
- [ ] データ構造サイズ（pool上限等）を一致させた
- [ ] 定数値（しきい値/速度/間隔）を一致させた
- [ ] 未移植箇所に `PORT_NOTE` コメントを残した
- [ ] `npm run typecheck` が通った
- [ ] `npm run build` が通った
- [ ] 必要な手動確認を実施した
- [ ] 進捗記録を更新した

## 差分確認チェックポイント（観点）

- 制御フロー:
  - `if/switch` 条件、早期 return、状態遷移条件
- 時間軸:
  - `cnt/frame` の増分タイミング、cooldown減算位置
- 数値:
  - キャスト (`|0` 相当)、丸め、上限下限、係数
- 順序:
  - `move` 内の actor 更新順
  - `draw` 内のレイヤ順
- 副作用:
  - スコア加算、ライフ増減、SE/BGM 発火

## 禁止事項

- D版にない改善ロジックを混ぜる
- 「あとで直す」だけ書いてコメントを残さない
- 複数ファイルを同時に大改修して差分原因を不明化する

## 推奨作業順

1. `SoundManager` 参照箇所の呼び出し位置を D 側準拠に戻す
2. `Ship` / `Enemy` / `Lock` / `Bonus` の副作用一致
3. `StageManager` / `EnemyType` のテーブル整合
4. `GameManager` の move/draw 順序と定数微差の最終調整

## ファイル別記録テンプレート

以下を `project-docs/p47-phase2-progress.md` などに追記して使う。

```md
### <Name>.d → <name>.ts
- 対応状況: 完了 / 一部未完
- 一致させた項目:
  -
- 残差:
  -
- 追加した PORT_NOTE:
  - <path>:<line> - <要約>
- 検証:
  - typecheck: pass/fail
  - build: pass/fail
  - 手動確認: <内容>
```
