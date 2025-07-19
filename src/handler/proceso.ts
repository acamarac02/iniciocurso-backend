import { Request, Response } from 'express';
import { finalizarProcesoAsignacion, obtenerProcesoActivoYPendientes, iniciarProcesoAsignacion, modificarProcesoAsignacion } from '../services/procesoasignacion.service';

export const obtenerProcesoActivoYPendientesHandler = async (req: Request, res: Response) => {
    try {
        const idDepartamento = parseInt(req.params.idDepartamento);
        const resultado = await obtenerProcesoActivoYPendientes(idDepartamento);

        if (!resultado.proceso) {
            res.status(404).json({ error: 'No hay proceso activo para el departamento' });
            return;
        }

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el proceso activo' });
    }
};


export const finalizarProcesoAsignacionHandler = async (req: Request, res: Response) => {
    try {
        const idDepartamento = parseInt(req.params.idDepartamento);

        const proceso = await finalizarProcesoAsignacion(idDepartamento);

        res.status(200).json({
            message: 'Proceso finalizado correctamente',
            procesoFinalizado: proceso
        });

    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message || 'Error al finalizar el proceso' });
    }
};

export const iniciarProcesoAsignacionHandler = async (req: Request, res: Response) => {
    try {
        const idDepartamento = parseInt(req.params.idDepartamento);
        const { permitir_otras_especialidades, modo_asignacion } = req.body;

        const nuevoProceso = await iniciarProcesoAsignacion(
            idDepartamento,
            permitir_otras_especialidades,
            modo_asignacion
        );

        res.status(201).json({
            message: 'Proceso de asignación iniciado correctamente',
            proceso: nuevoProceso
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Error al iniciar proceso' });
    }
};

export const modificarProcesoAsignacionHandler = async (req: Request, res: Response) => {
    try {
        const { idDepartamento } = req.params;
        const { permitir_otras_especialidades } = req.body;

        const proceso = await modificarProcesoAsignacion(Number(idDepartamento), permitir_otras_especialidades);

        if (!proceso) {
            res.status(404).json({ error: 'No hay proceso activo para este departamento' });
            return;
        }

        res.status(200).json({ message: 'Proceso actualizado correctamente', proceso });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al modificar el proceso de asignación' });
    }
};