const fs = require('fs');

/**
 * Simple translation class
 */
module.exports = class EPTranslation {

	/**
	  * @param {Object} options Configuration options
	  * @param {string} [options.languageFolder=./lang] Path to the language folder
	  * @param {string} [options.defaultLanguage=en] Default language key
	  */
	constructor(options = {}) {
		this.languageFolder = (options.languageFolder !== undefined ? options.languageFolder : './lang');
		this.defaultLanguage = (options.defaultLanguage !== undefined ? options.defaultLanguage : 'en');

		this.reloadLanguageFiles();
		this.setLanguage(this.defaultLanguage);
	}

	/**
	 * Set callback for missing translation.
	 * @param {missingTranslationCallback} cb - The callback that gets called if a translation is missing
	 */
	onMissingTranslation(cb) {
		this.missingTranslationCallback = cb;
	}

	/**
	 * @callback missingTranslationCallback
	 * @param {string} currentLanguage
	 * @param {string} translateKey
	 */

	/**
	 * Reloads the language files from options.languageFolder
	 */
	reloadLanguageFiles() {
		this.translationMap = {};

		fs.readdirSync(this.languageFolder).forEach(this.loadLanguageFile.bind(this));
	}

	/**
	 * Requires a single file into translationMap
	 * @private
	 * @param {string} languageFile
	 */
	loadLanguageFile(languageFile) {
		const languageKey = languageFile.replace('.js', '');
		this.translationMap[languageKey] = require(`${this.languageFolder}/${languageFile}`);
	}

	/**
	 * Changes the current selected language
	 * @param {string} languageKey
	 */
	setLanguage(languageKey) {
		if (Object.keys(this.translationMap).indexOf(languageKey) < 0) {
			throw `Language ${languageKey} not found!`;
		}

		this.currentLanguage = languageKey;
	}

	/**
	 * Translate
	 * @param {string} translateKey
	 * @returns {string}
	 */
	t(translateKey) {
		const translation = this.translationMap[this.currentLanguage][translateKey];

		if (translation === undefined) {
			if (this.missingTranslationCallback !== undefined) {
				this.missingTranslationCallback(this.currentLanguage, translateKey);
			}

			return `missing-translation: ${translateKey}`;
		}

		return translation;
	}

	/**
	 * Format and translate
	 * @param {string} translateKey
	 * @param {any} args
	 * @returns {string}
	 */
	f(translateKey, args) {
		let translated = this.t(translateKey);
		const argKeys = Object.keys(args);

		for (let i = 0; i < argKeys.length; i += 1) {
			translated = translated.replace(`{{${argKeys[i]}}}`, args[argKeys[i]]);
		}

		return translated;
	}

};
