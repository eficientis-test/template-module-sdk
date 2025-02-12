#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";

const pluginName: string = process.argv[2];

if (!pluginName) {
  console.error("❌ Debes proporcionar un nombre para el plugin.");
  process.exit(1);
}

const formattedName = pluginName.charAt(0).toUpperCase() + pluginName.slice(1);
const baseDir = path.join(process.cwd(), "project");
const pluginsDir = path.join(baseDir, "functions/src/plugins");
const pluginDir = path.join(pluginsDir, pluginName.toLowerCase());
const configPath = path.join(
  baseDir,
  "functions/src/config/plugins.config.json"
);

// Verificar si la estructura base del SDK existe
if (!fs.existsSync(pluginsDir)) {
  console.error(
    "❌ No se encontró la estructura base del SDK. Ejecuta `generate-base` primero."
  );
  process.exit(1);
}

// Crear estructura de carpetas dentro de `src/plugins/{plugin}`
const folders = ["application", "domain", "infrastructure"];
folders.forEach((folder) =>
  fs.mkdirSync(path.join(pluginDir, folder), { recursive: true })
);

// Crear archivos base del plugin
const indexContent = `import { EventBus } from '@eficientis-test/core/EventBus';
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

// Generar contenido base de application
const applicationContent = `import { Resolver } from 'type-graphql';

@Resolver()
export class ${formattedName}Resolver {
  constructor() {}
}`;
fs.writeFileSync(
  path.join(pluginDir, "application", `${formattedName}Resolver.ts`),
  applicationContent
);

// Generar contenido base de domain
const domainContentObject = `import { Collection } from 'fireorm';
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
}`;
fs.writeFileSync(
  path.join(pluginDir, "domain", `${formattedName}.ts`),
  domainContentObject
);

const domainContentRepository = `import { ${formattedName}, ${formattedName}Dto } from './${formattedName}';

export interface ${formattedName}Repository {
  find(id: string): Promise<${formattedName}>;
  save(entity: ${formattedName}Dto): Promise<boolean>;
  remove(id: string): Promise<boolean>;
}`;
fs.writeFileSync(
  path.join(pluginDir, "domain", `${formattedName}Repository.ts`),
  domainContentRepository
);

// Generar contenido base de infrastructure
const infrastructureContent = `import { getRepository } from 'fireorm';
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
}`;
fs.writeFileSync(
  path.join(
    pluginDir,
    "infrastructure",
    `Firestore${formattedName}Repository.ts`
  ),
  infrastructureContent
);

// Actualizar plugins.config.json
if (!fs.existsSync(configPath)) {
  console.error(
    "❌ No se encontró plugins.config.json. Ejecuta `generate-base` primero."
  );
  process.exit(1);
}

const pluginsConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
if (!pluginsConfig.activePlugins.includes(pluginName)) {
  pluginsConfig.activePlugins.push(pluginName);
}
fs.writeFileSync(configPath, JSON.stringify(pluginsConfig, null, 2));

console.log(`✅ Plugin ${formattedName} creado en ${pluginDir} correctamente.`);
