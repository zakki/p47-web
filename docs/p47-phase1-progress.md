# p47-web Phase1 Progress

## Completed

- Added TS counterparts for all modules under `p47/src/abagames/p47/*.d`
- Kept naming compatibility via `p47-web/src/abagames/p47/*.ts`
  - `P47Boot.d` -> `boot.ts`
  - `P47GameManager.d` -> `gamemanager.ts`
  - `P47PrefManager.d` -> `prefmanager.ts`
  - `P47Screen.d` -> `screen.ts`
  - Other modules use lower-case filenames with original class names
- Preserved Phase0 runtime scaffold (`boot` + browser loop + placeholder render)

## Notes

- Most newly added modules are compile stubs and intentionally minimal.
- Behavior parity with native `p47.exe` is not started yet.

## Verification

- `npm run typecheck`: pass
- `npm run build`: pass
- `npm run test`: pass (no test files)

## Next step (Phase2)

- Replace `gamemanager.ts` placeholder with ported state machine from `P47GameManager.d`
- Port dependency chain in this order:
  1. `Field` / `Ship`
  2. `EnemyType` / `BarrageManager` / `StageManager`
  3. `Enemy` / `BulletActor` / `Shot` / `Lock` / `Roll` / `Bonus`
  4. `Title` / `SoundManager` / `LetterRender`
