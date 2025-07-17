import { Table, Model, ForeignKey, Column } from "sequelize-typescript";
import Profesor from "./Profesor.model";
import Rol from "./Rol.model";

@Table({tableName: 'profesor_rol', timestamps: false})
class ProfesorRol extends Model {

    @ForeignKey(() => Profesor)
    @Column
    declare profesor_id: number;

    @ForeignKey(() => Rol)
    @Column
    declare rol_id: number;

}

export default ProfesorRol