import { MigrationInterface, QueryRunner } from 'typeorm';

export class CoreSchema1758392810203 implements MigrationInterface {
  name = 'CoreSchema1758392810203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Objeto_De_Valor" ("ovp_id" SERIAL NOT NULL, "ovp_tipo" character varying(30) NOT NULL DEFAULT 'AUTOMOTOR', "ovp_codigo" character varying(64) NOT NULL, "ovp_descripcion" character varying(240), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bf72983f69b75848da126fc09b1" UNIQUE ("ovp_codigo"), CONSTRAINT "PK_790bf1c7907e1f978eba8e0e2e1" PRIMARY KEY ("ovp_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Sujeto" ("spo_id" SERIAL NOT NULL, "spo_cuit" character varying(11) NOT NULL, "spo_denominacion" character varying(160) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), CONSTRAINT "UQ_61f7d0937e8853832136948476c" UNIQUE ("spo_cuit"), CONSTRAINT "PK_4445ca1b7c8138f983ab84b7347" PRIMARY KEY ("spo_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Vinculo_Sujeto_Objeto" ("vso_id" SERIAL NOT NULL, "vso_ovp_id" integer NOT NULL, "vso_spo_id" integer NOT NULL, "vso_tipo_vinculo" character varying(30) NOT NULL DEFAULT 'DUENO', "vso_porcentaje" numeric(5,2) NOT NULL DEFAULT '100', "vso_responsable" character varying(1) NOT NULL DEFAULT 'S', "vso_fecha_inicio" TIMESTAMP NOT NULL DEFAULT ('now'::text)::date, "vso_fecha_fin" TIMESTAMP, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), CONSTRAINT "PK_b438b96834cffed8211174680f7" PRIMARY KEY ("vso_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_vso_ovp" ON "Vinculo_Sujeto_Objeto" ("vso_ovp_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_vso_spo" ON "Vinculo_Sujeto_Objeto" ("vso_spo_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "Automotores" ("atr_id" SERIAL NOT NULL, "atr_ovp_id" integer NOT NULL, "atr_dominio" character varying(8) NOT NULL, "atr_numero_chasis" character varying(25), "atr_numero_motor" character varying(25), "atr_color" character varying(40), "atr_fecha_fabricacion" integer NOT NULL, "atr_fecha_alta_registro" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9416d06eac23b9370e2295db2a3" UNIQUE ("atr_dominio"), CONSTRAINT "REL_a0e136641242d668f0146aa5e9" UNIQUE ("atr_ovp_id"), CONSTRAINT "PK_5f67cf3a32e1c05c76a935fb06f" PRIMARY KEY ("atr_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Vinculo_Sujeto_Objeto" ADD CONSTRAINT "FK_6b857d9649cac4d30e114c038b4" FOREIGN KEY ("vso_ovp_id") REFERENCES "Objeto_De_Valor"("ovp_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Vinculo_Sujeto_Objeto" ADD CONSTRAINT "FK_7242848833b1219e1a281c6580f" FOREIGN KEY ("vso_spo_id") REFERENCES "Sujeto"("spo_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Automotores" ADD CONSTRAINT "FK_a0e136641242d668f0146aa5e9e" FOREIGN KEY ("atr_ovp_id") REFERENCES "Objeto_De_Valor"("ovp_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Automotores" DROP CONSTRAINT "FK_a0e136641242d668f0146aa5e9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Vinculo_Sujeto_Objeto" DROP CONSTRAINT "FK_7242848833b1219e1a281c6580f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Vinculo_Sujeto_Objeto" DROP CONSTRAINT "FK_6b857d9649cac4d30e114c038b4"`,
    );
    await queryRunner.query(`DROP TABLE "Automotores"`);
    await queryRunner.query(`DROP INDEX "public"."idx_vso_spo"`);
    await queryRunner.query(`DROP INDEX "public"."idx_vso_ovp"`);
    await queryRunner.query(`DROP TABLE "Vinculo_Sujeto_Objeto"`);
    await queryRunner.query(`DROP TABLE "Sujeto"`);
    await queryRunner.query(`DROP TABLE "Objeto_De_Valor"`);
  }
}
