# Utilidades Comunes - Shared Module

Este directorio contiene utilidades comunes reutilizables en todo el proyecto dinkit-backend.

## 📦 **DTOs de Respuesta Estándar**

DTOs estandarizados para todas las respuestas de endpoints.

```typescript
import { ResponseDto, InnerResponseDto, ResponseBuilder } from '@shared/utils';

// DTO de respuesta básica
const response: ResponseDto<User> = {
  success: true,
  result: userData,
  message: 'Usuario obtenido exitosamente'
};

// DTO con paginación
const paginatedResponse: ResponseDto<User[]> = {
  success: true,
  result: users,
  message: 'Usuarios obtenidos exitosamente',
  pagination: {
    current: 1,
    pageSize: 10,
    totalPages: 5,
    count: 50
  }
};

// DTO de respuesta envolvente
const innerResponse: InnerResponseDto<User> = {
  status: 200,
  result: {
    success: true,
    result: userData,
    message: 'Usuario obtenido exitosamente'
  }
};

// Usar ResponseBuilder para construcción fácil
@Get(':id')
async findUser(@Param('id') id: string): Promise<ResponseDto<UserResponseDto>> {
  const user = await this.userService.findById(id);
  return ResponseBuilder.success(user, 'Usuario encontrado exitosamente');
}

@Get()
async findAllUsers(
  @Query() query: PaginationQuery
): Promise<ResponseDto<UserResponseDto[]>> {
  const { users, total } = await this.userService.findAll(query);
  const pagination = Paginated.create({
    page: query.page || 1,
    size: query.size || 10,
    count: total
  });

  return ResponseBuilder.successWithPagination(
    users,
    pagination,
    'Usuarios obtenidos exitosamente'
  );
}
```

## 📁 Estructura de Utilidades

### 🚨 **error.util.ts**

Manejo de errores centralizado con logging automático.

```typescript
import { handleError, createError, logInfo } from '@shared/utils';

// Manejo de errores en controladores
try {
  // ... código
} catch (error) {
  const { status, result } = handleError(
    error,
    this.logger,
    'Error personalizado',
  );
  return res.status(status).json(result);
}

// Crear errores personalizados
throw createError(404, 'Usuario no encontrado');

// Logging de información
logInfo('Operación completada', { userId: 123 });
```

### 📝 **logger.util.ts**

Utilidades para logging mejorado.

```typescript
import { logger, getLogLevels, logWithContext } from '@shared/utils';

// Crear logger
const myLogger = logger('MyService');

// Log con contexto
logWithContext('UserService', 'Usuario creado exitosamente', 'log');

// Configurar niveles según ambiente
const levels = getLogLevels(process.env.NODE_ENV === 'production');
```

### 📄 **paginated.util.ts**

Paginación estandarizada para APIs.

```typescript
import { Paginated, buildPaginatedResponse } from '@shared/utils';

// En tu servicio
async findAll(page: number, size: number) {
  const offset = Paginated.getOffset(page, size);
  const [data, count] = await this.repository.findAndCount({
    skip: offset,
    take: size
  });

  return buildPaginatedResponse(data, count, page, size);
}
```

### 🗄️ **entities.util.ts**

Generadores de WHERE clauses para TypeORM.

```typescript
import { genSimpleWhere, buildSearchConditions } from '@shared/utils';

// Búsqueda simple
const where = genSimpleWhere('juan', 'name,email');

// Búsqueda con relaciones
const whereAdvanced = genAdvancedWhere('producto', 'name,category.name');

// Construcción automática de condiciones
const conditions = buildSearchConditions(searchTerm, 'name,description', {
  active: true,
});
```

### 🔤 **text.util.ts**

Utilidades de manipulación de texto.

```typescript
import {
  generateSlug,
  formatNIT,
  formatDUI,
  isValidEmail,
  capitalizeWords,
  maskEmail,
} from '@shared/utils';

// Generar slugs
const slug = generateSlug('Mi Título Especial'); // "mi-titulo-especial"

// Formatear documentos salvadoreños
const nit = formatNIT('12345678901234'); // "1234-567890-123-4"
const dui = formatDUI('123456789'); // "12345678-9"

// Validaciones
const isEmail = isValidEmail('test@example.com'); // true

// Formateo
const title = capitalizeWords('hola mundo'); // "Hola Mundo"
const masked = maskEmail('usuario@ejemplo.com'); // "u*****o@ejemplo.com"
```

