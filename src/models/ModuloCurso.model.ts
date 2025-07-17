import { Table, Model, ForeignKey, Column, PrimaryKey } from "sequelize-typescript";
import Modulo from "./Modulo.model";
import Curso from "./Curso.model";


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

}

export default ModuloCurso