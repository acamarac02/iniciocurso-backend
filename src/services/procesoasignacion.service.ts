import ProcesoAsignacion from "../models/ProcesoAsignacion.model";

export const obtenerProcesoActivoPorDepartamento = async (departamentoId: number) => {
    return await ProcesoAsignacion.findOne({
        where: {
            departamento_id: departamentoId,
            en_proceso: true
        },
        order: [['fecha_inicio', 'DESC']]
    });
};

export const esTurnoProfesor = async (profesorId: number, procesoId: number) => {
    const proceso = await ProcesoAsignacion.findByPk(procesoId);

    if (!proceso) return false;
    return proceso.profesor_turno_id === profesorId;
};

export const actualizarTurnoProfesor = async (procesoId: number, nuevoProfesorId: number): Promise<void> => {
    await ProcesoAsignacion.update(
        { profesor_turno_id: nuevoProfesorId },
        { where: { id: procesoId } }
    );
};