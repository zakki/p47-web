# p47-web

Web port scaffold of PARSEC47, built by reusing the `tt-web` runtime and migration approach.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Test

```bash
npm run typecheck
npm run test
```

## Current status

- Phase0: runtime scaffold is ready (`boot` + `screen` + `gameloop`)
- Input: keyboard, gamepad, and touch guide controls from shared SDL-like runtime
- Rendering: placeholder scene to verify browser loop and overlay path
- Game logic from `p47/src/abagames/p47/*.d` is not ported yet

## Next targets

1. Port `P47GameManager` actor graph and state machine
2. Port `Field/Ship/Enemy/BulletActor/StageManager`
3. Port `BarrageManager` + BulletML bridge
4. Port sound assets and title/game UI

## License

- This `p47-web` package is distributed under the PARSEC47 license from `p47/readme_e.txt` (BSD 2-Clause style).
