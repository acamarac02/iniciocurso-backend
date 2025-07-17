import Curso from "../models/Curso.model";
import Especialidad from "../models/Especialidad.model";
import Modulo from "../models/Modulo.model";
import ModuloCurso from "../models/ModuloCurso.model";
import ModuloEspecialidad from "../models/ModuloEspecialidad.model";

export const obtenerModuloPorId = async (id: number) => {
    return Modulo.findByPk(id, {
        include: [ { model: Especialidad } ]
    });
};

export const obtenerOInsertarModulo = async (nombre: string, siglas: string, horas: number) => {
    return await Modulo.findOrCreate({
        where: {
            nombre: nombre,
            siglas: siglas,
            horas,
        },
        defaults: {
            nombre: nombre,
            siglas: siglas,
            horas,
        },
    });
};

export const asociarModuloEspecialidad = async (modulo: Modulo, especialidad: Especialidad) => {
    const yaTieneEspecialidad = await ModuloEspecialidad.findOne({
        where: {
            modulo_id: modulo.id,
            especialidad_id: especialidad.id,
        },
    });

    if (!yaTieneEspecialidad) {
        await ModuloEspecialidad.create({
            modulo_id: modulo.id,
            especialidad_id: especialidad.id,
        });
    }
}

export const asociarModuloCurso = async (modulo: Modulo, curso: Curso) => {
    const yaEstaAsignado = await ModuloCurso.findOne({
        where: {
            modulo_id: modulo.id,
            curso_id: curso.id,
        },
    });

    if (!yaEstaAsignado) {
        await ModuloCurso.create({
            modulo_id: modulo.id,
            curso_id: curso.id,
        });
    }
}

export const estaAsociadoCurso = async (moduloId: number, cursoId: number) => {
    // Verificar que el módulo esté asociado al curso
    return await ModuloCurso.findOne({
        where: { modulo_id: moduloId, curso_id: cursoId }
    });
}
