# Microfrontends E-Commerce

Ejemplo didáctico para la **Especialización en Microservicios** — módulo de Microfrontends.

Demuestra los **tres conceptos fundamentales** de la arquitectura microfrontend en un caso de estudio e-commerce funcional con código real y ejecutable.

---

## Inicio rápido

**Con Docker (recomendado):**
```bash
git clone <repo-url>
cd microfrontends-ecommerce
docker-compose up --build
# Abrir http://localhost
```

**Sin Docker — modo desarrollo:**
```bash
# Abrir 4 terminales y ejecutar cada uno en su directorio:
cd mfe-catalog && npm install && npm start   # :3001
cd mfe-cart    && npm install && npm start   # :3002
cd mfe-profile && npm install && npm start   # :3003
cd shell       && npm install && npm start   # :3000 → abrir este
```

---

## Concepto 1: Integración en Runtime (Module Federation)

Webpack Module Federation permite que el shell descargue código de otros proyectos **en tiempo de ejecución**, no en tiempo de compilación. El bundle del shell NO contiene código de los MFEs.

### Diagrama 1 — Arquitectura general

```mermaid
graph TD
    Browser["🌐 Browser"]
    Nginx["Nginx :80\nReverse Proxy"]
    Shell["shell :3000\nReact 18 — Host MF\nNavbar + Router"]
    Catalog["mfe-catalog :3001\nReact 18 — Remote\nCatálogo de productos"]
    Cart["mfe-cart :3002\nVue 3 — Remote\nCarrito de compras"]
    Profile["mfe-profile :3003\nReact 18 — Remote\nPerfil de usuario"]

    Browser -->|"GET /"| Nginx
    Nginx -->|"proxy_pass"| Shell
    Nginx -->|"/catalog/"| Catalog
    Nginx -->|"/cart/"| Cart
    Nginx -->|"/profile/"| Profile

    Shell -.->|"runtime: fetch remoteEntry.js"| Catalog
    Shell -.->|"runtime: fetch remoteEntry.js"| Cart
    Shell -.->|"runtime: fetch remoteEntry.js"| Profile

    style Shell fill:#667eea,color:#fff
    style Catalog fill:#667eea,color:#fff
    style Cart fill:#41b883,color:#fff
    style Profile fill:#f093fb,color:#fff
    style Nginx fill:#f6ad55,color:#fff
```

**Dónde verlo en el código:**
- `shell/webpack.config.js` — `remotes: { catalog: 'catalog@...' }` (host consume remotes)
- `mfe-catalog/webpack.config.js` — `exposes: { './CatalogApp': './src/CatalogApp' }` (remote expone módulos)
- `shell/src/App.jsx` — `React.lazy(() => import('catalog/CatalogApp'))` (carga en runtime)
- `nginx/nginx.conf` — reglas de proxy inverso

### Diagrama 2 — Flujo de carga en runtime

```mermaid
sequenceDiagram
    actor U as Usuario
    participant B as Browser
    participant N as Nginx :80
    participant S as shell :3000
    participant C as mfe-catalog :3001
    participant K as mfe-cart :3002
    participant P as mfe-profile :3003

    U->>B: Abre http://localhost
    B->>N: GET /
    N->>S: proxy_pass shell
    S-->>B: index.html + shell.bundle.js

    Note over B,S: Shell cargado. React Router activo.

    B->>N: GET /catalog/remoteEntry.js
    N->>C: proxy_pass → /remoteEntry.js
    C-->>B: remoteEntry.js (manifiesto del módulo)

    B->>N: GET /cart/remoteEntry.js
    N->>K: proxy_pass → /remoteEntry.js
    K-->>B: remoteEntry.js

    B->>N: GET /profile/remoteEntry.js
    N->>P: proxy_pass → /remoteEntry.js
    P-->>B: remoteEntry.js

    Note over B: Webpack MF registra los 3 remotes en memoria

    U->>B: Navega a /catalog
    B->>N: GET /catalog/src_CatalogApp_jsx.js
    N->>C: proxy_pass
    C-->>B: chunk del componente CatalogApp
    B-->>U: Renderiza catálogo de productos
```

