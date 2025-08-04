import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanCategoryAndSubcategoryFields1753894466076
  implements MigrationInterface
{
  name = 'CleanCategoryAndSubcategoryFields1753894466076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subCategory" DROP COLUMN "deactivatedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "deactivated_at"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "deactivated_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "subCategory" ADD "deactivatedAt" date`,
    );
  }
}
