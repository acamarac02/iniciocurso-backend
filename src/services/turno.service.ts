import Turno from "../models/Turno.model";


export const obtenerTurnoPorNombre = async (nombre: string) => {
    return Turno.findOne({ where: { nombre } });
};