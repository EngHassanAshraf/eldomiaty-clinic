import nextPlugin from '@next/eslint-plugin-next';

export default [
    {
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            'react/no-unescaped-entities': 'off',
            '@next/next/no-img-element': 'off',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
];