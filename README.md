# 🛒 Dinkit Backend

Backend API para la plataforma de comercio electrónico Dinkit, construida con NestJS siguiendo arquitectura Domain-Driven Design (DDD).

## ⚡ Configuración Simplificada

**¡Solo necesitas 5 comandos para empezar!**

```bash
cp environment.example.txt .env                      # Variables preconfiguradas
docker-compose -f docker-compose.dev.yml up -d       # Servicios (PostgreSQL, MongoDB, Redis)
./scripts/dev-setup.sh                               # Configuración automática completa
# O manualmente:
# docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;"
yarn seeds                                           # Ejecutar seeders (crea tablas y datos)
yarn start:dev                                       # ¡Listo! 🚀
```

**🚀 Configuración Manual Paso a Paso (Windows PowerShell):**

```powershell
# 1. Levantar servicios
docker-compose -f docker-compose.dev.yml up -d

# 2. Esperar que PostgreSQL esté listo
Start-Sleep -Seconds 15

# 3. Crear bases de datos adicionales (CRÍTICO)
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_test_db;"

# 4. Ejecutar seeders (crea tablas automáticamente y datos iniciales)
yarn seeds

# 5. Iniciar aplicación
yarn start:dev
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

#### Opción A: Configuración Automática (Recomendada)

```bash
# Script que hace todo automáticamente
./scripts/dev-setup.sh

# Iniciar aplicación
yarn start:dev
```

#### Opción B: Configuración Manual

```bash
# 1. Levantar servicios (PostgreSQL, MongoDB, Redis)
docker-compose -f docker-compose.dev.yml up -d

# 2. Esperar a que PostgreSQL esté listo (importante)
sleep 15

# 3. Crear bases de datos adicionales (CRÍTICO)
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_test_db;"

# 4. Ejecutar migraciones
yarn migrations

# 5. Ejecutar seeders (datos iniciales)
yarn seeds

# 6. Iniciar en modo desarrollo
yarn start:dev
```

**⚠️ Nota Importante:** El paso 3 (creación de bases de datos) es crítico. Sin estas bases de datos adicionales, la aplicación mostrará errores constantes de "database does not exist".

La aplicación estará disponible en: `http://localhost:3000`  
Documentación API (Swagger): `http://localhost:3000/api/docs`

#### Producción

```bash
docker-compose up -d
```

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

### Scripts de Configuración Rápida

```bash
# Configuración completa para desarrollo (recomendado para nuevos desarrolladores)
./scripts/dev-setup.sh
# o usar make
make setup

# Reiniciar entorno de desarrollo completo
./scripts/reset-dev.sh
# o usar make
make reset

# Deployment a producción
./scripts/production-deploy.sh
# o usar make
make deploy
```

### Desarrollo

```bash
yarn start:dev          # Modo desarrollo con hot reload
yarn start:debug        # Modo debug
yarn build              # Compilar aplicación
yarn start:prod         # Modo producción

# Usando Makefile (más fácil)
make dev                # Modo desarrollo
make build              # Compilar
make prod               # Producción
```

### Base de Datos

```bash
# Configuración inicial (CRÍTICO para primer setup)
make create-databases              # Crear bases de datos adicionales
# O manualmente:
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;"

# Migraciones
yarn migrations                    # Ejecutar migraciones
yarn migrations:generate [name]    # Generar nueva migración
yarn migrations:create [name]      # Crear migración vacía
yarn migrations:revert            # Revertir última migración

# Seeders
yarn seeds              # Ejecutar todos los seeders
yarn seeds:test         # Ejecutar seeders en entorno de test

# Usando Makefile
make create-databases   # ⚠️ CREAR BASES DE DATOS (paso crítico)
make migrations         # Ejecutar migraciones
make seeds             # Ejecutar seeders
make db-reset          # Reiniciar BD completa (drop + migrations + seeds)
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

### Servicios Disponibles

- **dinkit_api**: Aplicación NestJS
- **dinkit_pg**: PostgreSQL 15
- **dinkit_mongo**: MongoDB 7
- **dinkit_redis**: Redis 7

### Comandos Docker

```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down

# Producción
docker-compose up -d
docker-compose down