### 📅 **date.util.ts**

Utilidades de fechas con timezone de El Salvador.

```typescript
import {
  svdate,
  parseDateOrTime,
  addDays,
  isDateBefore,
  getStartOfDay,
} from '@shared/utils';

// Fecha en timezone de El Salvador
const salvadorDate = svdate();

// Formateo
const formatted = parseDateOrTime(new Date(), 'datetime'); // "27-11-2023 14:30:00"

// Operaciones
const futureDate = addDays(new Date(), 7);
const startDay = getStartOfDay(new Date());
```

### 💰 **currency.util.ts**

Cálculos monetarios precisos.

```typescript
import { calculate, formatCurrency, calculateDiscount } from '@shared/utils';

// Operaciones precisas
const total = calculate.add(19.99, 5.01); // 25.00
const tax = calculate.multiply(100, 0.13); // 13.00

// Formateo
const formatted = formatCurrency(1234.56); // "$1,234.56"

// Cálculos comerciales
const discountedPrice = calculateDiscount(100, 15); // 85.00
```

### 🔧 **object.util.ts**

Utilidades para manipulación de objetos y arrays.

```typescript
import {
  groupBy,
  sortBy,
  removeDuplicates,
  pickProperties,
  deepClone,
} from '@shared/utils';

// Agrupar por propiedad
const grouped = groupBy(users, 'role');

// Ordenar
const sorted = sortBy(products, 'price', 'desc');

// Remover duplicados
const unique = removeDuplicates(array);

// Manipular objetos
const subset = pickProperties(user, ['name', 'email']);
const cloned = deepClone(complexObject);
```

### 📋 **audit.util.ts**

Utilidades para auditoría.

```typescript
import { genAuditField, createAuditString } from '@shared/utils';

// Generar campo de auditoría
const auditInfo = genAuditField({
  id: 'user123',
  name: 'Juan',
  surname: 'Pérez',
  role: 'admin',
});

// Crear string de auditoría
const auditString = createAuditString('user123', 'Juan Pérez', 'CREATE_USER');
```

### 📁 **file.util.ts**

Utilidades para manejo de archivos.

```typescript
import {
  generateUniqueFilename,
  getFileExtension,
  formatFileSize,
  isImageFile,
} from '@shared/utils';

// Generar nombre único
const filename = generateUniqueFilename('mi-archivo.pdf');

// Información de archivo
const extension = getFileExtension('documento.pdf'); // "pdf"
const size = formatFileSize(1048576); // "1 MB"
const isImage = isImageFile('foto.jpg'); // true
```

### ⚡ **promise.util.ts**

Utilidades para manejo de promesas.

```typescript
import { wait, retry, timeout, mapAsync } from '@shared/utils';

// Delay
await wait(1000); // Esperar 1 segundo

// Reintentos automáticos
const result = await retry(() => apiCall(), 3, 1000);

// Timeout
const data = await timeout(slowOperation(), 5000);

// Procesamiento asíncrono con concurrencia
const results = await mapAsync(items, processItem, 3);
```

## 🌟 **Características Principales**

- ✅ **TypeScript completo** con tipos estrictos
- ✅ **Documentación JSDoc** en todas las funciones
- ✅ **Manejo de errores** robusto
- ✅ **Logging automático** con Logtail
- ✅ **Timezone El Salvador** configurado
- ✅ **Validaciones específicas** para El Salvador (DUI, NIT)
- ✅ **Paginación estandarizada**
- ✅ **Cálculos monetarios precisos**

## 📦 **Uso General**

```typescript
// Importar utilidades específicas
import { handleError, generateSlug } from '@shared/utils';

// O importar todas
import * as Utils from '@shared/utils';
```

## 🔧 **Configuración Requerida**

Asegúrate de tener estas variables de entorno:

```env
LOGTAIL_KEY=tu_clave_logtail
NODE_ENV=development|production
```

