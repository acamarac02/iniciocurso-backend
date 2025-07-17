import { Table, Model, ForeignKey, Column, PrimaryKey } from "sequelize-typescript";
import Modulo from "./Modulo.model";
import Especialidad from "./Especialidad.model";


@Table({
    tableName: 'modulo_especialidad',
    timestamps: false,
  })
class ModuloEspecialidad extends Model {

    @PrimaryKey
    @ForeignKey(() => Modulo)
    @Column
    declare modulo_id: number;

    @PrimaryKey
    @ForeignKey(() => Especialidad)
    @Column
    declare especialidad_id: number;

}

export default ModuloEspecialidad