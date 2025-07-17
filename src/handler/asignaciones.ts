import { Request, Response } from "express";
import { estaAsociadoCurso, obtenerModuloPorId } from "../services/modulo.service";
import { obtenerCursoPorId } from "../services/curso.service";
import { obtenerProfesoresDelDepartamento, obtenerProfesorPorId } from "../services/profesor.service";
import { asignarModuloDB, estaAsignadoModulo, intercambiarAsignacionesEntreProfesores, obtenerHorasAsignadas, obtenerModulosNoAsignados } from "../services/asignacion.service";
import { actualizarTurnoProfesor, esTurnoProfesor, obtenerProcesoActivoPorDepartamento } from "../services/procesoasignacion.service";
import Profesor from "../models/Profesor.model";


/**
 * Método que asigna un módulo siguiendo el método de la rueda
 * @param req debe contener el módulo, curso y profesor que asignar
 * @param res respuesta devuelta
 * @returns 
 */
export const asignarModulo = async (req: Request, res: Response) => {
    try {
        const { moduloId, cursoId, profesorId } = req.body;

        // Validar existencia
        const [modulo, curso, profesor] = await Promise.all([
            obtenerModuloPorId(moduloId),
            obtenerCursoPorId(cursoId),
            obtenerProfesorPorId(profesorId)
        ]);

        if (!modulo || !curso || !profesor) {
            res.status(404).json({ error: "Módulo, curso o profesor no encontrado" });
            return;
        }

        // Verificar si el módulo está asociado a ese curso
        const estaAsociado = await estaAsociadoCurso(moduloId, cursoId);
        if (!estaAsociado) {
            res.status(400).json({ error: "El módulo no está vinculado al curso. No se puede asignar." });
            return;
        }

        // Verificar si el departamento tiene un proceso activo
        const procesoActivo = await obtenerProcesoActivoPorDepartamento(profesor.departamento.id)
        if (!procesoActivo) {
            res.status(400).json({ error: `El departamento ${profesor.departamento.nombre} no tiene un proceso activo` });
            return;
        }

        // Verificar si es el turno del profesor
        const turnoProfesor = await esTurnoProfesor(profesor.id, procesoActivo.id)
        if (!turnoProfesor) {
            res.status(403).json({ error: `No es el turno del profesor.` });
            return;
        }

        // Verificar si ya está asignado
        const yaAsignado = await estaAsignadoModulo(moduloId, cursoId, procesoActivo.id);
        if (yaAsignado) {
            res.status(409).json({ error: "Ese módulo de ese curso ya está asignado a un profesor" });
            return;
        }

        // Verificar si la especialidad del módulo coincide con la especialidad del profesor
        if (!procesoActivo.permitir_otras_especialidades && !modulo.especialidades.some(e => e.id === profesor.especialidad_id)) {
            res.status(403).json({ error: `La especialidad del módulo no coincide con la del profesor` });
            return;

        }

        // Verificar que el profesor no supere las 21H asignadas
        const horasAsignadas = await obtenerHorasAsignadas(profesor.id, procesoActivo.id);
        console.log(horasAsignadas)
        if (horasAsignadas + modulo.horas > 21) {
            res.status(403).json({ error: `No puedes superar las 21 horas asignadas.` });
            return;
        }

        // Asignar
        const asignacion = await asignarModuloDB(moduloId, cursoId, profesorId, procesoActivo.id)

        res.status(201).json({ message: "Módulo asignado con éxito", asignacion });

        // TODO: avanzar el turno al siguiente profesor de ese mismo departamento, es decir, si está el profesor 1, pasar al 2, si está el 2, pasar al 3, etc. Si llego al final, volver al principio. Si se da el caso, habría que validar si todos los profesores superan las 18 horas y todos los modulos están asignados (caso en el que acaba el proceso)
        avanzarTurno(procesoActivo.id, profesor.departamento.id, profesor.id);
    } catch (error) {
        res.status(500).json({ error: "Error en la asignación" });
    }
};

const avanzarTurno = async (procesoId: number, departamentoId: number, profesorPrevioId: number) => {
    // Obtener todos los profesores ordenados
    const profesores = await obtenerProfesoresDelDepartamento(departamentoId);
    console.log(`Profesores del departamento ${departamentoId}:`, profesores.map(p => `${p.nombre_completo} (ID: ${p.id}, Orden: ${p.orden_eleccion})`));

    // Calcular siguiente profesor en turno
    const indexActual = profesores.findIndex(p => p.id === profesorPrevioId);
    let siguienteProfesor: Profesor | null = null;

    for (let i = 1; i <= profesores.length; i++) {
        const idx = (indexActual + i) % profesores.length;
        const prof = profesores[idx];
        const horas = await obtenerHorasAsignadas(prof.id, procesoId);
        console.log(`Profesor: ${prof.nombre_completo}, orden ${prof.orden_eleccion}, Horas asignadas: ${horas}`);
        if (horas < 18) {
            siguienteProfesor = prof;
            break;
        }
    }

    // Verificar si hay módulos no asignados
    //const modulosSinAsignar = await obtenerModulosNoAsignados(procesoId);

    // Si no hay profesor elegible o no hay módulos por asignar, finalizar
    //if (!siguienteProfesor || modulosSinAsignar.length === 0) {
        // TODO Enviar notificación de finalización del proceso
    //} else {
    if (siguienteProfesor != null) await actualizarTurnoProfesor(procesoId, siguienteProfesor.id);
    //}

}

export const intercambiarModulos = async (req: Request, res: Response) => {
    try {
        const { idProfesor1, idAsignacion1, idProfesor2, idAsignacion2 } = req.body;

        await intercambiarAsignacionesEntreProfesores(idProfesor1, idAsignacion1, idProfesor2, idAsignacion2);

        res.json({ message: 'Intercambio realizado correctamente' });
    } catch (error: any) {
        if (error.name === 'IntercambioError') {
            res.status(400).json({ error: error.message });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Error al intercambiar módulos entre profesores' });
        }
    }
};
