import Rol from "../models/Rol.model";


export const obtenerRolesPorNombre = async (nombre: string[]) => {
    return Rol.findAll({ where: { nombre } });
};