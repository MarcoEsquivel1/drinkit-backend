#!/bin/bash

# Dinkit Backend - Script de deployment para producción
# Ejecuta: chmod +x scripts/production-deploy.sh && ./scripts/production-deploy.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Verificar entorno
check_environment() {
    print_step "Verificando entorno de producción..."
    
    if [ "$NODE_ENV" != "production" ]; then
        print_warning "NODE_ENV no está configurado como 'production'"
    fi
    
    if [ ! -f .env ]; then
        print_error "Archivo .env no encontrado. Es requerido para producción."
        exit 1
    fi
    
    # Verificar variables críticas
    source .env
    
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" == "your-super-secret-jwt-key-change-this-in-production-minimum-32-chars" ]; then
        print_error "JWT_SECRET debe ser configurado con un valor seguro en producción"
        exit 1
    fi
    
    if [ -z "$ENCRYPTION_SECRET" ] || [ "$ENCRYPTION_SECRET" == "your-encryption-secret-key-change-this-in-production-minimum-32-chars" ]; then
        print_error "ENCRYPTION_SECRET debe ser configurado con un valor seguro en producción"
        exit 1
    fi
    
    print_info "✅ Verificaciones de entorno completadas"
}

# Crear backup de la base de datos
backup_database() {
    print_step "Creando backup de la base de datos..."
    
    timestamp=$(date +"%Y%m%d_%H%M%S")
    backup_dir="./backups"
    mkdir -p $backup_dir
    
    # Backup PostgreSQL
    docker exec dinkit_pg_prod pg_dump -U $DB_USERNAME $DB_NAME > "$backup_dir/postgres_backup_$timestamp.sql"
    
    # Backup MongoDB
    docker exec dinkit_mongo_prod mongodump --username $MONGO_USERNAME --password $MONGO_PASSWORD --authenticationDatabase admin --db $MONGO_DATABASE --out /tmp/mongo_backup
    docker cp dinkit_mongo_prod:/tmp/mongo_backup "$backup_dir/mongo_backup_$timestamp"
    
    print_info "✅ Backup creado en $backup_dir"
}

# Build de la aplicación
build_application() {
    print_step "Construyendo aplicación..."
    
    # Limpiar build anterior
    rm -rf dist
    
    # Build
    yarn build
    
    print_info "✅ Aplicación construida"
}

# Ejecutar tests
run_tests() {
    print_step "Ejecutando tests..."
    
    yarn test
    yarn test:e2e
    
    print_info "✅ Tests completados"
}

# Deployment con Docker
deploy_with_docker() {
    print_step "Desplegando con Docker..."
    
    # Detener servicios actuales
    docker-compose down
    
    # Limpiar imágenes anteriores
    docker system prune -f
    
    # Construir y levantar servicios
    docker-compose up -d --build
    
    # Esperar a que los servicios estén listos
    print_info "Esperando a que los servicios estén listos..."
    sleep 30
    
    # Verificar estado
    if docker-compose ps | grep -q "Up"; then
        print_info "✅ Servicios desplegados correctamente"
    else
        print_error "❌ Error en el deployment"
        docker-compose ps
        exit 1
    fi
}

# Ejecutar migraciones en producción
run_production_migrations() {
    print_step "Ejecutando migraciones en producción..."
    
    docker exec dinkit_api_prod yarn migrations
    
    print_info "✅ Migraciones ejecutadas"
}

# Healthcheck
verify_deployment() {
    print_step "Verificando deployment..."
    
    # Esperar un poco más para que la aplicación se estabilice
    sleep 10
    
    # Test de conectividad
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health || echo "000")
    
    if [ "$response" == "200" ]; then
        print_info "✅ Aplicación respondiendo correctamente"
    else
        print_error "❌ Aplicación no responde correctamente (HTTP $response)"
        print_info "Verificando logs..."
        docker-compose logs api
        exit 1
    fi
}

# Función principal
main() {
    echo "================================================================"
    echo "🚀 Dinkit Backend - Deployment a Producción"
    echo "================================================================"
    
    # Confirmar deployment
    read -p "🔴 ¿Confirmas el deployment a PRODUCCIÓN? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Deployment cancelado"
        exit 1
    fi
    
    check_environment
    backup_database
    run_tests
    build_application
    deploy_with_docker
    run_production_migrations
    verify_deployment
    
    echo ""
    echo "================================================================"
    print_info "🎉 ¡Deployment completado exitosamente!"
    echo "================================================================"
    echo ""
    print_info "Aplicación desplegada en:"
    echo "  http://localhost:3000"
    echo ""
    print_info "Documentación API:"
    echo "  http://localhost:3000/api/docs"
    echo ""
    print_info "Para ver logs:"
    echo "  docker-compose logs -f api"
    echo ""
    print_info "Para detener:"
    echo "  docker-compose down"
    echo ""
}

# Ejecutar función principal
main "$@" 