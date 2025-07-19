import { Op, Sequelize } from "sequelize";
import AsignacionModulo from "../models/AsignacionModulo.model";
import Modulo from "../models/Modulo.model";
import db from "../config/db";
import { obtenerProfesorPorId } from "./profesor.service";
import { obtenerProcesoActivoPorDepartamento } from "./procesoasignacion.service";


export const estaAsignadoModulo = async (moduloId: number, cursoId: number, procesoActivoId: number) => {
    const asignacion = await AsignacionModulo.findOne({
        where: { modulo_id: moduloId, curso_id: cursoId, proceso_asignacion_id: procesoActivoId }
    });
    return !!asignacion;
};

export const obtenerAsignacionesCursosModulo = async (cursoIds: number[], moduloId: number, procesoId: number) => {
    return await AsignacionModulo.findAll({
        where: {
            modulo_id: moduloId,
            curso_id: { [Op.in]: cursoIds },
            proceso_asignacion_id: procesoId
        }
    });
};

export const asignarModuloDB = async (moduloId, cursoId, profesorId, procesoId, transaction = null) => {
    return await AsignacionModulo.create({
        modulo_id: moduloId,
        curso_id: cursoId,
        profesor_id: profesorId,
        proceso_asignacion_id: procesoId
    }, { transaction });
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

export const obtenerModulosNoAsignados = async (procesoId: number) => {
    return Modulo.findAll({
        include: [
            {
                association: Modulo.associations.asignaciones,
                required: false,
                where: { proceso_asignacion_id: procesoId }
            }
        ],
        having: Sequelize.literal('COUNT(asignaciones.id) = 0'),
        group: ['Modulo.id'],
    });
};

class AsignacionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AsignacionError';
    }
}

const verificarAsignacionYProfesor = async (
    idAsignacion: number,
    idProfesor: number,
    transaction: any
) => {
    const asignacion = await AsignacionModulo.findOne({
        where: { id: idAsignacion, profesor_id: idProfesor },
        transaction,
    });
    if (!asignacion) {
        throw new AsignacionError(`La asignación no corresponde al profesor indicado`);
    }
    return asignacion;
};

const verificarProcesoAsignacion = (asignacion1: AsignacionModulo, asignacion2: AsignacionModulo) => {
    if (asignacion1.proceso_asignacion_id !== asignacion2.proceso_asignacion_id) {
        throw new AsignacionError('Las asignaciones no pertenecen al mismo proceso de asignación');
    }
};

const verificarDepartamentos = async (idProfesor1: number, idProfesor2: number) => {
    const profesor1 = await obtenerProfesorPorId(idProfesor1);
    const profesor2 = await obtenerProfesorPorId(idProfesor2);

    if (!profesor1 || !profesor2) {
        throw new AsignacionError('No se pudo encontrar uno o ambos profesores');
    }

    if (profesor1.departamento_id !== profesor2.departamento_id) {
        throw new AsignacionError('Los profesores no pertenecen al mismo departamento');
    }

    return { profesor1, profesor2 };
};

const validarHorasDespuesIntercambio = async (
    asignacion1: AsignacionModulo,
    asignacion2: AsignacionModulo,
    idProfesor1: number,
    idProfesor2: number,
    procesoId: number,
    transaction: any
) => {
    // Obtener horas módulos asignados a cada asignación
    const moduloHoras1 = (await asignacion1.$get('modulo', { transaction }))?.horas ?? 0;
    const moduloHoras2 = (await asignacion2.$get('modulo', { transaction }))?.horas ?? 0;

    // Horas asignadas antes del intercambio
    const horasProfesor1Antes = await obtenerHorasAsignadas(idProfesor1, procesoId);
    const horasProfesor2Antes = await obtenerHorasAsignadas(idProfesor2, procesoId);

    // Horas después del intercambio
    const horasProfesor1Despues = horasProfesor1Antes - moduloHoras1 + moduloHoras2;
    const horasProfesor2Despues = horasProfesor2Antes - moduloHoras2 + moduloHoras1;

    if (horasProfesor1Despues > 21 || horasProfesor2Despues > 21) {
        throw new AsignacionError('El intercambio supera el límite de 21 horas asignadas para alguno de los profesores.');
    }
};

const verificarProcesoActivoDepartamento = async (
    asignacion1: AsignacionModulo,
    asignacion2: AsignacionModulo,
    departamentoId: number
) => {
    const procesoActivo = await obtenerProcesoActivoPorDepartamento(departamentoId);
    if (!procesoActivo) {
        throw new AsignacionError('No existe proceso activo para el departamento de los profesores');
    }

    if (
        asignacion1.proceso_asignacion_id !== procesoActivo.id ||
        asignacion2.proceso_asignacion_id !== procesoActivo.id
    ) {
        throw new AsignacionError('Las asignaciones no pertenecen al proceso activo del departamento');
    }

    return procesoActivo.id;
};


export const intercambiarAsignacionesEntreProfesores = async (
    idProfesor1: number,
    idAsignacion1: number,
    idProfesor2: number,
    idAsignacion2: number
): Promise<void> => {
    await db.transaction(async (transaction) => {
        const asignacion1 = await verificarAsignacionYProfesor(idAsignacion1, idProfesor1, transaction);
        const asignacion2 = await verificarAsignacionYProfesor(idAsignacion2, idProfesor2, transaction);

        verificarProcesoAsignacion(asignacion1, asignacion2);
        const { profesor1, profesor2 } = await verificarDepartamentos(idProfesor1, idProfesor2);

        const procesoId = await verificarProcesoActivoDepartamento(asignacion1, asignacion2, profesor1.departamento_id);

        // Intercambiar en memoria
        asignacion1.profesor_id = idProfesor2;
        asignacion2.profesor_id = idProfesor1;

        await validarHorasDespuesIntercambio(asignacion1, asignacion2, idProfesor1, idProfesor2, procesoId, transaction);

        // Guardar cambios
        await asignacion1.save({ transaction });
        await asignacion2.save({ transaction });
    });
};

export const desasignarModuloDeProfesor = async (
    idProfesor: number,
    idAsignacion: number
): Promise<void> => {
    await db.transaction(async (transaction) => {
        // 1. Buscar la asignación
        const asignacion = await verificarAsignacionYProfesor(idAsignacion, idProfesor, transaction);

        // 2. Obtener el profesor
        const profesor = await obtenerProfesorPorId(idProfesor);

        // 3. Obtener el proceso activo del departamento
        const procesoActivo = await obtenerProcesoActivoPorDepartamento(profesor.departamento_id);
        if (!procesoActivo) {
            throw new AsignacionError('No existe proceso activo para el departamento');
        }

        // 4. Validar que la asignación pertenezca al proceso activo
        if (asignacion.proceso_asignacion_id !== procesoActivo.id) {
            throw new AsignacionError('La asignación no pertenece al proceso activo del departamento');
        }

        // 5. Eliminar la asignación
        await asignacion.destroy({ transaction });
    });
};