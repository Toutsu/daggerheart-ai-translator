import { TranslationAssistantApp } from './TranslationAppV2.js';
import { MODULE_ID } from './TranslationLogic.js';

Hooks.once('init', () => {
    game.settings.register(MODULE_ID, 'aiProvider', {
        name: "AI Provider",
        hint: "Select the AI provider you want to use.",
        scope: 'client',
        config: true,
        type: String,
        default: 'gemini',
        choices: { 'gemini': 'Google Gemini', 'chatgpt': 'ChatGPT', 'claude': 'Anthropic Claude', 'copilot': 'Microsoft Copilot', 'perplexity': 'Perplexity AI' }
    });
    game.settings.register(MODULE_ID, 'gameSystem', {
        name: "Game System",
        hint: "The game system you are playing. Used for context.",
        scope: 'world',
        config: true,
        type: String,
        default: 'Daggerheart'
    });

    game.settings.register(MODULE_ID, 'batchSize', {
        name: "Batch Size",
        hint: "Number of pages to select automatically for translation batches.",
        scope: 'client',
        config: true,
        type: Number,
        default: 10
    });

    game.settings.register(MODULE_ID, 'maxPromptLength', {
        name: game.i18n.localize("DH_AI_TRANSLATOR.UI.Settings.MaxPromptLength.Name"),
        hint: game.i18n.localize("DH_AI_TRANSLATOR.UI.Settings.MaxPromptLength.Hint"),
        scope: 'client',
        config: true,
        type: Number,
        default: 100000
    });
});

Hooks.on('renderJournalDirectory', async (app, html) => {
    const element = html instanceof HTMLElement ? html : html[0];
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("ai-translation-btn");
    button.innerHTML = `<i class="fas fa-language"></i> ${game.i18n.localize("DH_AI_TRANSLATOR.UI.Title")}`;

    button.addEventListener("click", event => {
        event.preventDefault();
        new TranslationAssistantApp().render(true);
    });

    let headerActions = element.querySelector(".header-actions");
    if (headerActions) headerActions.append(button);
    else element.append(button);
});
