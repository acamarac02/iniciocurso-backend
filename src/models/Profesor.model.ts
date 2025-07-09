import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo, BelongsToMany, HasMany } from 'sequelize-typescript'
import Departamento from './Departamento.model';
import Especialidad from './Especialidad.model';
import ProfesorRol from './ProfesorRol.model';
import Rol from './Rol.model';
import Modulo from './Modulo.model';
import AsignacionModulo from './AsignacionModulo.model';

@Table({tableName: 'profesor', timestamps: false})
class Profesor extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING(150))
    nombre_completo: string

    @Column({type: DataType.STRING(100), unique: true})
    correo: string

    @Column({type: DataType.INTEGER, allowNull: false})
    orden_eleccion: number

    @ForeignKey(() => Departamento)
    @Column(DataType.INTEGER)
    departamento_id: number;

    @BelongsTo(() => Departamento)
    departamento: Departamento;

    @ForeignKey(() => Especialidad)
    @Column(DataType.INTEGER)
    especialidad_id: number;

    @BelongsTo(() => Especialidad)
    especialidad: Especialidad;

    @BelongsToMany(() => Rol, () => ProfesorRol)
    roles: Rol[]

    @HasMany(() => AsignacionModulo)
    asignaciones!: AsignacionModulo[];

}

export default Profesor