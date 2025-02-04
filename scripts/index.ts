#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

const pluginName: string = process.argv[2];

if (!pluginName) {
  console.error("❌ Debes proporcionar un nombre para el plugin.");
  process.exit(1);
}

const formattedName = pluginName.charAt(0).toUpperCase() + pluginName.slice(1);
const pluginDir = path.join(
  process.cwd(),
  "src/plugins",
  pluginName.toLowerCase()
);

// Crear estructura de carpetas dentro de `src/plugins/`
const folders = ["application", "domain", "infrastructure"];
folders.forEach((folder) =>
  fs.mkdirSync(path.join(pluginDir, folder), { recursive: true })
);

// Crear `index.ts` con el nombre del plugin
const indexContent = `
import { EventBus } from '@eficientis-test/core/EventBus';
import { PluginContract } from '@eficientis-test/core/PluginContract';

export default class ${formattedName}Plugin implements PluginContract {
  name = '${formattedName}Plugin';
  private active = true;

  constructor(eventBus: EventBus) {}

  init(): void {
    console.log(\`[${formattedName}Plugin] initialized\`);
  }

  isActive(): boolean {
    return this.active;
  }
}
`;
fs.writeFileSync(path.join(pluginDir, "index.ts"), indexContent);

// Crear contenido base de `application`
const applicationContent = `
import { Resolver } from 'type-graphql';

@Resolver()
export class ${formattedName}Resolver {
  constructor() {}
}
`;
fs.writeFileSync(
  path.join(pluginDir, "application", `${formattedName}Resolver.ts`),
  applicationContent
);

// Crear contenido base de `domain`
const domainContentObject = `
import { Collection } from 'fireorm';
import { Field, ID, InputType, ObjectType } from 'type-graphql';

@ObjectType()
@Collection('${formattedName}')
export class ${formattedName} {
	@Field(() => ID) id!: string;
  constructor() {}
}
  
@InputType()
export class ${formattedName}Dto {
	@Field(() => ID) id!: string;
  constructor() {}
}
`;
fs.writeFileSync(
  path.join(pluginDir, "domain", `${formattedName}.ts`),
  domainContentObject
);

const domainContentRepository = `
import { ${formattedName}, ${formattedName}Dto } from './${formattedName}';

export interface ${formattedName}Repository {
  find(id: string): Promise<${formattedName}>;
  save(entity: ${formattedName}Dto): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}
`;
fs.writeFileSync(
  path.join(pluginDir, "domain", `${formattedName}Repository.ts`),
  domainContentRepository
);

// Crear contenido base de `infrastructure`
const infrastructureContent = `
import { getRepository } from 'fireorm';
import { ${formattedName} } from '../domain/${formattedName}';
import { ${formattedName}Repository } from '../domain/${formattedName}Repository';

export class Firestore${formattedName}Repository implements ${formattedName}Repository {
  constructor() {}

  async find(id: string): Promise<${formattedName}> {
    return getRepository(${formattedName}).findById(id);
  }

  async save(entity: ${formattedName}): Promise<boolean> {
    await getRepository(${formattedName}).create(entity);
    return true;
  }

  async remove(id: string): Promise<boolean> {
    await getRepository(${formattedName}).delete(id);
    return true;
  }
}
`;
fs.writeFileSync(
  path.join(
    pluginDir,
    "infrastructure",
    `Firestore${formattedName}Repository.ts`
  ),
  infrastructureContent
);

// Crear `package.json` personalizado para el plugin
const packageJsonContent = {
  name: `@eficientis-test/${pluginName.toLowerCase()}`,
  version: "1.0.0",
  description: "",
  main: "lib/index.js",
  type: "module",
  repository: {
    type: "git",
    url: "https://github.com/eficientis-test/backend-plugin-architecture.git",
  },
  publishConfig: {
    registry: "https://npm.pkg.github.com/",
  },
  dependencies: {
    "@eficientis-test/core": "1.0.0",
    "type-graphql": "^1.1.1",
    fireorm: "^0.23.3",
  },
};

fs.writeFileSync(
  path.join(pluginDir, "package.json"),
  JSON.stringify(packageJsonContent, null, 2)
);

// Crear `.gitignore`
const gitignoreContent = `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Diagnostic reports
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional caches
.npm
.eslintcache
.stylelintcache

# Output directories
lib/
dist/
.cache/
.parcel-cache
.next/
out/
.nuxt/

# Miscellaneous
.vscode-test
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*
`;
fs.writeFileSync(path.join(pluginDir, ".gitignore"), gitignoreContent);

console.log(
  `✅ Plugin ${formattedName} creado con éxito en src/plugins/${pluginName.toLowerCase()}`
);
