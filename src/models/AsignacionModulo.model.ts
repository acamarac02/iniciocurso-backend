import { Table, Model, ForeignKey, Column, PrimaryKey, BelongsTo, AutoIncrement } from "sequelize-typescript";
import Modulo from "./Modulo.model";
import Especialidad from "./Especialidad.model";
import Curso from "./Curso.model";
import Profesor from "./Profesor.model";
import ProcesoAsignacion from "./ProcesoAsignacion.model";


@Table({
    tableName: 'asignacion_modulo',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['modulo_id', 'curso_id', 'proceso_asignacion_id']
      }
    ]
})
class AsignacionModulo extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column
    declare id: number;

    @ForeignKey(() => Modulo)
    @Column
    declare modulo_id: number;

    @ForeignKey(() => Curso)
    @Column
    declare curso_id: number;

    @ForeignKey(() => Profesor)
    @Column
    declare profesor_id: number;

    @ForeignKey(() => ProcesoAsignacion)
    @Column
    declare proceso_asignacion_id: number;

    @BelongsTo(() => Modulo)
    declare modulo: Modulo;

    @BelongsTo(() => Curso)
    declare curso: Curso;

    @BelongsTo(() => Profesor)
    declare profesor: Profesor;

    @BelongsTo(() => ProcesoAsignacion)
    declare procesoAsignacion: ProcesoAsignacion;

}

export default AsignacionModulo