**Dónde verlo:**
- En DevTools → Network, filtrar `remoteEntry.js` — verás 3 peticiones a distintos orígenes
- `shell/src/App.jsx` línea 10-11: los `React.lazy` disparan el fetch al navegar
- `shell/src/remotes/CartWrapper.jsx` línea 12: `import('cart/CartApp')` descarga el módulo Vue

---

## Concepto 2: Comunicación entre MFEs

Los MFEs **no se importan entre sí**. Se comunican mediante dos patrones desacoplados.

### Diagrama 3 — Flujo add-to-cart

```mermaid
sequenceDiagram
    actor U as Usuario
    participant PC as ProductCard<br/>(mfe-catalog)
    participant W as window DOM
    participant CA as CartApp.vue<br/>(mfe-cart)
    participant ST as window.__APP_STORE__<br/>(shell)
    participant NB as Navbar<br/>(shell)

    U->>PC: Click "Agregar"

    PC->>W: dispatchEvent('add-to-cart', {id, name, price, image})
    Note over PC,W: mfe-catalog no sabe quién escucha este evento

    W->>CA: addEventListener callback ejecutado
    CA->>CA: items.push(event.detail + cartId)
    Note over CA: Vue reactivity actualiza la lista

    PC->>ST: __APP_STORE__.update({cartCount: +1})
    ST->>NB: notifica a todos los listeners
    NB->>NB: setCartCount(newCount) → re-render badge
```

**Dónde verlo:**
- **Patrón A — Custom Events:** `mfe-catalog/src/components/ProductCard.jsx` → `window.dispatchEvent(new CustomEvent('add-to-cart', ...))`
- **Escucha sin import:** `mfe-cart/src/CartApp.vue` → `mounted() { window.addEventListener('add-to-cart', ...) }`
- **Patrón B — Shared State:** `shell/src/bootstrap.jsx` → definición de `window.__APP_STORE__`
- **Suscripción reactiva:** `shell/src/components/Navbar.jsx` → `window.__APP_STORE__.subscribe(...)`

| | Custom Events | Shared State |
|---|---|---|
| Acoplamiento | Cero — solo comparten el nombre del evento | Bajo — contrato del store object |
| Uso ideal | MFE → MFE (catalog → cart) | MFE → Shell (cart badge en navbar) |
| Dirección | Unidireccional broadcast | Bidireccional |

---

## Concepto 3: Despliegue Independiente

Cada MFE tiene su propio `Dockerfile` multi-stage. Se pueden reconstruir sin tocar los demás.

### Diagrama 4 — Pipelines independientes

```mermaid
graph LR
    subgraph CA["Equipo Catalog"]
        GC[commit] --> BC[docker build\nmfe-catalog]
        BC --> DC[nginx :3001]
    end
    subgraph CK["Equipo Cart"]
        GK[commit] --> BK[docker build\nmfe-cart]
        BK --> DK[nginx :3002]
    end
    subgraph CP["Equipo Profile"]
        GP[commit] --> BP[docker build\nmfe-profile]
        BP --> DP[nginx :3003]
    end
    subgraph CS["Equipo Shell"]
        GS[commit] --> BS[docker build\nshell]
        BS --> DS[nginx :3000]
    end
    DC & DK & DP & DS --> N["Nginx :80\nReverse Proxy"]

    style BC fill:#667eea,color:#fff
    style BK fill:#41b883,color:#fff
    style BP fill:#f093fb,color:#fff
    style BS fill:#f6ad55,color:#fff
```

**Comando clave — reconstruir solo el carrito:**
```bash
docker-compose up --build mfe-cart
# Solo mfe-cart se reconstruye. Shell, catalog y profile no se tocan.
```

**Dónde verlo:**
- `mfe-cart/Dockerfile` — Dockerfile independiente del resto
- `docker-compose.yml` — cada servicio con su propio `build:` context
- `shell/Dockerfile` — build args `CATALOG_URL`, `CART_URL`, `PROFILE_URL` para URLs de producción

---

## Monolito Frontend vs Microfrontend

