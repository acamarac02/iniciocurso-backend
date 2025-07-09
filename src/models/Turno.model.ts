import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType } from "sequelize-typescript";

@Table({tableName: 'turno', timestamps: false})
class Turno extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING(50))
    nombre: string

}

export default Turno