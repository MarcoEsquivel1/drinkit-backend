#!/bin/bash

# Dinkit Backend - Script de configuración para desarrollo
# Ejecuta: chmod +x scripts/dev-setup.sh && ./scripts/dev-setup.sh

set -e

echo "🚀 Configurando entorno de desarrollo para Dinkit Backend..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes coloreados
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar prerrequisitos
check_requirements() {
    print_info "Verificando prerrequisitos..."
    
    if ! command -v yarn &> /dev/null; then
        print_error "Yarn no está instalado. Por favor instala Yarn antes de continuar."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker no está instalado. Por favor instala Docker antes de continuar."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose no está instalado. Por favor instala Docker Compose antes de continuar."
        exit 1
    fi
    
    print_info "✅ Todos los prerrequisitos están instalados"
}

# Instalar dependencias
install_dependencies() {
    print_info "Instalando dependencias con Yarn..."
    yarn install
    print_info "✅ Dependencias instaladas"
}

# Configurar archivo .env
setup_env() {
    if [ ! -f .env ]; then
        print_info "Copiando archivo de configuración..."
        cp environment.example.txt .env
        print_warning "⚠️  Recuerda configurar las variables en el archivo .env según tus necesidades"
    else
        print_info "Archivo .env ya existe"
    fi
}

# Levantar servicios con Docker
start_services() {
    print_info "Levantando servicios (PostgreSQL, MongoDB, Redis)..."
    docker-compose -f docker-compose.dev.yml up -d
    
    # Esperar a que los servicios estén listos
    print_info "Esperando a que los servicios estén listos..."
    sleep 15
    
    # Verificar estado de los servicios
    if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        print_info "✅ Servicios iniciados correctamente"
    else
        print_error "❌ Error al iniciar algunos servicios"
        docker-compose -f docker-compose.dev.yml ps
        exit 1
    fi
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
    print_info "Ejecutando migraciones de base de datos..."
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
    echo "🛒 Dinkit Backend - Configuración de Desarrollo"
    echo "================================================================"
    
    check_requirements
    install_dependencies
    setup_env
    start_services
    create_databases
    run_migrations
    run_seeders
    
    echo ""
    echo "================================================================"
    print_info "🎉 ¡Configuración completada!"
    echo "================================================================"
    echo ""
    print_info "Para iniciar la aplicación en modo desarrollo:"
    echo "  yarn start:dev"
    echo ""
    print_info "Para ver los logs de los servicios:"
    echo "  docker-compose -f docker-compose.dev.yml logs -f"
    echo ""
    print_info "Para detener los servicios:"
    echo "  docker-compose -f docker-compose.dev.yml down"
    echo ""
    print_info "Documentación API disponible en:"
    echo "  http://localhost:3000/api/docs"
    echo ""
}

# Ejecutar función principal
main "$@" 