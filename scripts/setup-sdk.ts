#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

const baseDir = path.join(process.cwd(), "project");
const functionsDir = path.join(baseDir, "functions");
const srcDir = path.join(functionsDir, "src");
const configDir = path.join(functionsDir, "src/config");

// Crear estructura de carpetas base del proyecto si no existe
const baseFolders = [
  "functions/src/config",
  "functions/src/core",
  "functions/src/plugins",
];
baseFolders.forEach((folder) =>
  fs.mkdirSync(path.join(baseDir, folder), { recursive: true })
);

// Crear archivos esenciales en functions/
const functionsPackageJson = {
  name: "functions",
  scripts: {
    build: "tsc",
    watch: "tsc -w",
    start: "kill-port 4201 && npm run build && firebase serve --port=4201",
    emulator:
      "npm run build && npm run kill:ports && firebase emulators:start --import=./firedata --export-on-exit=./firedata",
    "kill:ports": "kill-port 8080 && kill-port 9090 && kill-port 40000",
    deploy: "firebase deploy --only functions",
    prettier: 'prettier --write "src/**/*.ts"',
    lint: 'eslint "src/**/*"',
    logs: "firebase functions:log",
    test: "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
  },
  engines: {
    node: "20",
  },
  publishConfig: {
    registry: "https://npm.pkg.github.com/",
  },
  main: "lib/index.js",
  dependencies: {
    "@eficientis-test/core": "1.0.6",
    "apollo-server-core": "^3.13.0",
    "apollo-server-express": "^3.13.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    cors: "^2.8.5",
    express: "^4.17.1",
    "firebase-admin": "^13.0.2",
    "firebase-functions": "^6.3.0",
    fireorm: "^0.23.3",
    graphql: "^15.5.0",
    "type-graphql": "^1.1.1",
    zod: "^3.23.8",
  },
  devDependencies: {
    "@types/jest": "^29.5.14",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "@typescript-eslint/parser": "^6.17.0",
    eslint: "^7.6.0",
    "eslint-plugin-import": "^2.22.0",
    "firebase-functions-test": "^0.2.0",
    "firebase-tools": "^13.0.2",
    jest: "^29.7.0",
    prettier: "^2.8.4",
    "ts-jest": "^29.2.5",
    typescript: "^5.3.3",
    "typescript-coverage-report": "^0.8.0",
  },
};

fs.writeFileSync(
  path.join(functionsDir, "package.json"),
  JSON.stringify(functionsPackageJson, null, 2)
);

const functionsTsconfigJson = {
  compilerOptions: {
    module: "Node16",
    noImplicitReturns: true,
    noUnusedLocals: true,
    outDir: "./lib",
    rootDir: "./src",
    sourceMap: true,
    esModuleInterop: true,
    strict: true,
    target: "es2017",
    moduleResolution: "node16",
    resolveJsonModule: true,
    allowSyntheticDefaultImports: true,
    types: ["node"],
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    skipLibCheck: true,
  },
  include: ["src/**/*.ts", "src/config/**/*.json"],
  exclude: ["node_modules", "lib", "dist"],
};

fs.writeFileSync(
  path.join(functionsDir, "tsconfig.json"),
  JSON.stringify(functionsTsconfigJson, null, 2)
);

const functionsGitignore = `# Compiled JavaScript files
**/*.js
**/*.js.map

# Except the ESLint config file
!.eslintrc.js

# TypeScript v1 declaration files
typings/

# Node.js dependency directory
node_modules/

# Emulation Data
firedata/
firebase-export-*/**

# Build
lib/
coverage-ts/

.env

**/**adminsdk.json
`;

fs.writeFileSync(path.join(functionsDir, ".gitignore"), functionsGitignore);

const functionsEnvs = `GRAPHQL_PLAYGROUND=true
FIREBASE_PROJECT_ID=
`;

fs.writeFileSync(path.join(functionsDir, ".env.template"), functionsEnvs);

const functionsPrettier = {
  arrowParens: "avoid",
  bracketSpacing: true,
  printWidth: 100,
  proseWrap: "preserve",
  quoteProps: "consistent",
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: true,
  overrides: [
    {
      files: "*.json",
      options: {
        tabWidth: 2,
      },
    },
  ],
};

fs.writeFileSync(
  path.join(functionsDir, ".prettierc"),
  JSON.stringify(functionsPrettier, null, 2)
);

