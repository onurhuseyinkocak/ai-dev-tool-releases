# AI developer tool releases

Release history of 60 AI developer tools in one CSV/JSON file: coding agents (Claude Code, Codex CLI, Gemini CLI, Aider, Cline, OpenCode, ...), SDKs (OpenAI, Anthropic, Google Gen AI, MCP, Vercel AI SDK, ...), agent frameworks (LangChain, LangGraph, LlamaIndex, CrewAI, Pydantic AI, ...), local runtimes (llama.cpp, Ollama, vLLM, SGLang, ...) and apps (Open WebUI, Dify, n8n, ...).

Browse it: https://vibecodingturkey.com/releases

## Files

| File | Contents |
| --- | --- |
| `data/releases.csv` | One row per release: `tool,name,repo,kind,version,tag,date,url,major,breaking` |
| `data/releases.json` | Same data grouped by tool, plus `page` and `median_gap_days` (median days between recent releases). |

- `kind`: `agent`, `editor`, `sdk`, `framework`, `runtime` or `app`.
- `date`: GitHub release `published_at` (UTC). `url`: the GitHub release page.
- `major`: the major version number went up compared with the previous version.
- `breaking`: the release notes mention a breaking change (keyword match, so treat it as a hint and read the notes).
- Release notes are not copied; follow `url`. Monorepos are filtered to the main package's tags.

The upstream export covers up to each tool's 20 most recent releases; this repo keeps every version it has seen since **2026-11-21**, so older versions stay after they leave that window.

## Example

```sh
# Claude Code releases in the last 30 days
curl -s https://raw.githubusercontent.com/onurhuseyinkocak/ai-dev-tool-releases/main/data/releases.csv \
  | awk -F, -v d="$(date -u -v-30d +%F 2>/dev/null || date -u -d '30 days ago' +%F)" '$1=="claude-code" && $7>=d {print $5, $7}'
```

## Updates

A GitHub Action runs daily at 05:23 UTC, reads https://vibecodingturkey.com/releases/data/releases.json (built from the GitHub Releases API) and commits when something changed.

## Licence

Release metadata comes from each project's public GitHub releases. This compilation (selection, normalised versions, `major`/`breaking` flags, release cadence) is licensed under [CC BY 4.0](LICENSE). The code in `scripts/` and `.github/` is MIT licensed ([`LICENSE-CODE`](LICENSE-CODE)). Attribution: "AI developer tool releases, vibecodingturkey.com".
