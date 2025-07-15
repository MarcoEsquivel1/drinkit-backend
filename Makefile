# Dinkit Backend - Makefile
# Comandos útiles para el desarrollo

.PHONY: help install setup dev prod test clean reset deploy

# Mostrar ayuda por defecto
help:
	@echo ""
	@echo "🛒 Dinkit Backend - Comandos Disponibles"
	@echo "========================================"
	@echo ""
	@echo "📦 Configuración:"
	@echo "  make install     - Instalar dependencias"
	@echo "  make setup       - Configuración completa para desarrollo"
	@echo "  make reset       - Reiniciar entorno de desarrollo"
	@echo ""
	@echo "🔧 Desarrollo:"
	@echo "  make dev         - Iniciar en modo desarrollo"
	@echo "  make build       - Compilar aplicación"
	@echo "  make test        - Ejecutar tests"
	@echo ""
	@echo "🚀 Servicios:"
	@echo "  make services-up   - Levantar servicios (DB, Redis, etc.)"
	@echo "  make services-down - Detener servicios"
	@echo "  make services-logs - Ver logs de servicios"
	@echo ""
	@echo "💾 Base de Datos:"
	@echo "  make create-databases - Crear bases de datos adicionales (CRÍTICO)"
	@echo "  make migrations       - Ejecutar migraciones"
	@echo "  make seeds            - Ejecutar seeders"
	@echo "  make db-reset         - Reiniciar base de datos"
	@echo ""
	@echo "🔍 Utilidades:"
	@echo "  make lint        - Ejecutar linter"
	@echo "  make format      - Formatear código"
	@echo "  make clean       - Limpiar archivos temporales"
	@echo ""
	@echo "🚀 Producción:"
	@echo "  make prod        - Iniciar en modo producción"
	@echo "  make deploy      - Deployment a producción"
	@echo ""

# Instalar dependencias
install:
	@echo "📦 Instalando dependencias..."
	yarn install

# Configuración completa para desarrollo
setup:
	@echo "🚀 Configurando entorno de desarrollo..."
	./scripts/dev-setup.sh

# Reiniciar entorno de desarrollo
reset:
	@echo "🔄 Reiniciando entorno de desarrollo..."
	./scripts/reset-dev.sh

# Desarrollo
dev:
	@echo "🔧 Iniciando en modo desarrollo..."
	yarn start:dev

# Build
build:
	@echo "🏗️ Compilando aplicación..."
	yarn build

# Tests
test:
	@echo "🧪 Ejecutando tests..."
	yarn test

test-watch:
	@echo "🧪 Ejecutando tests en modo watch..."
	yarn test:watch

test-cov:
	@echo "🧪 Ejecutando tests con cobertura..."
	yarn test:cov

test-e2e:
	@echo "🧪 Ejecutando tests end-to-end..."
	yarn test:e2e

# Servicios Docker
services-up:
	@echo "📦 Levantando servicios..."
	docker-compose -f docker-compose.dev.yml up -d

services-down:
	@echo "⏹️ Deteniendo servicios..."
	docker-compose -f docker-compose.dev.yml down

services-logs:
	@echo "📋 Mostrando logs de servicios..."
	docker-compose -f docker-compose.dev.yml logs -f

# Base de datos
create-databases:
	@echo "🗃️ Creando bases de datos adicionales..."
	@echo "Creando dinkit_db..."
	@docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_db;" 2>/dev/null || echo "dinkit_db ya existe"
	@echo "Creando dinkit_dev_db..."
	@docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;" 2>/dev/null || echo "dinkit_dev_db ya existe"
	@echo "Creando dinkit_test_db..."
	@docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_test_db;" 2>/dev/null || echo "dinkit_test_db ya existe"
	@echo "✅ Bases de datos creadas"

migrations:
	@echo "💾 Ejecutando migraciones..."
	yarn migrations

migrations-generate:
	@echo "💾 Generando nueva migración..."
	@read -p "Nombre de la migración: " name; \
	yarn migrations:generate $$name

seeds:
	@echo "🌱 Ejecutando seeders..."
	yarn seeds

db-reset:
	@echo "💾 Reiniciando base de datos..."
	yarn typeorm:drop
	yarn migrations
	yarn seeds

# Utilidades
lint:
	@echo "🔍 Ejecutando linter..."
	yarn lint

format:
	@echo "✨ Formateando código..."
	yarn format

clean:
	@echo "🧹 Limpiando archivos temporales..."
	rm -rf dist
	rm -rf coverage
	rm -rf node_modules/.cache
	docker system prune -f

# Producción
prod:
	@echo "🚀 Iniciando en modo producción..."
	docker-compose up -d

deploy:
	@echo "🚀 Desplegando a producción..."
	./scripts/production-deploy.sh

# Crear nuevos archivos
migration:
	@read -p "Nombre de la migración: " name; \
	yarn migrations:create $$name

seeder:
	@read -p "Nombre del seeder: " name; \
	touch src/shared/infrastructure/database/seeds/$$name.seed.ts 