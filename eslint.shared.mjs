// Règles communes au site et à l'API : elles traduisent le doc 11 (conventions de code)
export const sharedRules = {
  'no-var': 'error',
  'prefer-const': 'error',
  eqeqeq: ['error', 'always'],
  curly: ['error', 'all'],
  'no-console': 'warn',
  'no-empty': ['error', { allowEmptyCatch: false }],
  'no-restricted-syntax': [
    'error',
    {
      selector: 'ForStatement',
      message:
        'Pas de boucle for classique : map, filter, reduce, find, some ou every (doc 11 §3).',
    },
    {
      selector: 'ForInStatement',
      message: 'Pas de for...in : Object.keys, Object.values ou Object.entries (doc 11 §3).',
    },
  ],
  'no-magic-numbers': [
    'warn',
    { ignore: [0, 1, -1], ignoreArrayIndexes: true, ignoreDefaultValues: true, enforceConst: true },
  ],
}
