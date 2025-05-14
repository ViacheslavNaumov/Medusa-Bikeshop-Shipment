import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateShipmentTable1715694000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "shipment" (
        "id" character varying NOT NULL,
        "tracking_number" character varying NOT NULL,
        "carrier" character varying NOT NULL,
        "shipping_address" character varying NOT NULL,
        "recipient_name" character varying NOT NULL,
        "recipient_email" character varying NOT NULL,
        "recipient_phone" character varying,
        "status" character varying NOT NULL DEFAULT 'pending',
        "notes" character varying,
        "user_id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_shipment_id" PRIMARY KEY ("id")
      )
    `)

    // We're using a fallback user ID, so we don't need a foreign key constraint
    // await queryRunner.query(`
    //   ALTER TABLE "shipment" ADD CONSTRAINT "FK_shipment_user_id" 
    //   FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    // `)

    // Add index on tracking number for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_shipment_tracking_number" ON "shipment" ("tracking_number")
    `)

    // Add index on user_id for faster lookups
    await queryRunner.query(`
      CREATE INDEX "IDX_shipment_user_id" ON "shipment" ("user_id")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_shipment_user_id"`)
    await queryRunner.query(`DROP INDEX "IDX_shipment_tracking_number"`)
    // await queryRunner.query(`ALTER TABLE "shipment" DROP CONSTRAINT "FK_shipment_user_id"`)
    await queryRunner.query(`DROP TABLE "shipment"`)
  }
}