import Departamento from "../models/Departamento.model";

export const obtenerDepartamentoPorNombre = async (nombre: string) => {
    return Departamento.findOne({ where: { nombre } });
};