import 'reflect-metadata';
import 'dotenv/config';
import dataSource from './shared/infrastructure/config/typeorm.config';

async function runMigrations() {
  try {
    console.log('🔗 Conectando a la base de datos...');
    await dataSource.initialize();
    console.log('✅ Conexión establecida');

    console.log('📦 Ejecutando migraciones...');
    const migrations = await dataSource.runMigrations();

    if (migrations.length === 0) {
      console.log('ℹ️  No hay migraciones pendientes');
    } else {
      console.log(`✅ Se ejecutaron ${migrations.length} migraciones:`);
      migrations.forEach((migration) => {
        console.log(`  - ${migration.name}`);
      });
    }

    await dataSource.destroy();
    console.log('🎉 Migraciones completadas exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    process.exit(1);
  }
}

runMigrations();
