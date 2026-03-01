export class DictionaryLoader {
    static _cache = null;

    /**
     * Loads official translations from the fvtt-daggerheart-ru module.
     * @returns {Promise<Object>} A map of English terms to Russian translations.
     */
    static async loadOfficialTranslations() {
        if (this._cache) return this._cache;

        const dictionary = {};
        const translationsDir = "modules/fvtt-daggerheart-ru/translations";
        const systemI18nFile = "modules/fvtt-daggerheart-ru/i18n/systems/daggerheart.json";

        try {
            console.log("DH Translator | Loading official translations...");

            // 1. Load System i18n Translations (daggerheart.json from fvtt-daggerheart-ru)
            // Compare with English system file to build term mapping
            try {
                const sysResponseRu = await fetch(systemI18nFile);
                const sysJsonRu = await sysResponseRu.json();

                // Try to fetch English system file from standard path
                const sysResponseEn = await fetch("systems/daggerheart/lang/en.json");
                const sysJsonEn = await sysResponseEn.json();

                if (sysJsonRu && sysJsonEn) {
                    // Helper to recursively traverse and map EN -> RU
                    const traverse = (objEn, objRu) => {
                        for (const key in objEn) {
                            if (objRu.hasOwnProperty(key)) {
                                const valEn = objEn[key];
                                const valRu = objRu[key];

                                if (typeof valEn === 'object' && valEn !== null && typeof valRu === 'object' && valRu !== null) {
                                    traverse(valEn, valRu);
                                } else if (typeof valEn === 'string' && typeof valRu === 'string') {
                                    // Filter out long sentences, IDs, or identical values
                                    if (valEn.length > 2 && valEn.length < 50 && valEn !== valRu) {
                                        // Avoid replacing variables like {0} or HTML in keys
                                        if (!valEn.includes("{") && !valEn.includes("<")) {
                                            // Strip HTML from the translation value
                                            const cleanValRu = valRu.replace(/<[^>]*>/g, "");
                                            if (cleanValRu) {
                                                dictionary[valEn] = cleanValRu;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };

                    traverse(sysJsonEn, sysJsonRu);
                    console.log(`DH Translator | Loaded ${Object.keys(dictionary).length} system terms from en/ru comparison.`);
                }

            } catch (err) {
                console.warn("DH Translator | Failed to load system translations (en.json/daggerheart.json comparison):", err);
            }

            // 2. Load Babele Compendium Translations
            const FilePickerClass = foundry.applications?.apps?.FilePicker || FilePicker;
            let files = [];

            try {
                const browseResult = await FilePickerClass.browse("user", translationsDir);
                files = browseResult.files.filter(f => f.endsWith(".json"));
            } catch (err) {
                console.warn("DH Translator | Failed to browse translations directory:", err);
            }

            // Only include Daggerheart core translation files (Babele format)
            const allowedPatterns = [
                /^daggerheart\.adversaries\.json$/,
                /^daggerheart\.ancestries\.json$/,
                /^daggerheart\.armors\.json$/,
                /^daggerheart\.beastforms\.json$/,
                /^daggerheart\.classes\.json$/,
                /^daggerheart\.communities\.json$/,
                /^daggerheart\.consumables\.json$/,
                /^daggerheart\.domains\.json$/,
                /^daggerheart\.environments\.json$/,
                /^daggerheart\.journals\.json$/,
                /^daggerheart\.loot\.json$/,
                /^daggerheart\.rolltables\.json$/,
                /^daggerheart\.subclasses\.json$/,
                /^daggerheart\.weapons\.json$/,
                /^the-void-unofficial\..*\.json$/
            ];

            const blockedTerms = new Set([
                "I", "A", "An", "The", "In", "On", "At", "To", "For", "Of", "With", "By",
                "Turn", "Round", "Level", "Die", "Hit", "Miss",
                "Name", "Description", "Source", "Type", "Traits", "Rarity", "Price", "Usage",
                // Common UI/Text terms that shouldn't be auto-replaced
                "Items", "Item", "Treasure", "Consumable", "Permanent", "Chapter",
                "Hero", "Heroes", "Details", "Inventory"
            ]);

            for (const file of files) {
                const fileName = file.split("/").pop();
                if (!allowedPatterns.some(pattern => pattern.test(fileName))) {
                    continue;
                }

                try {
                    const response = await fetch(file);
                    const json = await response.json();

                    // Babele format: root-level "entries" object
                    if (json.entries) {
                        for (const [key, value] of Object.entries(json.entries)) {
                            if (value.name && key !== value.name) {
                                if (blockedTerms.has(key)) continue;
                                if (key.length <= 2) continue;
                                // Strip HTML from value
                                const cleanValue = value.name.replace(/<[^>]*>/g, "");
                                if (cleanValue) {
                                    dictionary[key] = cleanValue;
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.warn(`DH Translator | Failed to load ${file}:`, err);
                }
            }
            console.log(`DH Translator | Loaded ${Object.keys(dictionary).length} official translations.`);
        } catch (err) {
            console.error("DH Translator | Error loading official translations:", err);
            return {};
        }

        this._cache = dictionary;
        return dictionary;
    }
}
