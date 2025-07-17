import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript'
import Departamento from './Departamento.model';
import Especialidad from './Especialidad.model';
import ProfesorRol from './ProfesorRol.model';
import Rol from './Rol.model';
import AsignacionModulo from './AsignacionModulo.model';

@Table({tableName: 'profesor', timestamps: false})
class Profesor extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING(150))
    declare nombre_completo: string

    @Column({type: DataType.STRING(100), unique: true})
    declare correo: string

    @Column({type: DataType.INTEGER, allowNull: false, unique: 'unique_departamento_orden'})
    declare orden_eleccion: number

    @ForeignKey(() => Departamento)
    @Column({type: DataType.INTEGER, unique: 'unique_departamento_orden'})
    declare departamento_id: number;

    @BelongsTo(() => Departamento)
    declare departamento: Departamento;

    @ForeignKey(() => Especialidad)
    @Column(DataType.INTEGER)
    declare especialidad_id: number;

    @BelongsTo(() => Especialidad)
    declare especialidad: Especialidad;

    @BelongsToMany(() => Rol, () => ProfesorRol)
    declare roles: Rol[]

    @HasMany(() => AsignacionModulo)
    declare asignaciones: AsignacionModulo[];

}

export default Profesor