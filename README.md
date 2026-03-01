# Daggerheart AI Translator (EN→RU)

> A Foundry VTT module that helps translate Daggerheart journal entries from English to Russian using AI providers.

**Fork of [Phil's PF2e AI Translator](https://github.com/PhilippeFors/phils-pf2e-ai-translator)** — adapted for the **Daggerheart** system and **English → Russian** translation.

## Features

- 🌐 **AI-Powered Translation** — Translate journal entries from English to Russian via Gemini, ChatGPT, Claude, Copilot, or Perplexity
- 📖 **Glossary Management** — Auto-create and enforce a consistent glossary of game terms
- ✅ **Grammar Check** — Verify and fix translated Russian text
- 🔒 **ID Protection** — Keeps all Foundry IDs intact during translation
- 📦 **Batch Processing** — Translate multiple pages with "Next Batch" for large journals
- 🛡️ **Conflict Resolution** — Detects and resolves glossary conflicts after AI response

## Requirements

| Requirement | Details |
|---|---|
| **Foundry VTT** | v12+ |
| **System** | [Daggerheart](https://github.com/Foundryborne/daggerheart) |
| **Module** | [fvtt-daggerheart-ru](https://github.com/bmpolonsky/fvtt-daggerheart-ru) (Russian localization) |

## Installation

1. In Foundry VTT, go to **Settings → Manage Modules → Install Module**
2. Paste the manifest URL:
   ```
   https://github.com/Toutsu/daggerheart-ai-translator/releases/latest/download/module.json
   ```
3. Enable the module in your Daggerheart world

## Usage

1. Open the **Journal Directory** in Foundry VTT
2. Click the **"Daggerheart Translator"** button
3. Drag a journal entry into the drop zone
4. Select pages to translate and click **"Start Translation"**
5. Copy the generated prompt to your AI provider
6. Paste the AI response back into the module
7. The module validates the JSON, checks IDs, and updates the journal

### Recommended Workflow

1. **Create Glossary First** — Generate glossary terms for consistent naming across journals
2. **Translate with Glossary** — The module auto-injects glossary terms into prompts
3. **Grammar Check** — Run a grammar pass on translated text

## Configuration

- **AI Provider** — Choose between Gemini, ChatGPT, Claude, Copilot, or Perplexity
- **Game System** — Set to "Daggerheart" (default)
- **Max Prompt Length** — Warning threshold for character count

## Authors

- **Toutsu** — Fork author (Daggerheart EN→RU adaptation)
- **Phil** — Original author ([Phil's PF2e AI Translator](https://github.com/PhilippeFors/phils-pf2e-ai-translator))

## License

MIT

