import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1719227976883 implements MigrationInterface {
  name = 'Migrations1719227976883';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "yearAndMonth"`);
    await queryRunner.query(
      `ALTER TABLE "analytics" DROP COLUMN "yearAndMonth"`,
    );
    await queryRunner.query(`ALTER TABLE "report" ADD "year" integer NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "report" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD "month" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" ADD "year" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" ADD "month" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" ADD "status" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "type" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "month"`);
    await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "year"`);
    await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "month"`);
    await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "status"`);
    await queryRunner.query(`ALTER TABLE "report" DROP COLUMN "year"`);
    await queryRunner.query(
      `ALTER TABLE "analytics" ADD "yearAndMonth" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD "yearAndMonth" character varying NOT NULL`,
    );
  }
}
