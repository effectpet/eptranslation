## About
EPTranslation is a simple translation class without external dependencies.

## How to use
```javascript
	const EPTranslation = require('eptranslation');
	const translation = new EPTranslation({
		languageFolder: './lang',
		defaultLanguage: 'en'
	});

	/**
	 * If it's a simple key/value pair
	 */
	translation.t('page.header');

	/**
	 * You also can use inline parameters.
	 * Value inside your language file: 'Hello {{username}}'
	 * Replaced value: 'Hello FunnyDude'
	 */
	translation.f('greet.user', { username: 'FunnyDude' });

	/**
	 * Change the current language
	 */
	translation.setLanguage('de');

	/**
	 * Reload your language files
	 */
	translation.reloadLanguageFiles();
```

Following options exist:
-   `options.languageFolder` Path to the lang folder
-   `options.defaultLanguage` Name of the default language