const functionsEslint = `module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: ['plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'import'],
	rules: {
		'@typescript-eslint/adjacent-overload-signatures': 'error',
		'@typescript-eslint/no-empty-function': 'error',
		'@typescript-eslint/no-empty-interface': 'warn',
		'@typescript-eslint/no-floating-promises': 'error',
		'@typescript-eslint/no-namespace': 'error',
		'@typescript-eslint/no-unnecessary-type-assertion': 'error',
		'@typescript-eslint/prefer-for-of': 'warn',
		'@typescript-eslint/triple-slash-reference': 'error',
		'@typescript-eslint/unified-signatures': 'warn',
		'comma-dangle': ['error', 'always-multiline'],
		'constructor-super': 'error',
		'eqeqeq': ['warn', 'always'],
		'import/no-deprecated': 'warn',
		'import/no-extraneous-dependencies': 'error',
		'import/no-unresolved': ['error', { ignore: ['firebase-functions/v1'] }],
		'import/no-unassigned-import': 'warn',
		'no-cond-assign': 'error',
		'no-duplicate-case': 'error',
		'no-duplicate-imports': 'error',
		'no-empty': [
			'error',
			{
				allowEmptyCatch: true,
			},
		],
		'no-invalid-this': 'error',
		'no-new-wrappers': 'error',
		'no-param-reassign': 'error',
		'no-redeclare': 'error',
		'no-sequences': 'error',
		'no-shadow': [
			'error',
			{
				hoist: 'all',
			},
		],
		'no-throw-literal': 'error',
		'no-unsafe-finally': 'error',
		'no-unused-labels': 'error',
		'no-var': 'warn',
		'no-void': 'error',
		'prefer-const': 'warn',
		'no-shadow': 'off',
		'require-await': 'error',
		'@typescript-eslint/require-await': 'error',
		'no-return-await': 'error',
		'no-async-promise-executor': 'error',
		'no-unused-expressions': 'error',
		'no-useless-catch': 'error',
		'@typescript-eslint/no-floating-promises': 'error',
	},
	settings: {
		jsdoc: {
			tagNamePreference: {
				returns: 'return',
			},
		},
	},
	overrides: [
		{
			files: ['tests/**/*', '*.json'],
			rules: {
				'no-unused-expressions': 'off',
				'comma-dangle': 'off',
			},
			env: {
				jest: true,
			},
		},
	],
}`;

fs.writeFileSync(path.join(functionsDir, ".eslintrc.js"), functionsEslint);

// Generar configuración de Firebase Emulators
const firebaseConfig = {
  functions: {
    predeploy: [
      'npm --prefix "$RESOURCE_DIR" run lint',
      'npm --prefix "$RESOURCE_DIR" run build',
    ],
    source: "functions",
  },
  firestore: {
    rules: "firestore.rules",
    indexes: "firestore.indexes.json",
  },
  emulators: {
    functions: {
      port: 8080,
    },
    firestore: {
      port: 9090,
    },
    ui: {
      enabled: true,
      port: 40000,
    },
    singleProjectMode: true,
  },
};
fs.writeFileSync(
  path.join(baseDir, "firebase.json"),
  JSON.stringify(firebaseConfig, null, 2)
);

const firebaserc = {
  projects: {
    default: "microkernel-project",
  },
};
fs.writeFileSync(
  path.join(baseDir, ".firebaserc"),
  JSON.stringify(firebaserc, null, 2)
);

const firestoreRules = `rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }`;
fs.writeFileSync(path.join(baseDir, "firestore.rules"), firestoreRules);

const firestoreIndexes = {
  indexes: [],
  fieldOverrides: [],
};
fs.writeFileSync(
  path.join(baseDir, "firestore.indexes.json"),
  JSON.stringify(firestoreIndexes, null, 2)
);

const gitignoreBase = `
  # Logs
  logs
  *.log
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
  firebase-debug.log*
  firebase-debug.*.log*
  
  # Firebase cache
  .firebase/
  
  # Firebase config
  
  # Uncomment this if you'd like others to create their own Firebase project.
  # For a team working on the same Firebase project(s), it is recommended to leave
  # it commented so all members can deploy to the same project(s) in .firebaserc.
  # .firebaserc
  
  # Runtime data
  pids
  *.pid
  *.seed
  *.pid.lock
  
  # Directory for instrumented libs generated by jscoverage/JSCover
  lib-cov
  
  # Coverage directory used by tools like istanbul
  coverage
  
  # nyc test coverage
  .nyc_output
  
  # Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
  .grunt
  
  # Bower dependency directory (https://bower.io/)
  bower_components
  
  # node-waf configuration
  .lock-wscript
  
  # Compiled binary addons (http://nodejs.org/api/addons.html)
  build/Release
  
  # Dependency directories
  node_modules/
  
  # Optional npm cache directory
  .npm
  
  # Optional eslint cache
  .eslintcache
  
  # Optional REPL history
  .node_repl_history
  
  # Output of 'npm pack'
  *.tgz
  
  # Yarn Integrity file
  .yarn-integrity
  
  # dotenv environment variables file
  .env
  `;
fs.writeFileSync(path.join(baseDir, ".gitignore"), gitignoreBase);

// Generar `index.ts` para el punto de entrada en functions/
const functionsIndexContent = `import * as functions from 'firebase-functions/v1';
  import { Kernel } from '@eficientis-test/core/Kernel';
  import { GraphQLServer } from '@eficientis-test/core/GraphQLServer';
  
  const kernel = new Kernel();
  
  const initServer = async () => {
    await kernel.initialize();
    const resolvers = kernel.getResolvers();
    if (resolvers.length === 0) throw new Error('❌ No hay resolvers disponibles.');
    console.log(\`✅ Resolvers cargados: \${resolvers.length}\`);
    const server = new GraphQLServer(kernel);
    await server.start();
    console.log('✅ Servidor GraphQL listo');
    return server;
  };
  
  exports.backend = functions.region('us-central1').https.onRequest(async (req, res) => {
    try {
      const server = await initServer();
      const app = server.serve();
      if (req.url.startsWith('/graphql')) return app(req, res);
      res.status(404).send('NOT FOUND');
    } catch (error) {
      console.error('❌ Error en la solicitud:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  `;
fs.writeFileSync(path.join(srcDir, "index.ts"), functionsIndexContent);

// Crear archivo de configuracion
fs.writeFileSync(
    path.join(configDir, "plugins.config.json"),
    JSON.stringify({ activePlugins: [] }, null, 2)
  );