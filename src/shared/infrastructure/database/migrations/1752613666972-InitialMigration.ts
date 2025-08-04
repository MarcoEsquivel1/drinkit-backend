import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1752613666972 implements MigrationInterface {
  name = 'InitialMigration1752613666972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "roles" ("rolesId" SERIAL NOT NULL, "name" character varying NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a5d3b265a0b0f523c2b83287c6e" PRIMARY KEY ("rolesId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cities" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "shipping" numeric(8,2) DEFAULT '4', "state_id" integer NOT NULL, CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id")); COMMENT ON COLUMN "cities"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "cities"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "cities"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "cities"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "cities"."id" IS 'ID of the entity.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "states" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "country_id" integer NOT NULL, CONSTRAINT "PK_09ab30ca0975c02656483265f4f" PRIMARY KEY ("id")); COMMENT ON COLUMN "states"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "states"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "states"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "states"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "states"."id" IS 'ID of the entity.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "countries" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "iso2" character varying(2), "iso3" character varying(3), "phone_code" character varying(10), CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id")); COMMENT ON COLUMN "countries"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "countries"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "countries"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "countries"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "countries"."id" IS 'ID of the entity.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "usersAddresses" ("usersAddressesId" SERIAL NOT NULL, "address" text NOT NULL, "apartment" text, "referencePoint" text, "location" text, "label" character varying(255), "fk_usersId" uuid NOT NULL, "fk_citiesId" integer, "fk_statesId" integer, "fk_countriesId" integer, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_addf43bf91c11e77cf94e0e00f6" PRIMARY KEY ("usersAddressesId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usersDevices" ("usersDevicesId" SERIAL NOT NULL, "deviceType" text NOT NULL, "deviceId" text NOT NULL, "firebaseToken" text, "deviceVersion" text, "appVersion" text, "deviceDescription" text, "active" boolean NOT NULL DEFAULT true, "fk_usersId" uuid NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f09ae1cf5e34dc3d2917d1ef884" PRIMARY KEY ("usersDevicesId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usersFavorites" ("usersFavoritesId" SERIAL NOT NULL, "productId" text NOT NULL, "fk_usersId" uuid NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e6cfdcd657b4bad69577c65e662" PRIMARY KEY ("usersFavoritesId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usersInvoices" ("usersInvoicesId" SERIAL NOT NULL, "identifier" text, "name" text, "address" text, "phone" text, "fk_usersId" uuid NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8ec6c56597ddea9106bef9733f0" PRIMARY KEY ("usersInvoicesId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usersRequests" ("usersRequestsId" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "lastName" character varying(255), "email" character varying(255), "phone" character varying(255), "identifier" character varying(255), "address" text, "approved" boolean NOT NULL DEFAULT false, "observations" text, "fk_usersId" uuid, "fk_citiesId" integer, "fk_statesId" integer, "fk_countriesId" integer, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_25189ebceb236944eae4ac7a0b4" PRIMARY KEY ("usersRequestsId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usersTransactions" ("usersTransactionsId" SERIAL NOT NULL, "transaction" text, "amount" numeric(10,2) NOT NULL, "description" text, "referenceNumber" text, "transactionStatus" text, "paymentMethod" text, "transactionDate" TIMESTAMP, "currency" text, "fk_usersId" uuid NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_08fda146c380e72df84b4c1f344" PRIMARY KEY ("usersTransactionsId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('M', 'F', 'O')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "phone" character varying, "photo" character varying, "gender" "public"."users_gender_enum" NOT NULL DEFAULT 'O', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP WITH TIME ZONE, "deleted_by" character varying, "birthdate" TIMESTAMP WITH TIME ZONE, "facebook_id" character varying, "google_id" character varying, "apple_id" character varying, "fk_role_id" integer NOT NULL DEFAULT '3', "is_logged_in" boolean NOT NULL DEFAULT false, "verify" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."id" IS 'Id of the entity.'; COMMENT ON COLUMN "users"."email" IS 'email of the user'; COMMENT ON COLUMN "users"."password" IS 'password of the user'; COMMENT ON COLUMN "users"."name" IS 'name of the user'; COMMENT ON COLUMN "users"."enabled" IS 'Flag indicating if the user is active'; COMMENT ON COLUMN "users"."phone" IS 'phone of the user'; COMMENT ON COLUMN "users"."photo" IS 'photo of the user'; COMMENT ON COLUMN "users"."gender" IS 'gender of the user'; COMMENT ON COLUMN "users"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "users"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "users"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "users"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "users"."deleted_at" IS 'Date of deletion.'; COMMENT ON COLUMN "users"."deleted_by" IS 'Info of the deleter.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_devices" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "id" SERIAL NOT NULL, "token" character varying, "uuid" character varying, "fk_admin_id" uuid NOT NULL, CONSTRAINT "PK_06aac5b080d571b92a5c4b4d266" PRIMARY KEY ("id")); COMMENT ON COLUMN "admin_devices"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "admin_devices"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "admin_devices"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "admin_devices"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "admin_devices"."id" IS 'ID of the entity.'; COMMENT ON COLUMN "admin_devices"."token" IS 'Push token of the device'; COMMENT ON COLUMN "admin_devices"."uuid" IS 'UUID of the device'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."admins_gender_enum" AS ENUM('M', 'F', 'O')`,
    );
    await queryRunner.query(
      `CREATE TABLE "admins" ("email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT true, "phone" character varying, "photo" character varying, "gender" "public"."admins_gender_enum" NOT NULL DEFAULT 'O', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_by" character varying, "fk_role_id" integer NOT NULL DEFAULT '2', "reset_token" character varying, "reset_expires" TIMESTAMP WITH TIME ZONE, "is_logged_in" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id")); COMMENT ON COLUMN "admins"."email" IS 'email of the user'; COMMENT ON COLUMN "admins"."password" IS 'password of the user'; COMMENT ON COLUMN "admins"."name" IS 'name of the user'; COMMENT ON COLUMN "admins"."surname" IS 'surname of the user'; COMMENT ON COLUMN "admins"."enabled" IS 'Flag indicating if the user is active'; COMMENT ON COLUMN "admins"."phone" IS 'phone of the user'; COMMENT ON COLUMN "admins"."photo" IS 'photo of the user'; COMMENT ON COLUMN "admins"."gender" IS 'gender of the user'; COMMENT ON COLUMN "admins"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "admins"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "admins"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "admins"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "admins"."deleted_at" IS 'Date of deletion.'; COMMENT ON COLUMN "admins"."id" IS 'Id of the entity.'; COMMENT ON COLUMN "admins"."deleted_by" IS 'Info of the deleter.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "offers" ("offersId" SERIAL NOT NULL, "title" character varying NOT NULL, "subtitle" character varying, "banner" text, "thumbnail" text, "url" text, "startline" TIMESTAMP NOT NULL, "deadline" TIMESTAMP NOT NULL, "active" boolean NOT NULL DEFAULT true, "freeDelivery" boolean NOT NULL DEFAULT false, "isFlashOffer" boolean NOT NULL DEFAULT false, "products" json NOT NULL DEFAULT '{}', "categories" json NOT NULL DEFAULT '{}', "subcategories" json NOT NULL DEFAULT '{}', "createdBy" integer NOT NULL, "updatedBy" integer, "kit" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1c91c10ec7a4ad31985c525c217" PRIMARY KEY ("offersId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "couponsUsages" ("couponsUsagesId" SERIAL NOT NULL, "fk_couponsId" integer NOT NULL, "fk_usersId" uuid NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer, "alreadyUsed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a6f0f9f78300f13aca9a5fb8cee" PRIMARY KEY ("couponsUsagesId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coupons_type_enum" AS ENUM('TOTAL', 'PERCENTAGE', 'PRODUCT', 'SHIPPING')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."coupons_paymentmethod_enum" AS ENUM('BOTH', 'CARD', 'CASH', 'CREDIT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "coupons" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "deleted_by" character varying, "code" character varying(50) NOT NULL, "type" "public"."coupons_type_enum" NOT NULL DEFAULT 'TOTAL', "paymentMethod" "public"."coupons_paymentmethod_enum" NOT NULL DEFAULT 'BOTH', "value" numeric(10,2) NOT NULL, "min_cost" numeric(10,2) NOT NULL DEFAULT '0', "remaining_uses" integer NOT NULL DEFAULT '-1', "active" boolean NOT NULL DEFAULT false, "start_date" TIMESTAMP WITH TIME ZONE, "end_date" TIMESTAMP WITH TIME ZONE, "uses_per_user" integer NOT NULL DEFAULT '-1', "only_first_order" boolean NOT NULL DEFAULT false, "max_discount" numeric(10,2) NOT NULL DEFAULT '0', "max_quantity" integer NOT NULL DEFAULT '0', "categories" integer array DEFAULT '{}', "subcategories" integer array DEFAULT '{}', "products" integer array NOT NULL DEFAULT '{}', "users" uuid array DEFAULT '{}', "rules" json NOT NULL DEFAULT '[]', CONSTRAINT "UQ_e025109230e82925843f2a14c48" UNIQUE ("code"), CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY ("id")); COMMENT ON COLUMN "coupons"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "coupons"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "coupons"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "coupons"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "coupons"."deleted_at" IS 'Date of deletion.'; COMMENT ON COLUMN "coupons"."id" IS 'ID of the entity.'; COMMENT ON COLUMN "coupons"."deleted_by" IS 'Info of the deleter.'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."banners_type_enum" AS ENUM('HOME', 'CATEGORY', 'PRODUCT', 'PROMOTIONAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "banners" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "deleted_by" character varying, "image" text NOT NULL, "active" boolean NOT NULL DEFAULT false, "url" text, "clicks" integer DEFAULT '0', "title" character varying(255), "subtitle" character varying(255), "cta" character varying(100), "type" "public"."banners_type_enum" NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE, "end_date" TIMESTAMP WITH TIME ZONE, "mobile_url" text, CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY ("id")); COMMENT ON COLUMN "banners"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "banners"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "banners"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "banners"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "banners"."deleted_at" IS 'Date of deletion.'; COMMENT ON COLUMN "banners"."id" IS 'ID of the entity.'; COMMENT ON COLUMN "banners"."deleted_by" IS 'Info of the deleter.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "subCategory" ("subCategoryId" SERIAL NOT NULL, "fk_categoryId" integer NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "imageSubCategory" character varying, "activeSubCategory" boolean NOT NULL DEFAULT true, "deactivatedAt" date, "discount" integer NOT NULL DEFAULT '0', "freeDelivery" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_3fbc16408e8e0e73b743e7f9851" PRIMARY KEY ("subCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "deleted_by" character varying, "name" character varying(255) NOT NULL, "description" text NOT NULL, "image" character varying, "active" boolean NOT NULL DEFAULT true, "deactivated_at" TIMESTAMP WITH TIME ZONE, "discount" integer NOT NULL DEFAULT '0', "freeDelivery" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")); COMMENT ON COLUMN "categories"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "categories"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "categories"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "categories"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "categories"."deleted_at" IS 'Date of deletion.'; COMMENT ON COLUMN "categories"."id" IS 'ID of the entity.'; COMMENT ON COLUMN "categories"."deleted_by" IS 'Info of the deleter.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "deleted_by" character varying, "category_id" integer NOT NULL, "subcategory_id" integer NOT NULL, "sku" character varying(100) NOT NULL, "name" character varying(255) NOT NULL, "description" text NOT NULL, "image" character varying, "regularPrice" numeric(10,2) NOT NULL, "promotionPrice" numeric(10,2), "active" boolean NOT NULL DEFAULT true, "alcoholicGrade" numeric(5,2), "weight" numeric(8,3), "size" numeric(8,3), "brand" character varying(100), "stock" integer DEFAULT '0', "keywords" text array, "deactivated_at" TIMESTAMP WITH TIME ZONE, "discount" integer NOT NULL DEFAULT '0', "freeDelivery" boolean NOT NULL DEFAULT false, "presentation" character varying(50) NOT NULL DEFAULT 'unidad', "business" text array NOT NULL DEFAULT '{00}', "channel" text array NOT NULL DEFAULT '{00}', CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")); COMMENT ON COLUMN "products"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "products"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "products"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "products"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "products"."deleted_at" IS 'Date of deletion.'; COMMENT ON COLUMN "products"."id" IS 'ID of the entity.'; COMMENT ON COLUMN "products"."deleted_by" IS 'Info of the deleter.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "variants" ("variantId" SERIAL NOT NULL, "fk_productId" integer NOT NULL, "sku" character varying NOT NULL, "nameProduct" character varying NOT NULL, "imageProduct" character varying, "regularPrice" double precision NOT NULL, "promotionPrice" double precision, "active" boolean NOT NULL DEFAULT true, "units" integer DEFAULT '0', "weight" double precision, "deactivatedAt" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8ab4b98cbe5170385817f8d787d" PRIMARY KEY ("variantId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ordersHistories" ("ordersHistoriesId" SERIAL NOT NULL, "fk_ordersId" integer NOT NULL, "status" character varying NOT NULL, "observations" text, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96e4acf9e3ab88d9f38cf4e12b1" PRIMARY KEY ("ordersHistoriesId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_orderstatus_enum" AS ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_paymenttype_enum" AS ENUM('CARD', 'CASH', 'PUNTO_XPRESS', 'CREDIT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_paymentstatus_enum" AS ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "id" SERIAL NOT NULL, "reference" character varying NOT NULL, "orderStatus" "public"."orders_orderstatus_enum" NOT NULL, "confirmation" character varying, "paymentType" "public"."orders_paymenttype_enum" NOT NULL, "paymentStatus" "public"."orders_paymentstatus_enum" NOT NULL, "total" numeric(10,2) NOT NULL, "address" text, "apartment" text, "referencePoint" text, "location" text, "city" character varying, "state" character varying, "shipping" numeric(8,2), "note" text, "balance" numeric(10,2) NOT NULL DEFAULT '0', "completed" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, "coupon" character varying, "eta" character varying, "source" character varying NOT NULL DEFAULT 'app', "perception" numeric(10,2) NOT NULL DEFAULT '0', "comment" text, "loyalty" json NOT NULL DEFAULT '[]', CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")); COMMENT ON COLUMN "orders"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "orders"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "orders"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "orders"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "orders"."id" IS 'ID of the entity.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "ordersDetails" ("ordersDetailsId" SERIAL NOT NULL, "name" text NOT NULL, "qty" integer NOT NULL, "image" text NOT NULL, "price" double precision NOT NULL, "fk_categoryId" integer NOT NULL, "category" character varying, "fk_subCategoryId" integer NOT NULL, "subCategory" character varying, "fk_ordersId" integer NOT NULL, "fk_productId" integer NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer, "bonusQty" integer NOT NULL DEFAULT '0', "unityPerBox" integer NOT NULL DEFAULT '0', "discount" double precision NOT NULL DEFAULT '0', "envase" double precision NOT NULL DEFAULT '0', "presentation" text NOT NULL DEFAULT 'unidad', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b7075394b290d7f0108a0206b6" PRIMARY KEY ("ordersDetailsId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "ordersDetailsHistories" ("ordersDetailsHistoriesId" SERIAL NOT NULL, "fk_ordersDetailsId" integer NOT NULL, "fk_purchaseStatusesId" integer NOT NULL, "observations" text, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4a74f1f281b1250aae4c1c4e208" PRIMARY KEY ("ordersDetailsHistoriesId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "purchaseStatuses" ("purchaseStatusesId" SERIAL NOT NULL, "name" character varying NOT NULL, "createdBy" integer NOT NULL, "updatedBy" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_afd0edd890202b1ab33ce279322" PRIMARY KEY ("purchaseStatusesId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_items" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "deleted_by" character varying, "cart_id" integer NOT NULL, "product_id" integer NOT NULL, "quantity" integer NOT NULL, "deactivated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id")); COMMENT ON COLUMN "cart_items"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "cart_items"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "cart_items"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "cart_items"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "cart_items"."deleted_at" IS 'Date of deletion.'; COMMENT ON COLUMN "cart_items"."id" IS 'ID of the entity.'; COMMENT ON COLUMN "cart_items"."deleted_by" IS 'Info of the deleter.'`,
    );
    await queryRunner.query(
      `CREATE TABLE "carts" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_by" character varying NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" character varying, "deleted_at" TIMESTAMP WITH TIME ZONE, "id" SERIAL NOT NULL, "deleted_by" character varying, "user_id" uuid NOT NULL, "deactivated_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id")); COMMENT ON COLUMN "carts"."created_at" IS 'Date of creation.'; COMMENT ON COLUMN "carts"."created_by" IS 'Info of the creator.'; COMMENT ON COLUMN "carts"."updated_at" IS 'Date of last update.'; COMMENT ON COLUMN "carts"."updated_by" IS 'Info of the last updater.'; COMMENT ON COLUMN "carts"."deleted_at" IS 'Date of deletion.'; COMMENT ON COLUMN "carts"."id" IS 'ID of the entity.'; COMMENT ON COLUMN "carts"."deleted_by" IS 'Info of the deleter.'`,
    );
    await queryRunner.query(
      `ALTER TABLE "cities" ADD CONSTRAINT "FK_1229b56aa12cae674b824fccd13" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "states" ADD CONSTRAINT "FK_f3bbd0bc19bb6d8a887add08461" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersAddresses" ADD CONSTRAINT "FK_01a206690de03b760f52e0c7027" FOREIGN KEY ("fk_usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersAddresses" ADD CONSTRAINT "FK_1771679947b4352344f6eda9e42" FOREIGN KEY ("fk_countriesId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersAddresses" ADD CONSTRAINT "FK_a4089471a01a880ca2d4ca16966" FOREIGN KEY ("fk_statesId") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersAddresses" ADD CONSTRAINT "FK_91b48cfe81b1fc6d0b7024036b3" FOREIGN KEY ("fk_citiesId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersDevices" ADD CONSTRAINT "FK_69f72f3042851e3b60a56aa1ba7" FOREIGN KEY ("fk_usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersFavorites" ADD CONSTRAINT "FK_a1dfb3c4539722faae2f4e273d0" FOREIGN KEY ("fk_usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersInvoices" ADD CONSTRAINT "FK_2420c49f54cabf80b0253acef16" FOREIGN KEY ("fk_usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRequests" ADD CONSTRAINT "FK_2307cbb22199820ddc74b2cfdd3" FOREIGN KEY ("fk_usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRequests" ADD CONSTRAINT "FK_8bf6e97d4570ef7aa4b7074e7bd" FOREIGN KEY ("fk_countriesId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRequests" ADD CONSTRAINT "FK_3e627011708c59370608aeab5d3" FOREIGN KEY ("fk_statesId") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRequests" ADD CONSTRAINT "FK_78e68f3a476aeaf8d8cf77478ca" FOREIGN KEY ("fk_citiesId") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersTransactions" ADD CONSTRAINT "FK_83969e6b031afb80d027bcbbdf4" FOREIGN KEY ("fk_usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_640e24c7957242966a5b030c0f6" FOREIGN KEY ("fk_role_id") REFERENCES "roles"("rolesId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_devices" ADD CONSTRAINT "FK_74e94b9cc2c16737004bd61c559" FOREIGN KEY ("fk_admin_id") REFERENCES "admins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" ADD CONSTRAINT "FK_9774dab110a372eb82f28e059de" FOREIGN KEY ("fk_role_id") REFERENCES "roles"("rolesId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "couponsUsages" ADD CONSTRAINT "FK_1549edcfa4089f7d5f3e2aa4e00" FOREIGN KEY ("fk_couponsId") REFERENCES "coupons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "couponsUsages" ADD CONSTRAINT "FK_9be162b731045ca8c21f32b3685" FOREIGN KEY ("fk_usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subCategory" ADD CONSTRAINT "FK_aa45721c6c9ef4df92e3cbf4afe" FOREIGN KEY ("fk_categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_c9de3a8edea9269ca774c919b9a" FOREIGN KEY ("subcategory_id") REFERENCES "subCategory"("subCategoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" ADD CONSTRAINT "FK_490d7ef8611ea9aee3f0709e361" FOREIGN KEY ("fk_productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersHistories" ADD CONSTRAINT "FK_cd00a5d74eababcfe3525aba1c8" FOREIGN KEY ("fk_ordersId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD CONSTRAINT "FK_0e08d55e8f547d0983578d3355e" FOREIGN KEY ("fk_ordersId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD CONSTRAINT "FK_ba80cadb70b49530d3b1dc02dad" FOREIGN KEY ("fk_productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD CONSTRAINT "FK_8868c6a5138777b2af4b769bf39" FOREIGN KEY ("fk_categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" ADD CONSTRAINT "FK_63db68a6595d387645cc98d620e" FOREIGN KEY ("fk_subCategoryId") REFERENCES "subCategory"("subCategoryId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetailsHistories" ADD CONSTRAINT "FK_700dc6e1a8850dbc887a1068c5a" FOREIGN KEY ("fk_ordersDetailsId") REFERENCES "ordersDetails"("ordersDetailsId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetailsHistories" ADD CONSTRAINT "FK_ce04f44ed3fd237dbaafe51e43a" FOREIGN KEY ("fk_purchaseStatusesId") REFERENCES "purchaseStatuses"("purchaseStatusesId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "carts" ADD CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "carts" DROP CONSTRAINT "FK_2ec1c94a977b940d85a4f498aea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetailsHistories" DROP CONSTRAINT "FK_ce04f44ed3fd237dbaafe51e43a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetailsHistories" DROP CONSTRAINT "FK_700dc6e1a8850dbc887a1068c5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" DROP CONSTRAINT "FK_63db68a6595d387645cc98d620e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" DROP CONSTRAINT "FK_8868c6a5138777b2af4b769bf39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" DROP CONSTRAINT "FK_ba80cadb70b49530d3b1dc02dad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersDetails" DROP CONSTRAINT "FK_0e08d55e8f547d0983578d3355e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ordersHistories" DROP CONSTRAINT "FK_cd00a5d74eababcfe3525aba1c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "variants" DROP CONSTRAINT "FK_490d7ef8611ea9aee3f0709e361"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_c9de3a8edea9269ca774c919b9a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subCategory" DROP CONSTRAINT "FK_aa45721c6c9ef4df92e3cbf4afe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "couponsUsages" DROP CONSTRAINT "FK_9be162b731045ca8c21f32b3685"`,
    );
    await queryRunner.query(
      `ALTER TABLE "couponsUsages" DROP CONSTRAINT "FK_1549edcfa4089f7d5f3e2aa4e00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admins" DROP CONSTRAINT "FK_9774dab110a372eb82f28e059de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_devices" DROP CONSTRAINT "FK_74e94b9cc2c16737004bd61c559"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_640e24c7957242966a5b030c0f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersTransactions" DROP CONSTRAINT "FK_83969e6b031afb80d027bcbbdf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRequests" DROP CONSTRAINT "FK_78e68f3a476aeaf8d8cf77478ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRequests" DROP CONSTRAINT "FK_3e627011708c59370608aeab5d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRequests" DROP CONSTRAINT "FK_8bf6e97d4570ef7aa4b7074e7bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersRequests" DROP CONSTRAINT "FK_2307cbb22199820ddc74b2cfdd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersInvoices" DROP CONSTRAINT "FK_2420c49f54cabf80b0253acef16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersFavorites" DROP CONSTRAINT "FK_a1dfb3c4539722faae2f4e273d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersDevices" DROP CONSTRAINT "FK_69f72f3042851e3b60a56aa1ba7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersAddresses" DROP CONSTRAINT "FK_91b48cfe81b1fc6d0b7024036b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersAddresses" DROP CONSTRAINT "FK_a4089471a01a880ca2d4ca16966"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersAddresses" DROP CONSTRAINT "FK_1771679947b4352344f6eda9e42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "usersAddresses" DROP CONSTRAINT "FK_01a206690de03b760f52e0c7027"`,
    );
    await queryRunner.query(
      `ALTER TABLE "states" DROP CONSTRAINT "FK_f3bbd0bc19bb6d8a887add08461"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cities" DROP CONSTRAINT "FK_1229b56aa12cae674b824fccd13"`,
    );
    await queryRunner.query(`DROP TABLE "carts"`);
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(`DROP TABLE "purchaseStatuses"`);
    await queryRunner.query(`DROP TABLE "ordersDetailsHistories"`);
    await queryRunner.query(`DROP TABLE "ordersDetails"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_paymentstatus_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_paymenttype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_orderstatus_enum"`);
    await queryRunner.query(`DROP TABLE "ordersHistories"`);
    await queryRunner.query(`DROP TABLE "variants"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "subCategory"`);
    await queryRunner.query(`DROP TABLE "banners"`);
    await queryRunner.query(`DROP TYPE "public"."banners_type_enum"`);
    await queryRunner.query(`DROP TABLE "coupons"`);
    await queryRunner.query(`DROP TYPE "public"."coupons_paymentmethod_enum"`);
    await queryRunner.query(`DROP TYPE "public"."coupons_type_enum"`);
    await queryRunner.query(`DROP TABLE "couponsUsages"`);
    await queryRunner.query(`DROP TABLE "offers"`);
    await queryRunner.query(`DROP TABLE "admins"`);
    await queryRunner.query(`DROP TYPE "public"."admins_gender_enum"`);
    await queryRunner.query(`DROP TABLE "admin_devices"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    await queryRunner.query(`DROP TABLE "usersTransactions"`);
    await queryRunner.query(`DROP TABLE "usersRequests"`);
    await queryRunner.query(`DROP TABLE "usersInvoices"`);
    await queryRunner.query(`DROP TABLE "usersFavorites"`);
    await queryRunner.query(`DROP TABLE "usersDevices"`);
    await queryRunner.query(`DROP TABLE "usersAddresses"`);
    await queryRunner.query(`DROP TABLE "countries"`);
    await queryRunner.query(`DROP TABLE "states"`);
    await queryRunner.query(`DROP TABLE "cities"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
