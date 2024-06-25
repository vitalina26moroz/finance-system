import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717947733024 implements MigrationInterface {
  name = 'Migrations1717947733024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "report" ("id" SERIAL NOT NULL, "link" character varying NOT NULL, "yearAndMonth" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "analytics" ("id" SERIAL NOT NULL, "link" character varying NOT NULL, "yearAndMonth" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_3c96dcbf1e4c57ea9e0c3144bff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" ADD CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "analytics" ADD CONSTRAINT "FK_a150437ec0be6ce6aaad3f374e9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "analytics" DROP CONSTRAINT "FK_a150437ec0be6ce6aaad3f374e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "report" DROP CONSTRAINT "FK_e347c56b008c2057c9887e230aa"`,
    );
    await queryRunner.query(`DROP TABLE "analytics"`);
    await queryRunner.query(`DROP TABLE "report"`);
  }
}
