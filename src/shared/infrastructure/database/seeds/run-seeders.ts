import typeOrmConfig from '../../config/typeorm.config';

import RolesSeeder from './01-roles.seed';
import CountriesSeeder from './02-countries.seed';
import StatesSeeder from './03-states.seed';
import CitiesSeeder from './04-cities.seed';
import AdminsSeeder from './05-admins.seed';

async function runSeeders() {
  const dataSource = typeOrmConfig;

  try {
    console.log('Inicializando conexión a la base de datos...');
    await dataSource.initialize();
    console.log('Conexión establecida');

    const seeders = [
      new RolesSeeder(),
      new CountriesSeeder(),
      new StatesSeeder(),
      new CitiesSeeder(),
      new AdminsSeeder(),
    ];

    for (const seeder of seeders) {
      const seederName = seeder.constructor.name;
      console.log(`Ejecutando ${seederName}...`);

      try {
        await seeder.run(dataSource);
        console.log(`✅ ${seederName} completado`);
      } catch (error) {
        console.error(
          `❌ Error en ${seederName}:`,
          error instanceof Error ? error.message : String(error),
        );
        throw error;
      }
    }

    console.log('🎉 Todos los seeders ejecutados exitosamente');
  } catch (error) {
    console.error('💥 Error ejecutando seeders:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('Conexión cerrada');
  }
}

if (require.main === module) {
  runSeeders().catch((error) => {
    console.error('Error ejecutando seeders:', error);
    process.exit(1);
  });
}

export default runSeeders;
