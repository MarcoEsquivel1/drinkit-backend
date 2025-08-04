# 🛒 Dinkit Backend

Backend API para la plataforma de comercio electrónico Dinkit, construida con NestJS siguiendo arquitectura Domain-Driven Design (DDD).

## ⚡ Configuración Simplificada

**¡Solo necesitas 3 comandos para empezar!**

```bash
cp environment.example.txt .env           # Variables preconfiguradas
yarn services:dev                         # Levantar servicios de desarrollo
yarn migrations:dev && yarn seeds:dev     # Configurar base de datos
```

### Desarrollo Rápido

```bash
# 1. Levantar servicios de desarrollo (PostgreSQL, MongoDB, Redis, API)
yarn services:dev

# 2. Ejecutar migraciones y seeders dentro del contenedor
yarn migrations:dev
yarn seeds:dev

# 3. Los logs se pueden ver con:
yarn services:dev:logs
```

### Testing

```bash
# Levantar servicios de testing
yarn services:test

# Configurar base de datos de testing
yarn migrations:test
yarn seeds:test
```

### Producción

```bash
# Levantar servicios de producción
yarn services:prod

# Configurar base de datos de producción
yarn migrations:prod
yarn seeds:prod
```

**⚠️ Nota para Windows**: El script `dev-setup.sh` puede tener problemas de line endings en Windows. Usa la configuración manual paso a paso arriba.

El `.env` viene con valores simples: `secret`, `dinkitjwt`, `PORT=3000` ✅

## 🏗️ Arquitectura

Este proyecto implementa **Domain-Driven Design (DDD)** con bounded contexts claramente separados:

### Bounded Contexts

- **👥 User**: Gestión de usuarios, autenticación y perfiles
- **📦 Product**: Catálogo de productos, categorías y variantes
- **🛒 Order**: Gestión de pedidos, carrito de compras y estados de compra
- **🎯 Promotion**: Promociones, cupones, ofertas y banners
- **📍 Location**: Gestión geográfica (países, estados, ciudades)
- **🔧 Admin**: Panel administrativo y gestión de administradores

### Estructura por Bounded Context

```
src/
├── shared/                     # Módulos compartidos
│   ├── infrastructure/         # Configuraciones globales
│   └── utils/                 # Utilidades compartidas
│
├── [context]/                 # Cada bounded context
│   ├── use-cases/             # Casos de uso (1 método por endpoint)
│   ├── domain/                # Lógica de negocio pura
│   │   ├── repositories/      # Interfaces de repositorios
│   │   ├── services/          # Servicios de dominio
│   │   ├── value-objects/     # Objetos de valor
│   │   └── utils/             # Utilidades del dominio
│   ├── infrastructure/        # Implementaciones externas
│   │   └── database/entities/ # Entidades TypeORM
│   ├── interfaces/            # Capa de presentación
│   │   ├── controllers/       # Endpoints REST
│   │   └── dtos/             # DTOs de request/response
│   └── [context].module.ts    # Módulo del dominio
```

## 🛠️ Stack Tecnológico

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos Principal**: PostgreSQL
- **Auditoría**: MongoDB
- **Cache**: Redis
- **ORM**: TypeORM
- **Autenticación**: JWT + Passport
- **Documentación**: Swagger/OpenAPI
- **Containerización**: Docker

## 🚀 Configuración Inicial

### Prerrequisitos

- Node.js 18+
- Yarn
- Docker & Docker Compose
- Git (para clonar el repositorio)

> **💡 Inicio Rápido**: Si eres nuevo en el proyecto, usa el script de configuración automática: `./scripts/dev-setup.sh` o `make setup`

