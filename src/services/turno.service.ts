import Turno from "../models/Turno.model";


export const obtenerTurnoPorNombre = async (nombre: string) => {
    return Turno.findOne({ where: { nombre } });
};

export const obtenerTurnoPorId = async (id: number) => {
    return Turno.findByPk(id);
};