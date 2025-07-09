import { Table, Model, ForeignKey, Column } from "sequelize-typescript";
import Profesor from "./Profesor.model";
import Rol from "./Rol.model";

@Table({tableName: 'profesor_rol', timestamps: false})
class ProfesorRol extends Model {

    @ForeignKey(() => Profesor)
    @Column
    profesor_id: number;

    @ForeignKey(() => Rol)
    @Column
    rol_id: number;

}

export default ProfesorRol