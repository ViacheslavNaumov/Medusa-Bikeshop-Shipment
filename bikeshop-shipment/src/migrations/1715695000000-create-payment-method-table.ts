import { MigrationInterface, QueryRunner } from "typeorm"

export class CreatePaymentMethodTable1715695000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "payment_method" (
        "id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "provider" character varying NOT NULL,
        "provider_id" character varying NOT NULL,
        "card_last4" character varying,
        "card_brand" character varying,
        "card_exp_month" character varying,
        "card_exp_year" character varying,
        "is_default" boolean NOT NULL DEFAULT false,
        "user_id" character varying NOT NULL,
        CONSTRAINT "PK_payment_method" PRIMARY KEY ("id")
      )
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_payment_method_user_id" ON "payment_method" ("user_id")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_payment_method_user_id"`)
    await queryRunner.query(`DROP TABLE "payment_method"`)
  }
}