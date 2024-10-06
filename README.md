# bayport_frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Compiles and minifies for staging/uat

```sh
npm run buildStaging
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh


npm run lint
```

### Set environment variables

```
root director file -> .env.development
Change var:
VITE_APP_API_URL = http://localhost/bayrepodev/public/public/api  to ->  VUE_APP_API_URL = https://mzhqprdlmis02.moz.bayportfinance.com/api
VITE_APP_API_RESOURCE_URL = http://localhost/bayrepodev/public/public/ to -> VUE_APP_API_RESOURCE_URL = https://mzhqprdlmis02.moz.bayportfinance.com/
```

### Publish to git staging/uat

```
git init
git add -A
git commit -m "initial commit"
git remote add origin https://github.com/enhacudima/bayrepodev_frontend_uat.git
git branch -M main
git push -u -f origin main
```

### Publish to git production

```
git init
git add -A
git commit -m "initial commit"
git remote add origin https://github.com/enhacudima/bayrepodev_frontend_production.git
git branch -M main
git push -u -f origin main
```

### On server hosting git pull

```
git rebase origin/main
git pull --rebase
```
