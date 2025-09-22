import { MigrationInterface, QueryRunner } from 'typeorm';

export class ViewAutomotorConDueno1758394000000 implements MigrationInterface {
  name = 'ViewAutomotoresConDueno1758394000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
CREATE OR REPLACE VIEW vw_automotores_con_dueno AS
SELECT
  a.atr_dominio         AS dominio,
  a.atr_numero_chasis   AS numero_chasis,
  a.atr_numero_motor    AS numero_motor,
  a.atr_color           AS color,
  a.atr_fecha_fabricacion AS fecha_fabricacion,
  s.spo_cuit            AS cuit_dueno,
  s.spo_denominacion    AS denominacion_dueno
FROM "Automotores" a
JOIN "Objeto_De_Valor" o ON o.ovp_id = a.atr_ovp_id
LEFT JOIN "Vinculo_Sujeto_Objeto" v
  ON v.vso_ovp_id = o.ovp_id AND v.vso_responsable = 'S' AND v.vso_fecha_fin IS NULL
LEFT JOIN "Sujeto" s ON s.spo_id = v.vso_spo_id
ORDER BY a.atr_dominio;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP VIEW IF EXISTS vw_automotores_con_dueno');
  }
}
