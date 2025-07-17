import { Table, Model, PrimaryKey, AutoIncrement, Column, DataType } from "sequelize-typescript";

@Table({tableName: 'departamento', timestamps: false})
class Departamento extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    declare id: number;

    @Column(DataType.STRING(100))
    declare nombre: string

}

export default Departamento