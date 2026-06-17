# API Key Audit — 2026-06-15

## Finding
`VITE_TRUEBADOUR_API_KEY` is read but never used in HTTP requests.

## Investigation
- `useTruebadourAI.js` reads `VITE_TRUEBADOUR_API_KEY` into `API_KEY` constant
- `API_KEY` is never passed to any fetch() or used in headers
- Current backends:
  1. LM Studio (localhost:1234) - no auth needed
  2. wllama (in-browser) - runs locally
  3. Offline mode - static responses

## Discrepancy Found
- `.env.example` shows `VITE_TROUBADOUR_API_KEY` (note: TROUBADOUR not TRUEBADOUR)
- Code searches for `VITE_TRUEBADOUR_API_KEY`
- No remote API implementation exists in current codebase

## Recommendation
Remove the unused `API_KEY` constant to avoid confusion. If remote API is added later:
1. Use consistent naming (`VITE_TROUBADOUR_API_KEY`)
2. Move API key to server-side proxy (DaaS) to avoid client exposure
3. Never expose secret API keys in Vite env vars

## Status
✅ **No security risk** - key is not exposed because it's not used
