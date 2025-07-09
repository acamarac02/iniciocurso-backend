import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType, BelongsToMany } from "sequelize-typescript";
import Modulo from "./Modulo.model";
import ModuloEspecialidad from "./ModuloEspecialidad.model";

@Table({tableName: 'especialidad', timestamps: false})
class Especialidad extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING(100))
    nombre: string

    @BelongsToMany(() => Modulo, () => ModuloEspecialidad)
    modulos: Modulo[]

}

export default Especialidad