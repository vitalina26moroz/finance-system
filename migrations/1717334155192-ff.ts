import { MigrationInterface, QueryRunner } from 'typeorm';

export class Ff1717334155192 implements MigrationInterface {
  name = 'Ff1717334155192';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" RENAME COLUMN "name" TO "category_name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" RENAME COLUMN "category_name" TO "name"`,
    );
  }
}
