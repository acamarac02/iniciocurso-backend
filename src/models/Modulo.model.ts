import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, BelongsToMany, HasMany } from "sequelize-typescript";
import Curso from "./Curso.model";
import ModuloCurso from "./ModuloCurso.model";
import Especialidad from "./Especialidad.model";
import ModuloEspecialidad from "./ModuloEspecialidad.model";
import AsignacionModulo from "./AsignacionModulo.model";

@Table({
    tableName: 'modulo',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['nombre', 'siglas', 'horas']
      }
    ]
})
class Modulo extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column({type: DataType.STRING(100), allowNull: false})
    nombre: string

    @Column({type: DataType.STRING(20), allowNull: false})
    siglas: string

    @Column({type: DataType.INTEGER, allowNull: false})
    horas: number

    @BelongsToMany(() => Curso, () => ModuloCurso)
    cursos: Curso[]

    @BelongsToMany(() => Especialidad, () => ModuloEspecialidad)
    especialidades: Especialidad[]

    @HasMany(() => AsignacionModulo)
    asignaciones!: AsignacionModulo[];

}

export default Modulo