### Diagrama 5 — Por qué importa la separación

```mermaid
graph TD
    subgraph MONO["❌ Monolito Frontend"]
        M["Un solo bundle — 8MB\nUn deploy cambia todo\nUn bug puede tumbar la app\nUn framework para todos los equipos"]
        M --> MA[Catálogo]
        M --> MB[Carrito]
        M --> MC[Perfil]
        M --> MD[Auth]
        style M fill:#e53e3e,color:#fff
    end

    subgraph MFE["✅ Microfrontend"]
        SH["shell — 200KB\nOrquestador"]
        R1["mfe-catalog — 150KB\nReact · Equipo A"]
        R2["mfe-cart — 120KB\nVue 3 · Equipo B"]
        R3["mfe-profile — 100KB\nReact · Equipo C"]
        SH -.->|runtime| R1
        SH -.->|runtime| R2
        SH -.->|runtime| R3
        style SH fill:#38a169,color:#fff
        style R1 fill:#667eea,color:#fff
        style R2 fill:#41b883,color:#fff
        style R3 fill:#f093fb,color:#fff
    end
```

---

## Estructura del repositorio

```
microfrontends-ecommerce/
├── shell/                          # Host MF — React 18
│   ├── src/index.js                # ← async import('./bootstrap') OBLIGATORIO en MF
│   ├── src/bootstrap.jsx           # ← inicializa window.__APP_STORE__
│   ├── src/App.jsx                 # ← React Router + React.lazy para remotes
│   ├── src/components/Navbar.jsx   # ← badge reactivo via shared store
│   ├── src/remotes/CartWrapper.jsx # ← monta Vue app dentro de React
│   └── webpack.config.js           # ← ModuleFederationPlugin HOST
│
├── mfe-catalog/                    # Remote MF — React 18
│   ├── src/CatalogApp.jsx          # ← componente expuesto via remoteEntry.js
│   ├── src/components/ProductCard.jsx # ← dispara CustomEvent 'add-to-cart'
│   └── webpack.config.js           # ← exposes: { './CatalogApp': ... }
│
├── mfe-cart/                       # Remote MF — Vue 3 ← framework distinto
│   ├── src/CartApp.vue             # ← escucha 'add-to-cart' en mounted()
│   ├── src/mount.js                # ← función mount/unmount para bridge React-Vue
│   └── webpack.config.js           # ← exposes: { './CartApp': './src/mount' }
│
├── mfe-profile/                    # Remote MF — React 18
│   ├── src/ProfileApp.jsx          # ← componente expuesto via remoteEntry.js
│   └── webpack.config.js           # ← exposes: { './ProfileApp': ... }
│
├── nginx/
│   └── nginx.conf                  # ← reverse proxy — simula API Gateway frontend
│
├── docker-compose.yml              # ← orquestación — deploy independiente por servicio
└── README.md
```

---

## Nota pedagógica: repo único vs repos separados

Este ejemplo usa **un solo repositorio** por simplicidad didáctica. En producción real, cada MFE viviría en su propio repositorio con su propio pipeline CI/CD:

```mermaid
graph LR
    R1["github.com/org/shell"] --> CI1["CI/CD Pipeline"]
    R2["github.com/org/mfe-catalog"] --> CI2["CI/CD Pipeline"]
    R3["github.com/org/mfe-cart"] --> CI3["CI/CD Pipeline"]
    R4["github.com/org/mfe-profile"] --> CI4["CI/CD Pipeline"]
    CI1 & CI2 & CI3 & CI4 --> CDN["CDN / Kubernetes"]
```

Cada equipo tiene autonomía total: su repositorio, su pipeline, su ciclo de release, su elección de framework.

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| React | 18 | Shell, mfe-catalog, mfe-profile |
| Vue | 3 | mfe-cart — demuestra independencia de framework |
| Webpack | 5 | Build + ModuleFederationPlugin |
| Docker | 24+ | Contenedores independientes por MFE |
| Nginx | 1.25 | Reverse proxy + servir assets estáticos |
| Node | 20 LTS | Runtime de build |
