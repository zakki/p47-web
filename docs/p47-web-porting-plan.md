# p47-web Porting Plan

## Objective

Port `p47/src/abagames/p47/*.d` to browser TypeScript by reusing the proven `tt-web` runtime (`src/abagames/util/**`).

## Strategy

- Reuse first: copy and keep `tt-web` runtime (`util`, SDL-like wrappers, BulletML runtime).
- Port game modules in dependency order from boot-facing modules to deep actor modules.
- Keep each phase typecheck-green before moving forward.

## Phases

1. Phase0 Scaffold
- `p47-web` package + Vite + TS
- Browser boot loop starts and renders placeholder
 - Status: done

2. Phase1 Compile Skeleton
- Add empty TS counterparts for all `p47/*.d` modules
- Wire imports/exports and remove structural type errors
 - Status: done

3. Phase2 Logic Port
- Port `P47GameManager`, `Title`, `StageManager`, `Field`, `Ship`
- Port actor pools and collisions (`Enemy`, `Shot`, `BulletActor`, `Bonus`)
 - Status: in progress

4. Phase3 Rendering/Audio
- Port display list dependent draw paths to `glcompat`
- Port sound manager and asset bootstrap

5. Phase4 Gameplay Verification
- Compare behavior with native `p47.exe`
- Stabilize mobile controls and performance

## Gate checks

- `npm run typecheck`
- `npm run test`
- `npm run build`
