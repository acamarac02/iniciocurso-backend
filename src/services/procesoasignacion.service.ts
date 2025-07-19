import ProcesoAsignacion from "../models/ProcesoAsignacion.model";
import { obtenerAsignacionesCursosModulo } from "./asignacion.service";
import { obtenerModuloPorDepartamentoId, obteneCursosAsociadosModulo } from "./modulo.service";
import { obtenerProfesorConMenorTurno } from "./profesor.service";

export const obtenerProcesoActivoPorDepartamento = async (departamentoId: number) => {
    return await ProcesoAsignacion.findOne({
        where: {
            departamento_id: departamentoId,
            en_proceso: true
        },
        order: [['fecha_inicio', 'DESC']]
    });
};

export const obtenerProcesoActivoYPendientes = async (idDepartamento: number) => {
    // Obtener el proceso activo más reciente
    const proceso = await obtenerProcesoActivoPorDepartamento(idDepartamento)

    if (!proceso) {
        return { proceso: null, modulosPendientes: 0 };
    }

    const modulos = await obtenerModuloPorDepartamentoId(idDepartamento);

    let pendientes = 0;

    for (const modulo of modulos) {
        // Obtener los cursos asociados al módulo
        const cursos = await obteneCursosAsociadosModulo(modulo.id);

        if (cursos.length === 0) continue; // módulo sin cursos = no asignable, no se cuenta

        const cursoIds = cursos.map(c => c.curso_id);
        console.log(`Módulo ${modulo.nombre} tiene cursos: ${cursoIds.join(', ')}`);

        // Buscar asignaciones existentes para esas combinaciones en este proceso
        const asignaciones = await obtenerAsignacionesCursosModulo(cursoIds, modulo.id, proceso.id);
        console.log(`Asignaciones encontradas para el módulo ${modulo.nombre}: ${asignaciones.length}`);

        if (asignaciones.length < cursos.length) {
            pendientes = pendientes + (cursos.length - asignaciones.length); // hay cursos sin asignación para este módulo en este proceso
        }
    }

    return { proceso, modulosPendientes: pendientes };
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

export const finalizarProcesoAsignacion = async (idDepartamento: number): Promise<ProcesoAsignacion> => {
    const proceso = await obtenerProcesoActivoPorDepartamento(idDepartamento);

    if (!proceso) {
        throw new Error('No existe un proceso activo para este departamento');
    }

    await guardarProcesoFinalizado(proceso);

    return proceso;
};

export const guardarProcesoFinalizado = async (proceso: ProcesoAsignacion) => {
    proceso.en_proceso = false;
    proceso.proceso_finalizado = true;
    proceso.fecha_finalizacion = new Date();

    await proceso.save();
}

export const iniciarProcesoAsignacion = async (
    idDepartamento: number,
    permitir_otras_especialidades: boolean,
    modo_asignacion: 'bloque' | 'rueda'
): Promise<ProcesoAsignacion> => {

    // Finalizar proceso anterior (si existe)
    const procesoActivo = await obtenerProcesoActivoPorDepartamento(idDepartamento);

    if (procesoActivo) {
        guardarProcesoFinalizado(procesoActivo);
    }

    // Buscar el profesor con menor orden_eleccion
    const profesorConMenorOrden = await obtenerProfesorConMenorTurno(idDepartamento);

    if (!profesorConMenorOrden) {
        throw new Error('No se encontró ningún profesor en el departamento');
    }

    // Crear nuevo proceso
    const nuevoProceso = await ProcesoAsignacion.create({
        departamento_id: idDepartamento,
        permitir_otras_especialidades,
        modo_asignacion,
        fecha_inicio: new Date(),
        en_proceso: true,
        proceso_finalizado: false,
        profesor_turno_id: profesorConMenorOrden.id
    });

    return nuevoProceso;
};

export const modificarProcesoAsignacion = async (
    departamentoId: number,
    permitir_otras_especialidades: boolean
): Promise<ProcesoAsignacion | null> => {
    const proceso = await obtenerProcesoActivoPorDepartamento(departamentoId);

    if (!proceso) return null;

    proceso.permitir_otras_especialidades = permitir_otras_especialidades;
    await proceso.save();

    return proceso;
};