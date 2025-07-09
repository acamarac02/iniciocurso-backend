import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType } from "sequelize-typescript";

@Table({tableName: 'rol', timestamps: false})
class Rol extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING(50))
    nombre: string

}

export default Rol