> **🚀 Super Rápido**: El archivo `.env` viene preconfigurado con valores simples (`secret`, `dinkitjwt`) para desarrollo inmediato

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd dinkit-backend
```

### 2. Instalar Dependencias

```bash
yarn install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp environment.example.txt .env
```

El archivo `.env` viene preconfigurado con valores simples para desarrollo:

- **Contraseñas**: `secret` (todas las bases de datos)
- **JWT Secret**: `dinkitjwt`
- **Puerto**: `3000`
- **Modo**: `development`

**Solo necesitas cambiar `LOGTAIL_KEY`** si quieres logging externo, o puedes comentarla:

```bash
# LOGTAIL_KEY=your-logtail-key
```

### 4. Configuración con Docker (Recomendado)

#### Desarrollo

```bash
# Levantar todo el stack de desarrollo (API incluida)
yarn services:dev

# Configurar base de datos automáticamente
yarn migrations:dev
yarn seeds:dev

# Ver logs en tiempo real
yarn services:dev:logs

# Parar servicios
yarn services:dev:down
```

#### Testing

```bash
# Levantar stack de testing (puertos diferentes)
yarn services:test

# Configurar base de datos de testing
yarn migrations:test
yarn seeds:test

# Parar servicios de testing
yarn services:test:down
```

#### Producción

```bash
# Levantar stack de producción
yarn services:prod

# Configurar base de datos de producción
yarn migrations:prod
yarn seeds:prod

# Ver logs de producción
yarn services:prod:logs

# Parar servicios de producción
yarn services:prod:down
```

**✅ Ventajas de la Nueva Configuración:**

- **Un solo entorno por vez**: Solo se crea la base de datos del entorno actual
- **Comandos Linux en Windows**: Ejecuta migraciones y seeders desde el contenedor
- **Separación clara**: Cada entorno tiene su propio docker-compose
- **API containerizada**: No necesitas Node.js local para desarrollo
- **Configuración unificada**: Variables de BD consistentes entre aplicación y migraciones

La aplicación estará disponible en: `http://localhost:3000`  
Documentación API (Swagger): `http://localhost:3000/api/docs`

### 5. Configuración Manual (Sin Docker)

Si prefieres configurar las bases de datos manualmente:

1. **PostgreSQL**: Crear base de datos `dinkit_db`
2. **MongoDB**: Crear base de datos `dinkit_audit`
3. **Redis**: Configurar instancia local

```bash
# Ejecutar migraciones
yarn migrations

# Ejecutar seeders
yarn seeds

# Iniciar aplicación
yarn start:dev
```

## 📋 Scripts Disponibles

### Servicios Docker

```bash
# Desarrollo
yarn services:dev           # Levantar servicios de desarrollo
yarn services:dev:down      # Detener servicios de desarrollo
yarn services:dev:logs      # Ver logs de desarrollo

# Testing
yarn services:test          # Levantar servicios de testing
yarn services:test:down     # Detener servicios de testing
yarn services:test:logs     # Ver logs de testing

# Producción
yarn services:prod          # Levantar servicios de producción
yarn services:prod:down     # Detener servicios de producción
yarn services:prod:logs     # Ver logs de producción
```

### Base de Datos (Contenedores)

```bash
# Migraciones por entorno
yarn migrations:dev         # Ejecutar migraciones en desarrollo
yarn migrations:test        # Ejecutar migraciones en testing
yarn migrations:prod        # Ejecutar migraciones en producción

# Seeders por entorno
yarn seeds:dev              # Ejecutar seeders en desarrollo
yarn seeds:test             # Ejecutar seeders en testing
yarn seeds:prod             # Ejecutar seeders en producción

# Reset completo por entorno
yarn db:reset:dev           # Reset completo en desarrollo
yarn db:reset:test          # Reset completo en testing
yarn db:reset:prod          # Reset completo en producción
```

### Desarrollo Local

