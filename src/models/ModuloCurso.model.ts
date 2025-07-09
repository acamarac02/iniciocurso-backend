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
    modulo_id: number;

    @PrimaryKey
    @ForeignKey(() => Curso)
    @Column
    curso_id: number;

}

export default ModuloCurso