# Ver logs
docker-compose logs -f api

# Usando Makefile (simplificado)
make services-up       # Levantar servicios de desarrollo
make services-down     # Detener servicios
make services-logs     # Ver logs en tiempo real
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

### Problemas Comunes en Windows

#### ❌ Error: "ColumnTypeUndefinedError: Column type for BaseEntity#createdBy is not defined" (NUEVO PROBLEMA COMÚN)

Este error aparece cuando TypeORM no puede determinar el tipo de una columna:

```bash
# 🚀 SOLUCIÓN: Ya está corregido en el código
# Se agregaron tipos explícitos a todas las columnas en las entidades base:
# - src/shared/infrastructure/database/entities/base/user.base.ts
# - src/shared/infrastructure/database/entities/base/audited.base.ts
# - src/shared/infrastructure/database/entities/base/paranoid.base.ts

# Si ves este error, verifica que todas las columnas @Column() tengan type explícito:
@Column({ type: 'varchar', name: 'created_by' })
```

#### ❌ Error: "Cannot find module 'src/location/infrastructure/database/entities/...'" (NUEVO PROBLEMA COMÚN)

Este error aparece por importaciones absolutas incorrectas:

```bash
# 🚀 SOLUCIÓN: Ya está corregido en el código
# Se cambiaron todas las importaciones de:
# import { Country } from 'src/location/infrastructure/...'
# 
# A importaciones relativas:
# import { Country } from '../../../../location/infrastructure/...'

# Archivos corregidos:
# - src/user/infrastructure/database/entities/users-address.entity.ts
# - src/user/infrastructure/database/entities/users-request.entity.ts
# - src/promotion/infrastructure/database/entities/coupon-usage.entity.ts
# - src/order/infrastructure/database/entities/order-detail.entity.ts
```

#### ❌ Error: "relation 'public.roles' does not exist" después de migraciones (NUEVO PROBLEMA COMÚN)

Las migraciones TypeORM pueden fallar en Windows. Solución usando synchronize temporal:

```powershell
# 🚀 SOLUCIÓN COMPLETA: Usar seeders con synchronize temporal

# 1. Verificar que los servicios estén corriendo
docker-compose -f docker-compose.dev.yml ps

# 2. Crear bases de datos si no existen
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;" 2>$null

# 3. Ejecutar seeders (esto crea automáticamente las tablas)
yarn seeds

# Los seeders usan synchronize temporalmente para crear tablas automáticamente
# Luego revierte a synchronize: false para seguridad
```

#### ❌ Error: "database dinkit_dev_db does not exist" (MÁS COMÚN)

Este es el error más frecuente. La aplicación no puede conectarse porque faltan las bases de datos adicionales:

```powershell
# 🚀 SOLUCIÓN RÁPIDA: Usar el script automático
./scripts/dev-setup.sh

# 🔧 O crear manualmente las bases de datos faltantes:
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_test_db;"

# Luego ejecutar seeders
yarn seeds
```

#### ❌ Error: "authentication failed for user dinkit_user" (PROBLEMA COMÚN EN WINDOWS)

Este error aparece frecuentemente después de limpiar Docker o recrear contenedores:

```powershell
# 🚀 SOLUCIÓN COMPLETA: Recrear entorno desde cero
# 1. Detener y limpiar todos los contenedores y volúmenes
docker-compose -f docker-compose.dev.yml down -v

# 2. Limpiar sistema Docker (opcional, libera espacio)
docker system prune -f

# 3. Reconstruir imágenes sin cache
docker-compose -f docker-compose.dev.yml build --no-cache

# 4. Levantar servicios
docker-compose -f docker-compose.dev.yml up -d

# 5. Esperar que estén listos
Start-Sleep -Seconds 20

# 6. Crear usuario de pruebas (necesario después de recrear contenedores)
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE USER dinkit_test_user WITH PASSWORD 'secret' SUPERUSER CREATEDB;"

# 7. Crear bases de datos adicionales
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;"
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_test_db;"

# 8. Ejecutar seeders
yarn seeds
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

## 📞 Soporte

Para soporte técnico o consultas sobre el proyecto, contactar al equipo de desarrollo.
