import Especialidad from "../models/Especialidad.model";


export const obtenerEspecialidadPorNombre = async (nombre: string) => {
    return Especialidad.findOne({ where: { nombre } });
};