```bash
yarn start:dev              # Modo desarrollo local (requiere Node.js local)
yarn start:debug            # Modo debug
yarn build                  # Compilar aplicación
yarn start:prod             # Modo producción

# Migraciones locales (requiere conexión directa a BD)
yarn migrations             # Ejecutar migraciones localmente
yarn migrations:generate [name]    # Generar nueva migración
yarn migrations:create [name]      # Crear migración vacía
yarn migrations:revert      # Revertir última migración

# Seeders locales
yarn seeds                  # Ejecutar seeders localmente
```

### Testing

```bash
yarn test              # Tests unitarios
yarn test:watch        # Tests en modo watch
yarn test:cov          # Tests con cobertura
yarn test:e2e          # Tests end-to-end
```

### Utilidades

```bash
yarn lint              # Ejecutar linter
yarn format            # Formatear código
yarn typeorm:drop      # Eliminar esquema de BD

# Usando Makefile
make lint              # Ejecutar linter
make format            # Formatear código
make clean             # Limpiar archivos temporales
make help              # Ver todos los comandos disponibles
```

## 🐳 Docker

### Configuración Multi-Entorno

El proyecto utiliza **3 archivos Docker Compose** separados para garantizar la independencia de entornos:

- **`docker-compose.dev.yml`**: Desarrollo (puertos estándar, hot reload)
- **`docker-compose.test.yml`**: Testing (puertos alternativos para evitar conflictos)
- **`docker-compose.yml`**: Producción (configuración optimizada)

### Servicios por Entorno

#### Desarrollo (`docker-compose.dev.yml`)

- **dinkit_api_dev**: API con hot reload (puerto 3000)
- **dinkit_pg_dev**: PostgreSQL para desarrollo (puerto 5432)
- **dinkit_mongo_dev**: MongoDB para auditoría (puerto 27017)
- **dinkit_redis_dev**: Redis para caché (puerto 6379)

#### Testing (`docker-compose.test.yml`)

- **dinkit_api_test**: API para testing
- **dinkit_pg_test**: PostgreSQL para testing (puerto 5433)
- **dinkit_mongo_test**: MongoDB para testing (puerto 27018)
- **dinkit_redis_test**: Redis para testing (puerto 6380)

#### Producción (`docker-compose.yml`)

- **dinkit_api_prod**: API optimizada para producción
- **dinkit_pg_prod**: PostgreSQL para producción
- **dinkit_mongo_prod**: MongoDB para producción
- **dinkit_redis_prod**: Redis para producción

### Dockerfile Multi-Stage

```dockerfile
# development: Para desarrollo con hot reload
# build: Para compilar la aplicación
# production: Para ejecución optimizada en producción
```

### Comandos Simplificados

```bash
# Usar los comandos yarn (recomendado)
yarn services:dev           # En lugar de docker-compose -f docker-compose.dev.yml up -d
yarn services:dev:down      # En lugar de docker-compose -f docker-compose.dev.yml down
yarn migrations:dev         # Ejecutar migraciones dentro del contenedor
```

## 📚 API Documentation

Una vez iniciada la aplicación, la documentación Swagger estará disponible en:

```
http://localhost:3000/api/docs
```

## 🏛️ Principios de Desarrollo

### Flujo de Datos

```
Controller → Use Case → Domain Service → Repository Interface → Infrastructure
```

### Reglas de Dependencias

1. **Domain**: No depende de ninguna capa externa
2. **Use Cases**: Solo depende de Domain e Infrastructure
3. **Infrastructure**: Implementa interfaces de Domain
4. **Interfaces**: Solo depende de Use Cases y DTOs

### Convenciones

- **Un método por Use Case**: Cada endpoint tiene su propio caso de uso
- **Nombres descriptivos**: Sin comentarios explicativos
- **Principios SOLID**: Aplicados en todas las capas
- **Yarn únicamente**: Para gestión de dependencias

## 🔧 Configuración de Entornos

### Variables de Entorno Clave (Simplificadas)

