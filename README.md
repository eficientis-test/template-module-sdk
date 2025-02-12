# 🏗️ @eficientis-test/template-module-sdk
Un paquete que permite construir la estructura base de tu proyecto, así como los módulos (plugins) dentro de él.


## 📌 **Requisitos previos**
Antes de instalar el SDK, asegúrate de cumplir con los siguientes requisitos:

✅ **Node.js 20**  
✅ **Acceso a GitHub Packages**  
✅ **Un token de acceso a GitHub con permisos de `read:packages`**


## 🚀 **Configuración antes de instalar**
Antes de instalar el SDK, debes configurar tu archivo **`.npmrc`** para poder acceder a GitHub Packages.

Ejecuta el siguiente comando en tu terminal:

```sh
echo "@eficientis-test:registry=https://npm.pkg.github.com" > .npmrc
echo "//npm.pkg.github.com/:_authToken=GITHUB_PERSONAL_ACCESS_TOKEN" >> .npmrc
```


## 📥 Instalación
Para instalar el SDK en tu proyecto, ejecuta:
```sh
npm install @eficientis-test/template-module-sdk@latest
```

## 🏗️ Configuración en package.json
Después de instalar el SDK, tu package.json debe contener lo siguiente:
```sh
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "dependencies": {
    "@eficientis-test/template-module-sdk": "latest"
  },
  "scripts": {
    "setup": "npx setup-sdk",
    "create-plugin": "npx create-plugin"
  }
}
```
Con esta configuración, puedes ejecutar comandos directamente desde npm.


## 🔧 Inicializar el SDK
Para generar la estructura base del proyecto, ejecuta:
```sh
npm run setup
```

Esto creará la siguiente estructura:
```sh
📁 project
 ├── 📁 functions
 │    ├── 📁 src
 │    │    ├── 📁 config
 │    │    │    ├── plugins.config.json
 │    │    ├── 📁 core
 │    │    ├── 📁 plugins
 │    │    ├── index.ts
 │    ├── .env.template
 │    ├── .gitignore
 │    ├── package.json
 │    ├── tsconfig.json
 ├── .firebaserc
 ├── firebase.json
 ├── firestore.indexes.json
 ├── firestore.rules
```

## 📦 Crear un nuevo plugin
Para generar un nuevo plugin dentro del SDK, usa:
```sh
npm run create-plugin <nombre-plugin>
```
Esto generará la siguiente estructura dentro de functions/src/plugins/:
```
📁 project
 ├── 📁 functions
 │    ├── 📁 src
 │    │    ├── 📁 plugins
 │    │    │    ├── 📁 planes
 │    │    │    │    ├── 📁 application
 │    │    │    │    │    ├── PlanesResolver.ts
 │    │    │    │    ├── 📁 domain
 │    │    │    │    │    ├── Planes.ts
 │    │    │    │    │    ├── PlanesRepository.ts
 │    │    │    │    ├── index.ts
 │    │    │    │    ├── 📁 infrastructure
 │    │    │    │    │    ├── FirestorePlanesRepository.ts
```