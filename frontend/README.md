# MetaMask demo page

A single static page (`index.html`) where a connected wallet can submit a ZK
eligibility proof and claim ERC-3643-gated demo tokens, live against the
contracts already deployed on Hedera Testnet.

## Run it

It must be served over `http://`, not opened as a `file://` path — the
sample proof files are loaded with `fetch()`, which browsers block for
local files.

```powershell
cd frontend
npx serve .
```

(or `python -m http.server 8000`, or any other static file server). Then
open the printed `http://localhost:...` URL in a browser with the MetaMask
extension installed.

## Steps in the page

1. **Connect MetaMask** — prompts to add/switch to Hedera Testnet
   (chain ID 296, RPC `https://testnet.hashio.io/api`) if not already added.
2. **Check compliance status** — reads `isVerified`, token balance, and
   claim status directly from the deployed contracts.
3. **Submit a ZK proof** — pick one of the three bundled sample proofs (or
   upload any file from `artifacts/batch/proofs/`) and submit it to
   `ZKPVerifierRegistryBytesV2`. MetaMask will prompt to sign the
   transaction. Each proof can only be used once (the contract's nullifier
   check rejects replays) — if a sample is already used, pick another.
4. **Claim demo tokens** — once verified, mint 100 `V5RWA` to your own
   connected wallet via `RWAToken.claimDemoTokens()` (a convenience function
   added for this demo — real minting still uses the standard ERC-3643
   `mint()`, restricted to the token owner).

Contract addresses are hardcoded in `index.html` from
`artifacts/deployment/hedera_testnet_erc3643.json`. If you redeploy, update
that `DEPLOYMENT` object.

## Confirmed working live

Run end to end with a real MetaMask wallet on Hedera Testnet: connect →
submit proof → `isVerified` becomes `true` → claim tokens. See the
"Live wallet-connected demo" section in the main `README.md` for the
transaction hashes and screenshots.

## Troubleshooting

- **"missing revert data" when submitting a proof or claiming**: MetaMask's
  automatic gas estimation doesn't reliably work over Hedera's JSON-RPC
  relay for these calls, even though the transaction itself succeeds. Both
  calls in `index.html` already pass an explicit `gasLimit` to skip that
  estimation step. If you still hit this, the connected account most likely
  has 0 HBAR — MetaMask can silently get stuck on the confirmation screen
  when it can't cover the network fee (see next point).
- **"Confirm"/"Review alert" button won't click, or the popup seems stuck**:
  almost always means the connected account has insufficient HBAR to pay the
  network fee. Fund it from the faucet at `portal.hedera.com` (Faucet tab)
  and try again.
- **A MetaMask popup doesn't appear when you click "Connect MetaMask"**: it
  may have opened as a separate window rather than in front — check your
  taskbar, or click the MetaMask extension icon in Chrome's toolbar.
