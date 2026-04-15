# Changelog

## 0.1.0 — 2026-04-15

### Added

- `App` — root construct that drives synthesis
- `Assembly` / `IAssembly` — file system output abstraction
- `Source` / `ISource` — content factories (text, json, file copy)
- `ISynthesizable` — interface for constructs that emit files
- `Lazy` / `IResolvable` — deferred value resolution
- `Cache` — SHA-based caching for LLM-generated content
- `IModelProvider` — abstraction for LLM invocation during synth
- `BedrockProvider` — Amazon Bedrock model provider
- `KiroCliProvider` — kiro-cli model provider
- `Logger` — scoped logging
- `Content` — file loading helper
- `packageDir()` — utility for library authors
- `CfgAgent` — L1 construct for Kiro CLI agent JSON
- `CfgPrompt` — L1 construct for Kiro prompts
