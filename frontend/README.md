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
