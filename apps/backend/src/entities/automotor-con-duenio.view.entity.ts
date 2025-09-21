import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'vw_automotores_con_dueno' })
export class AutomotorConDuenoView {
  @ViewColumn()
  dominio: string;

  @ViewColumn({ name: 'numero_chasis' })
  numeroChasis: string | null;

  @ViewColumn({ name: 'numero_motor' })
  numeroMotor: string | null;

  @ViewColumn()
  color: string | null;

  @ViewColumn({ name: 'fecha_fabricacion' })
  fechaFabricacion: number;

  @ViewColumn({ name: 'cuit_dueno' })
  cuitDueno: string | null;

  @ViewColumn({ name: 'denominacion_dueno' })
  denominacionDueno: string | null;
}
