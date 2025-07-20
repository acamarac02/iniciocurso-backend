import { Table, Model, ForeignKey, Column, PrimaryKey, DataType, BelongsTo } from "sequelize-typescript";
import Modulo from "./Modulo.model";
import Curso from "./Curso.model";
import Departamento from "./Departamento.model";


@Table({
    tableName: 'modulo_curso',
    timestamps: false,
  })
class ModuloCurso extends Model {

    @PrimaryKey
    @ForeignKey(() => Modulo)
    @Column
    declare modulo_id: number;

    @PrimaryKey
    @ForeignKey(() => Curso)
    @Column
    declare curso_id: number;

    @ForeignKey(() => Departamento)
    @Column({type: DataType.INTEGER})
    declare departamento_id: number;

    @BelongsTo(() => Departamento)
    declare departamento: Departamento;

}

export default ModuloCurso