import { Request, Response } from 'express'
import { MulterRequest } from '../types/express';
import * as XLSX from 'xlsx';
import colors from 'colors'
import { buscarProfesorPorCorreo, crearProfesorService, eliminarProfesorPorId, obtenerProfesorConModulos, obtenerProfesoresDB } from '../services/profesor.service'
import { intercambiarAsignacionesEntreProfesores } from '../services/asignacion.service';

export const crearProfesor = async (req: Request, res: Response) => {
    try {
        const profesor = await crearProfesorService(req.body)
        res.status(201).json({ data: profesor })
    } catch (error) {
        console.log(colors.red.bold(error))
        res.status(400).json({ error: (error as Error).message });
    }
}

export const obtenerProfesores = async (req: Request, res: Response) => {
    try {
        const profesores = await obtenerProfesoresDB()
        res.status(201).json({ data: profesores })
    } catch (error) {
        console.log(colors.red.bold(error))
        res.status(400).json({ error: (error as Error).message });
    }
}

export const crearProfesoresDesdeExcel = async (req: MulterRequest, res: Response) => {
    try {
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);

        if (!req.file) {
            res.status(400).json({ error: 'Archivo no proporcionado' });
        }

        // Leer el Excel desde el buffer
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const datos = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        const errores: string[] = [];
        const resultados: any[] = [];

        for (let i = 0; i < datos.length; i++) {
            const fila = datos[i] as any;
            const filaNum = i + 2; // +2 porque Excel empieza en 1 y la primera fila es cabecera

            const nombre_completo = fila['Nombre']?.toString().trim();
            const correo = fila['Correo']?.toString().trim();
            const especialidad = fila['Especialidad']?.toString().trim();
            const admin = fila['Admin'];

            if (!nombre_completo || !correo || !especialidad) {
                errores.push(`Fila ${filaNum}: faltan campos obligatorios`);
                continue;
            }

            const roles = admin === true || admin === 'TRUE' ? ['admin', 'profesor'] : ['profesor'];

            try {
                // Buscar profesor existente por correo
                const profesorExistente = await buscarProfesorPorCorreo(correo);
                if (profesorExistente) {
                    // Eliminar el profesor existente
                    console.log(colors.cyan("Elimina al profesor " + profesorExistente.nombre_completo))
                    await eliminarProfesorPorId(profesorExistente.id);
                }

                const profesor = await crearProfesorService({
                    nombre_completo,
                    correo,
                    especialidad,
                    departamento: 'Informática', // TODO: Cambiar al departamento del admin que sube el fichero
                    orden_eleccion: filaNum - 1,
                    roles,
                });

                resultados.push(profesor);
            } catch (error) {
                errores.push(`Fila ${filaNum}: ${(error as Error).message}`);
            }
        }

        if (errores.length > 0) {
            res.status(207).json({ resultados, errores });
        }

        res.status(201).json({ resultados });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar el archivo' });
    }
};

export const obtenerModulosDelProfesor = async (req: Request, res: Response) => {
    try {
        const profesorId = Number(req.params.id);

        const profesor = await obtenerProfesorConModulos(profesorId);

        if (!profesor) {
            res.status(404).json({ error: 'Profesor no encontrado' });
            return;
        }

        //const modulos = profesor.asignaciones.map(a => a.modulo);

        res.json(profesor);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al obtener los módulos del profesor' });
    }
};