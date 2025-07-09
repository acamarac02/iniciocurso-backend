import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, ForeignKey, BelongsTo, BelongsToMany } from "sequelize-typescript";
import Turno from "./Turno.model";
import Modulo from "./Modulo.model";
import ModuloCurso from "./ModuloCurso.model";

@Table({tableName: 'curso', timestamps: false})
class Curso extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING(150))
    nombre: string

    @Column({type: DataType.STRING(10), unique: true, allowNull: false})
    siglas: string

    @ForeignKey(() => Turno)
    @Column(DataType.INTEGER)
    turno_id: number

    @BelongsTo(() => Turno)
    turno: Turno

    @BelongsToMany(() => Modulo, () => ModuloCurso)
    modulos: Modulo[]

}

export default Curso