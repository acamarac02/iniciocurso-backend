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
        fields: ['modulo_id', 'curso_id', 'profesor_id']
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
    modulo_id: number;

    @ForeignKey(() => Curso)
    @Column
    curso_id: number;

    @ForeignKey(() => Profesor)
    @Column
    profesor_id: number;

    @ForeignKey(() => ProcesoAsignacion)
    @Column
    proceso_asignacion_id: number;

    @BelongsTo(() => Modulo)
    modulo!: Modulo;

    @BelongsTo(() => Curso)
    curso!: Curso;

    @BelongsTo(() => Profesor)
    profesor!: Profesor;

    @BelongsTo(() => ProcesoAsignacion)
    procesoAsignacion!: ProcesoAsignacion;

}

export default AsignacionModulo