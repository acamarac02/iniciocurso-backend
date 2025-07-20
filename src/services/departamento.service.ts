import Departamento from "../models/Departamento.model";

export const obtenerDepartamentoPorId = async (id: number) => {
    return Departamento.findByPk(id);
};