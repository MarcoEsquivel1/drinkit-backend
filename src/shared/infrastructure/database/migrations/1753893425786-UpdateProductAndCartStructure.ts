import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductAndCartStructure1753893425786
  implements MigrationInterface
{
  name = 'UpdateProductAndCartStructure1753893425786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subCategory" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "description"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "regularPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "promotionPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "alcoholicGrade"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "weight"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "size"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "stock"`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP COLUMN "deactivated_at"`,
    );
    await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "deactivated_at"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "price" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts" ADD "product_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts" ADD "quantity" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ordersDetails" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD "price" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" DROP COLUMN "discount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD "discount" numeric(5,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "ordersDetails" DROP COLUMN "envase"`);
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD "envase" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" DROP COLUMN "regularPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" ADD "regularPrice" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" DROP COLUMN "promotionPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" ADD "promotionPrice" numeric(10,2)`,
    );
    await queryRunner.query(`ALTER TABLE "variants" DROP COLUMN "weight"`);
    await queryRunner.query(`ALTER TABLE "variants" ADD "weight" numeric(8,3)`);
    await queryRunner.query(
      `ALTER TABLE "carts" ADD CONSTRAINT "FK_7d0e145ebd287c1565f15114a18" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carts" DROP CONSTRAINT "FK_7d0e145ebd287c1565f15114a18"`,
    );
    await queryRunner.query(`ALTER TABLE "variants" DROP COLUMN "weight"`);
    await queryRunner.query(
      `ALTER TABLE "variants" ADD "weight" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" DROP COLUMN "promotionPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" ADD "promotionPrice" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" DROP COLUMN "regularPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" ADD "regularPrice" double precision NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ordersDetails" DROP COLUMN "envase"`);
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD "envase" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" DROP COLUMN "discount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD "discount" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "ordersDetails" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD "price" double precision NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "quantity"`);
    await queryRunner.query(`ALTER TABLE "carts" DROP COLUMN "product_id"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "carts" ADD "deactivated_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "deactivated_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "stock" integer DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "size" numeric(8,3)`);
    await queryRunner.query(`ALTER TABLE "products" ADD "weight" numeric(8,3)`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "alcoholicGrade" numeric(5,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "promotionPrice" numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD "regularPrice" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "description" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "subCategory" ADD "description" text NOT NULL`,
    );
  }
}
