import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717663914619 implements MigrationInterface {
  name = 'Migrations1717663914619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "password_hashed" TO "password"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" RENAME COLUMN "desciption" TO "description"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" RENAME COLUMN "description" TO "desciption"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "password" TO "password_hashed"`,
    );
  }
}