## 📖 **Ejemplos de Uso en Servicios**

```typescript
// user.service.ts
import {
  handleError,
  buildPaginatedResponse,
  genAuditField,
} from '@shared/utils';

@Injectable()
export class UserService {
  async findAll(page: number, size: number, search?: string) {
    try {
      const where = search ? genSimpleWhere(search, 'name,email') : {};
      const [users, count] = await this.userRepository.findAndCount({
        where,
        skip: Paginated.getOffset(page, size),
        take: size,
      });

      return buildPaginatedResponse(users, count, page, size);
    } catch (error) {
      const { status, result } = handleError(error, this.logger);
      throw createError(status, result.message);
    }
  }
}
```

---

## 🎯 **Implementación Completa de DTOs de Respuesta Estándar**

### Estructura de Respuestas Estandarizada

Se han implementado DTOs de respuesta estándar para asegurar consistencia en todos los endpoints del proyecto:

#### 📋 **Archivos Creados:**

- `src/shared/dtos/response.dto.ts` - DTOs de respuesta estándar
- `src/shared/dtos/index.ts` - Exportaciones de DTOs
- Integración en `src/shared/utils/index.ts`

#### 🏗️ **Estructura de Respuestas:**

```typescript
// Respuesta básica
interface ResponseDto<T> {
  success: boolean;
  result?: T;
  message: string;
  pagination?: PaginatedDto; // Solo para respuestas con paginación
}

// Respuesta envolvente
interface InnerResponseDto<T> {
  status: number;
  result: ResponseDto<T>;
}
```

#### ⚡ **Uso con ResponseBuilder:**

```typescript
// Respuesta exitosa simple
return ResponseBuilder.success(data, 'Operación exitosa');

// Respuesta exitosa con paginación
return ResponseBuilder.successWithPagination(
  data,
  pagination,
  'Datos obtenidos',
);

// Respuesta de error
return ResponseBuilder.error('Error personalizado');

// Respuestas envolventes
return ResponseBuilder.innerSuccess(data, 200, 'Operación exitosa');
```

#### 📝 **Ejemplo de Implementación en Controlador:**

```typescript
@Controller('users')
export class UserController {
  @Get()
  async findAll(
    @Query() query: PaginationQuery,
  ): Promise<ResponseDto<UserResponseDto[]>> {
    const { users, total } = await this.userService.findAll(query);
    const pagination = Paginated.create({
      page: query.page || 1,
      size: query.size || 10,
      count: total,
    });

    return ResponseBuilder.successWithPagination(
      users,
      pagination,
      'Usuarios obtenidos exitosamente',
    );
  }

  @Post()
  async create(
    @Body() dto: CreateUserDto,
  ): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.userService.create(dto);
    return ResponseBuilder.success(user, 'Usuario creado exitosamente');
  }
}
```

#### 🔧 **Integración con Swagger:**

```typescript
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Usuarios obtenidos exitosamente',
  type: ResponseDto<UserResponseDto[]>,
})
```

#### 📦 **Importación:**

```typescript
import {
  ResponseDto,
  InnerResponseDto,
  ResponseBuilder,
  PaginationQuery,
  Paginated,
} from '@shared/utils';
```

### ✅ **Beneficios de la Implementación:**

1. **Consistencia**: Todas las respuestas siguen el mismo formato
2. **Tipado**: TypeScript garantiza el tipo de datos en respuestas
3. **Facilidad**: `ResponseBuilder` simplifica la construcción de respuestas
4. **Paginación**: Integración automática con el sistema de paginación
5. **Swagger**: Documentación automática de la estructura de respuesta
6. **Mantenibilidad**: Cambios centralizados en la estructura de respuesta

### 🔄 **Migración de Controladores Existentes:**

Para migrar controladores existentes:

1. Importar los DTOs de respuesta: `import { ResponseDto, ResponseBuilder } from '@shared/utils'`
2. Cambiar tipos de retorno: `Promise<ResponseDto<TuDataDto>>`
3. Usar `ResponseBuilder` para construir respuestas
4. Actualizar decoradores `@ApiResponse` con los nuevos tipos