```bash
# Aplicación
NODE_ENV=development
PORT=3000

# Base de datos PostgreSQL (Multi-entorno)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dinkit_user
DB_PASSWORD=secret
DB_NAME=dinkit_db

# Desarrollo (NODE_ENV=development)
DEV_DB_HOST=localhost
DEV_DB_USERNAME=dinkit_user
DEV_DB_PASSWORD=secret
DEV_DB_NAME=dinkit_dev_db

# Testing (NODE_ENV=test)
TEST_DB_HOST=localhost
TEST_DB_USERNAME=dinkit_test_user
TEST_DB_PASSWORD=secret
TEST_DB_NAME=dinkit_test_db

# MongoDB (Auditoría)
MONGO_HOST=localhost
MONGO_USERNAME=dinkit_audit_user
MONGO_PASSWORD=secret
MONGO_DATABASE=dinkit_audit

# Redis (Cache)
REDIS_HOST=localhost
REDIS_PASSWORD=secret

# JWT (Simplificado)
JWT_SECRET=dinkitjwt

# Logging (Opcional)
LOGTAIL_KEY=your-logtail-key
```

### Configuración Multi-Entorno Automática

El proyecto cambia automáticamente de base de datos según `NODE_ENV`:

- **development**: Usa `DEV_DB_*` (fallback a `DB_*`)
- **test**: Usa `TEST_DB_*`
- **production**: Usa `DB_*`

## 🧪 Testing

### Estructura de Tests

```bash
src/
├── [context]/
│   ├── __tests__/
│   │   ├── unit/
│   │   └── integration/
└── test/
    └── e2e/
```

### Comandos de Testing

```bash
# Tests por contexto
yarn test user
yarn test product

# Tests específicos
yarn test --testNamePattern="UserService"
```

## 📈 Monitoreo y Logging

- **Logs**: Configurables por nivel (debug, info, warn, error)
- **Auditoría**: Todas las operaciones se registran en MongoDB
- **Health Checks**: Endpoint `/health` para monitoreo

## 🚀 Deployment

### Con PM2

```bash
yarn build
yarn start:pm2
```

### Con Docker

```bash
docker-compose up -d
```

## 🔧 Solución de Problemas

### ✅ Problemas Resueltos con la Nueva Configuración

La nueva configuración Docker **elimina la mayoría de problemas comunes**:

- ❌ ~~"database dinkit_dev_db does not exist"~~ → ✅ **Resuelto**: Cada entorno crea solo su BD
- ❌ ~~"authentication failed for user"~~ → ✅ **Resuelto**: Configuración automática por entorno
- ❌ ~~Comandos Windows con ";"~~ → ✅ **Resuelto**: Se ejecutan dentro del contenedor Linux
- ❌ ~~Crear 3 bases de datos manualmente~~ → ✅ **Resuelto**: Solo se crea la BD del entorno actual
- ❌ ~~Variables POSTGRES*\* vs DB*\* inconsistentes~~ → ✅ **Resuelto**: Configuración unificada

### 🔧 Correcciones Realizadas

**Configuración de Base de Datos Unificada:**

- ✅ Eliminados archivos `postgres.config.ts` y `postgres-validation.config.ts` redundantes
- ✅ `typeorm.config.ts` ahora usa las mismas variables que `database.config.ts`
- ✅ Variables `POSTGRES_*` reemplazadas por `DB_*`, `DEV_DB_*`, `TEST_DB_*`
- ✅ Configuración de servicios Docker corregida (postgres, mongo, redis)

### Problemas Actuales y Soluciones

#### ❌ Error: "Cannot connect to Docker daemon"

```bash
# Verificar que Docker Desktop esté ejecutándose
docker ps

# Si no responde, iniciar Docker Desktop y esperar
# Luego intentar de nuevo:
yarn services:dev
```

#### ❌ Error: "Port already in use"

```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3000   # Windows
lsof -i :3000                  # Linux/Mac

# Usar entorno de testing (puertos diferentes)
yarn services:test

# O parar servicios en conflicto
yarn services:dev:down
```

