import configDefault, { cspellWords, tseslint } from 'eslint-config-cityssm';
export const config = tseslint.config(...configDefault, {
    rules: {
        '@cspell/spellchecker': [
            'warn',
            {
                cspell: {
                    words: [...cspellWords, 'sectorflow']
                }
            }
        ]
    }
});
export default config;
