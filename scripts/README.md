# 🛠️ Scripts de Dinkit Backend

Este directorio contiene scripts útiles para la configuración y mantenimiento del proyecto.

## 📋 Scripts Disponibles

### `dev-setup.sh` - Configuración Completa de Desarrollo

Configura automáticamente todo el entorno de desarrollo desde cero.

**Incluye:**

- ✅ Verificación de prerrequisitos (Docker, Yarn)
- ✅ Instalación de dependencias
- ✅ Configuración de variables de entorno
- ✅ Inicio de servicios Docker
- ✅ **Creación de bases de datos adicionales (CRÍTICO)**
- ✅ Ejecución de migraciones
- ✅ Ejecución de seeders

### `reset-dev.sh` - Reinicio Completo del Entorno

Reinicia completamente el entorno de desarrollo, eliminando datos y configuraciones.

**Incluye:**

- ⚠️ Confirmación antes de proceder
- 🗑️ Detener y limpiar servicios Docker
- 🗑️ Eliminar volúmenes e imágenes
- 🗑️ Limpiar cache de Yarn
- 🔄 Reinstalar dependencias
- 🔄 Reconfigurar todo desde cero

### `production-deploy.sh` - Deployment a Producción

Script para deployment en entorno de producción.

## 🖥️ Uso por Sistema Operativo

### Linux/macOS (Unix)

```bash
# Hacer ejecutables (primera vez)
chmod +x scripts/*.sh

# Ejecutar configuración completa
./scripts/dev-setup.sh

# Reiniciar entorno
./scripts/reset-dev.sh

# Deployment a producción
./scripts/production-deploy.sh
```

### Windows (PowerShell/CMD)

```bash
# Configuración completa
bash scripts/dev-setup.sh
# O usando Git Bash directamente:
scripts/dev-setup.sh

# Reiniciar entorno
bash scripts/reset-dev.sh

# Deployment a producción
bash scripts/production-deploy.sh
```

### Usando Makefile (Recomendado - Funciona en todos los sistemas)

```bash
# Configuración completa
make setup

# Reiniciar entorno
make reset

# Deployment a producción
make deploy
```

## ⚠️ Nota Importante sobre Bases de Datos

**El problema más común** al configurar el proyecto es el error:

```
FATAL: database "dinkit_dev_db" does not exist
```

**Causa:** PostgreSQL en Docker solo crea la base de datos principal, pero la aplicación necesita bases adicionales para diferentes entornos.

**Solución automática:** Los scripts `dev-setup.sh` y `reset-dev.sh` ahora incluyen la creación automática de:

- `dinkit_db` (producción)
- `dinkit_dev_db` (desarrollo)
- `dinkit_test_db` (testing)

**Solución manual:**

```bash
docker exec dinkit_pg psql -U dinkit_user -d postgres -c "CREATE DATABASE dinkit_dev_db;"
make create-databases  # O usar el comando make
```

## 🔧 Solución de Problemas

### Scripts no ejecutan en Windows

```bash
# Usar bash explícitamente
bash scripts/dev-setup.sh

# O instalar Git Bash/WSL
```

### Error "Permission denied"

```bash
# En Linux/macOS, hacer ejecutables
chmod +x scripts/*.sh
```

### Error "Docker not found"

```bash
# Verificar que Docker esté instalado y ejecutándose
docker --version
docker ps
```

### Base de datos no existe

```bash
# El script dev-setup.sh ahora resuelve esto automáticamente
# O manualmente:
make create-databases
```

## 📚 Documentación Adicional

- Ver `../README.md` para documentación completa del proyecto
- Ver `../Makefile` para comandos disponibles con make
- Variables de entorno en `../environment.example.txt`