#### ❌ Error: "Container dinkit_api_dev not found"

```bash
# Los contenedores aún no están levantados
yarn services:dev

# Esperar unos segundos para que se inicialicen
# Luego ejecutar migraciones/seeders
yarn migrations:dev
yarn seeds:dev
```

#### ❌ Error: "Required package missing from disk" o errores de Yarn PnP (PROBLEMA EN WINDOWS)

Este problema aparece después de limpiar caché o disk cleanup en Windows:

```powershell
# 🚀 SOLUCIÓN: Limpiar y reinstalar dependencias
# 1. Limpiar cache de Yarn
yarn cache clean --all

# 2. Eliminar archivos PnP corruptos
Remove-Item -Force .pnp.cjs -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .yarn\cache -ErrorAction SilentlyContinue

# 3. Reinstalar dependencias
yarn install

# 4. Si persiste, ejecutar seeders desde el contenedor
docker exec dinkit_api yarn seeds
```

#### ❌ Error de scripts de PowerShell: "f() no se reconoce como comando"

Los scripts de package.json pueden fallar en PowerShell de Windows:

```powershell
# 🚀 SOLUCIÓN: Usar comandos directos en lugar de scripts complejos

# En lugar de: yarn migrations:generate
npx typeorm-ts-node-commonjs migration:generate -d ./src/shared/infrastructure/config/typeorm.config.ts ./src/shared/infrastructure/database/migrations/NombreMigracion

# En lugar de: yarn migrations
npx typeorm-ts-node-commonjs migration:run -d ./src/shared/infrastructure/config/typeorm.config.ts

# O usar tsx en lugar de ts-node:
npx tsx ./src/run-migrations.ts
```

### ⚠️ Configuración Específica para Windows

**Después de hacer limpieza de disco en Windows**, es probable que necesites:

1. **Recrear completamente el entorno Docker** (contenedores, volúmenes, imágenes)
2. **Reinstalar dependencias de Yarn** (caché corrompido)
3. **Recrear usuarios de PostgreSQL** (volúmenes recreados)
4. **Recrear bases de datos** (datos perdidos en limpieza)

**Script de recuperación completa para Windows:**

```powershell
# Detener todo
docker-compose -f docker-compose.dev.yml down -v

# Limpiar Docker
docker system prune -f

# Limpiar Yarn
yarn cache clean --all
Remove-Item -Force .pnp.cjs -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .yarn\cache -ErrorAction SilentlyContinue

# Reinstalar todo
yarn install
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d

# Esperar que los servicios estén listos
Start-Sleep -Seconds 20

# Recrear usuarios y bases de datos
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE USER dinkit_test_user WITH PASSWORD 'secret' SUPERUSER CREATEDB;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_test_db;"

# Ejecutar seeders (crea tablas y datos)
yarn seeds
```

### Problemas Generales (Multiplataforma)

#### Error de conexión a base de datos

```bash
# Verificar que Docker esté corriendo
docker ps

# Levantar servicios si no están activos
docker-compose -f docker-compose.dev.yml up -d

# Verificar que PostgreSQL esté completamente listo
docker logs dinkit_pg
```

#### Puerto 3000 ocupado

```bash
# Cambiar puerto en .env
PORT=3001

# O terminar proceso que usa el puerto (Windows)
netstat -ano | findstr :3000
taskkill /PID [número_de_proceso] /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

#### Variables de entorno no reconocidas

```bash
# Verificar que el archivo .env existe
ls -la .env  # Linux/Mac
dir .env     # Windows

# Verificar contenido
cat .env | head -10    # Linux/Mac
Get-Content .env       # Windows PowerShell
```

#### Problemas con Yarn

```bash
# Limpiar cache y reinstalar
rm -rf node_modules yarn.lock  # Linux/Mac
Remove-Item -Recurse -Force node_modules, yarn.lock  # Windows PowerShell
yarn install
```

### Comandos de Diagnóstico para Windows

```powershell
# Verificar estado de servicios Docker
docker-compose -f docker-compose.dev.yml ps

