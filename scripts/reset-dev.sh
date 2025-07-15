#!/bin/bash

# Dinkit Backend - Script para reiniciar el entorno de desarrollo
# Ejecuta: chmod +x scripts/reset-dev.sh && ./scripts/reset-dev.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Confirmar acción
confirm() {
    read -p "⚠️  ¿Estás seguro de que quieres reiniciar el entorno? Esto eliminará todos los datos (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Operación cancelada"
        exit 1
    fi
}

# Detener servicios
stop_services() {
    print_info "Deteniendo servicios..."
    docker-compose -f docker-compose.dev.yml down
    print_info "✅ Servicios detenidos"
}

# Limpiar volúmenes
clean_volumes() {
    print_info "Eliminando volúmenes de Docker..."
    docker-compose -f docker-compose.dev.yml down -v
    print_info "✅ Volúmenes eliminados"
}

# Eliminar imágenes locales
clean_images() {
    print_info "Eliminando imágenes de Docker..."
    if docker images | grep -q "dinkit"; then
        docker images | grep "dinkit" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
    fi
    print_info "✅ Imágenes eliminadas"
}

# Limpiar cache de Yarn
clean_yarn_cache() {
    print_info "Limpiando cache de Yarn..."
    yarn cache clean
    print_info "✅ Cache de Yarn limpiado"
}

# Reinstalar dependencias
reinstall_dependencies() {
    print_info "Reinstalando dependencias..."
    rm -rf node_modules
    yarn install
    print_info "✅ Dependencias reinstaladas"
}

# Reiniciar servicios
restart_services() {
    print_info "Iniciando servicios nuevamente..."
    docker-compose -f docker-compose.dev.yml up -d
    
    # Esperar a que los servicios estén listos
    print_info "Esperando a que los servicios estén listos..."
    sleep 15
    print_info "✅ Servicios iniciados"
}

# Crear bases de datos adicionales
create_databases() {
    print_info "Creando bases de datos adicionales..."
    
    # Esperar un poco más para asegurar que PostgreSQL esté completamente listo
    sleep 5
    
    # Crear bases de datos faltantes
    print_info "Creando dinkit_db..."
    docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_db;" 2>/dev/null || print_warning "dinkit_db ya existe"
    
    print_info "Creando dinkit_dev_db..."
    docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;" 2>/dev/null || print_warning "dinkit_dev_db ya existe"
    
    print_info "Creando dinkit_test_db..."
    docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_test_db;" 2>/dev/null || print_warning "dinkit_test_db ya existe"
    
    print_info "✅ Bases de datos creadas"
}

# Ejecutar migraciones
run_migrations() {
    print_info "Ejecutando migraciones..."
    yarn migrations
    print_info "✅ Migraciones ejecutadas"
}

# Ejecutar seeders
run_seeders() {
    print_info "Ejecutando seeders..."
    yarn seeds
    print_info "✅ Seeders ejecutados"
}

# Función principal
main() {
    echo "================================================================"
    echo "🔄 Dinkit Backend - Reinicio del Entorno de Desarrollo"
    echo "================================================================"
    
    confirm
    
    stop_services
    clean_volumes
    clean_images
    clean_yarn_cache
    reinstall_dependencies
    restart_services
    create_databases
    run_migrations
    run_seeders
    
    echo ""
    echo "================================================================"
    print_info "🎉 ¡Entorno reiniciado completamente!"
    echo "================================================================"
    echo ""
    print_info "Para iniciar la aplicación:"
    echo "  yarn start:dev"
    echo ""
    print_info "Documentación API:"
    echo "  http://localhost:3000/api/docs"
    echo ""
}

# Ejecutar función principal
main "$@" 