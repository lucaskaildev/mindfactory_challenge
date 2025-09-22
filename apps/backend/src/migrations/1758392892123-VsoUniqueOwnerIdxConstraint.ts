import { MigrationInterface, QueryRunner } from 'typeorm';

export class VsoUniqueOwnerIdxConstraint1758392892123
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // create partial unique index to enforce only one active owner per automotor
    // this ensures business rule: only one responsible owner (vso_responsable = 'S')
    // can be active (vso_fecha_fin IS NULL) as owner (vso_tipo_vinculo = 'DUENO') per object
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_vso_owner_actual 
      ON "Vinculo_Sujeto_Objeto"(vso_ovp_id)
      WHERE vso_responsable = 'S' AND vso_fecha_fin IS NULL AND vso_tipo_vinculo = 'DUENO'
    `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS uq_vso_owner_actual`);
  }
}