# Ver logs en tiempo real
docker-compose -f docker-compose.dev.yml logs -f

# Ver logs específicos de PostgreSQL
docker logs dinkit_pg

# Verificar bases de datos existentes
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "\l"

# Verificar usuarios existentes
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "\du"

# Conectarse a PostgreSQL para diagnóstico
docker exec -it dinkit_pg psql -U dinkit_user -d dinkit_dev_db

# Verificar que todas las tablas se crearon
docker exec dinkit_pg psql -U dinkit_user -d dinkit_dev_db -c "\dt"

# Verificar datos de seeders
docker exec dinkit_pg psql -U dinkit_user -d dinkit_dev_db -c "SELECT COUNT(*) FROM roles; SELECT COUNT(*) FROM countries; SELECT COUNT(*) FROM admins;"

# Conectarse a MongoDB
docker exec -it dinkit_mongo mongosh --host localhost --port 27017 -u dinkit_audit_user -p secret

# Verificar conexión a Redis
docker exec -it dinkit_redis redis-cli ping

# Ver todas las variables de entorno cargadas
docker exec dinkit_api env | Select-String -Pattern "(DB_|MONGO_|REDIS_|JWT_)"

# Verificar que Yarn funcione dentro del contenedor
docker exec dinkit_api yarn --version

# Verificar dependencias en el contenedor
docker exec dinkit_api yarn list --depth=0
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push al branch (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 📁 Archivos de Configuración Importantes

- **`environment.example.txt`**: Plantilla de variables de entorno
- **`.env`**: Variables de entorno (crear desde example)
- **`docker-compose.yml`**: Configuración para producción
- **`docker-compose.dev.yml`**: Configuración para desarrollo
- **`Dockerfile`**: Imagen Docker multi-stage
- **`Makefile`**: Comandos simplificados para desarrollo
- **`scripts/`**: Scripts de automatización para desarrollo y deployment

## 🛠️ Herramientas de Desarrollo

### Makefile

El proyecto incluye un `Makefile` que simplifica los comandos más comunes:

```bash
make help              # Ver todos los comandos disponibles
make setup             # Configuración completa inicial
make dev               # Iniciar desarrollo
make test              # Ejecutar tests
make services-up       # Levantar servicios
```

### Scripts de Automatización

- **`scripts/dev-setup.sh`**: Configuración automática del entorno de desarrollo
- **`scripts/reset-dev.sh`**: Reinicio completo del entorno
- **`scripts/production-deploy.sh`**: Deployment automatizado a producción

## 🚀 Flujo de Trabajo Recomendado

### Para Desarrollo Diario

```bash
# 1. Levantar servicios (solo la primera vez o después de cambios en Docker)
yarn services:dev

# 2. Ver logs en tiempo real (en otra terminal)
yarn services:dev:logs

# 3. Si hay cambios en migraciones/seeders
yarn migrations:dev
yarn seeds:dev

# 4. Al terminar el día
yarn services:dev:down
```

### Para Testing

```bash
# 1. Levantar servicios de testing (puertos diferentes)
yarn services:test

# 2. Ejecutar tests
yarn test

# 3. Limpiar al terminar
yarn services:test:down
```

### Para Producción

```bash
# 1. Levantar servicios de producción
yarn services:prod

# 2. Configurar base de datos
yarn migrations:prod
yarn seeds:prod

# 3. Monitorear logs
yarn services:prod:logs
```

### Reset de Entorno (Si algo sale mal)

```bash
# Para desarrollo
yarn services:dev:down
yarn services:dev
yarn migrations:dev
yarn seeds:dev

# Para testing
yarn services:test:down
yarn services:test
yarn migrations:test
yarn seeds:test
```

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.
