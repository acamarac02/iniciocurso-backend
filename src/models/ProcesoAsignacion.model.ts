import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Departamento from "./Departamento.model";
import Profesor from "./Profesor.model";

@Table({tableName: 'proceso_asignacion', timestamps: false})
class ProcesoAsignacion extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @ForeignKey(() => Departamento)
    @Column(DataType.INTEGER)
    declare departamento_id: number

    @BelongsTo(() => Departamento)
    declare departamento: Departamento

    @Column(DataType.BOOLEAN)
    declare permitir_otras_especialidades: boolean

    @Column(DataType.BOOLEAN)
    declare en_proceso: boolean

    @Column({type: DataType.DATE})
    declare fecha_inicio: Date

    @Column({
        type: DataType.STRING(20), 
        allowNull: false,
        validate: {
            isIn: [["bloque", "rueda"]]
        }
    })
    declare modo_asignacion: string

    @ForeignKey(() => Profesor)
    @Column(DataType.INTEGER)
    declare profesor_turno_id: number

    @BelongsTo(() => Profesor)
    declare profesor_turno: Profesor

    @Column(DataType.BOOLEAN)
    declare proceso_finalizado: boolean

    @Column({type: DataType.DATE})
    declare fecha_finalizacion: Date

}

export default ProcesoAsignacion