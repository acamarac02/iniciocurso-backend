import { Request, Response } from "express";
import { estaAsociadoCurso, obtenerModuloPorId } from "../services/modulo.service";
import { obtenerCursoPorId } from "../services/curso.service";
import { obtenerProfesorPorId } from "../services/profesor.service";
import { asignarModuloDB, estaAsignadoModulo, obtenerHorasAsignadas } from "../services/asignacion.service";
import { esTurnoProfesor, obtenerProcesoActivoPorDepartamento } from "../services/procesoasignacion.service";


/**
 * Método que asigna un módulo siguiendo el método de la rueda
 * @param req debe contener el módulo, curso y profesor que asignar
 * @param res respuesta devuelta
 * @returns 
 */
export const asignarModulo = async (req: Request, res: Response) => {
    try {
        const { moduloId, cursoId, profesorId } = req.body;

        if (!moduloId || !cursoId || !profesorId) {
            res.status(400).json({ error: "moduloId, cursoId y profesorId son requeridos" });
        }

        // Validar existencia
        const [modulo, curso, profesor] = await Promise.all([
            obtenerModuloPorId(moduloId),
            obtenerCursoPorId(cursoId),
            obtenerProfesorPorId(profesorId)
        ]);

        if (!modulo || !curso || !profesor) {
            res.status(404).json({ error: "Módulo, curso o profesor no encontrado" });
        }

        // Verificar si el módulo está asociado a ese curso
        const estaAsociado = await estaAsociadoCurso(moduloId, cursoId);
        if (!estaAsociado) {
            res.status(400).json({error: "El módulo no está vinculado al curso. No se puede asignar."});
        }

        console.log("llego aqui")
        console.log(profesor)
        console.log(profesor.departamento.id)
        // Verificar si el departamento tiene un proceso activo
        const procesoActivo = await obtenerProcesoActivoPorDepartamento(profesor.departamento_id)
        if (!procesoActivo) {
            res.status(400).json({ error: `El departamento ${profesor.departamento.nombre} no tiene un proceso activo` });
        }

        console.log("NO llego aqui")
        // Verificar si es el turno del profesor
        const turnoProfesor = await esTurnoProfesor(profesor.id, procesoActivo.id)
        if (!turnoProfesor) {
            res.status(403).json({ error: `No es el turno del profesor ${profesor.nombre_completo}` });
        }

        // Verificar si ya está asignado
        const yaAsignado = await estaAsignadoModulo(moduloId, cursoId, procesoActivo.id);
        if (yaAsignado) {
            res.status(409).json({ error: "Ese módulo de ese curso ya está asignado a un profesor" });
        }

        // Verificar si la especialidad del módulo coincide con la especialidad del profesor
        if (!procesoActivo.permitir_otras_especialidades && !modulo.especialidades.some(e => e.id === profesor.especialidad_id)) {
            res.status(403).json({ error: `La especialidad del módulo (${modulo.especialidades}) 
                no coincide con la del profesor (${profesor.especialidad})` });
        }

        // Verificar que el profesor no supere las 21H asignadas
        const horasAsignadas = await obtenerHorasAsignadas(profesor.id, procesoActivo.id);
        if (horasAsignadas + modulo.horas > 21) {
            res.status(403).json({ error: `Ya tienes ${horasAsignadas} horas asignadas. No puedes superar las 21 horas.` });
        }
        
        // Asignar
        const asignacion = await asignarModuloDB(moduloId, cursoId, profesorId, procesoActivo.id)

        res.status(201).json({ message: "Módulo asignado con éxito", asignacion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en la asignación" });
    }
};
