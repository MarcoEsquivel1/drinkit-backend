import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Dinkit Backend API')
    .setDescription(
      'API completa para el sistema Dinkit siguiendo arquitectura DDD',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresar JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('admnpomtkn', {
      type: 'apiKey',
      in: 'cookie',
      name: 'admnpomtkn',
      description: 'Cookie de autenticación de administrador',
    })
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Key para acceso directo',
      },
      'api-key',
    )
    .addTag('Authentication', 'Endpoints de autenticación y autorización')
    .addTag('Users', 'Gestión de usuarios del sistema')
    .addTag('Products', 'Gestión del catálogo de productos')
    .addTag('Categories', 'Gestión de categorías y subcategorías')
    .addTag('Orders', 'Gestión de pedidos y órdenes')
    .addTag('Cart', 'Gestión del carrito de compras')
    .addTag('Promotions', 'Gestión de promociones y cupones')
    .addTag('Location', 'Gestión geográfica (países, estados, ciudades)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      syntaxHighlight: {
        theme: 'arta',
      },
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Aplicación ejecutándose en: http://localhost:${port}`);
  console.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
}
bootstrap();
