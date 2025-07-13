import AsignacionModulo from "../models/AsignacionModulo.model";
import Modulo from "../models/Modulo.model";


export const estaAsignadoModulo = async (moduloId: number, cursoId: number, procesoActivoId: number) => {
    const asignacion = await AsignacionModulo.findOne({
        where: { modulo_id: moduloId, curso_id: cursoId, proceso_asignacion_id: procesoActivoId }
    });
    return !!asignacion;
};

export const asignarModuloDB = async (moduloId: number, cursoId: number, profesorId: number, procesoActivoId: number) => {
    return await AsignacionModulo.create({
        modulo_id: moduloId,
        curso_id: cursoId,
        profesor_id: profesorId,
        proceso_asignacion_id: procesoActivoId
    });
};

/**
 * Devuelve la cantidad total de horas que tiene asignado un profesor
 * @param profesorId ID del profesor
 * @returns número total de horas
 */
export const obtenerHorasAsignadas = async (profesorId: number, procesoAsignacionId: number): Promise<number> => {
    const asignaciones = await AsignacionModulo.findAll({
        where:
        {
            profesor_id: profesorId,
            proceso_asignacion_id: procesoAsignacionId
        },
        include: [Modulo],
    });

    const totalHoras = asignaciones.reduce((suma, asignacion) => {
        const horas = asignacion.modulo?.horas ?? 0;
        return suma + horas;
    }, 0);

    return totalHoras;
};