import { MulterRequest } from "../types/express"
import { Response } from 'express'
import * as XLSX from 'xlsx'
import { obtenerTurnoPorNombre } from "../services/turno.service";
import { obtenerOInsertarCurso } from "../services/curso.service";
import { obtenerEspecialidadPorNombre } from "../services/especialidad.service";
import Curso from "../models/Curso.model";
import { asociarModuloCurso, asociarModuloEspecialidad, obtenerOInsertarModulo } from "../services/modulo.service";

export const crearCursosDesdeExcel = async (req: MulterRequest, res: Response) => {
    try {
        if (!req.file) res.status(400).json({ error: "Archivo no proporcionado" });

        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

        const hojaCursos = workbook.Sheets["Cursos"];
        if (!hojaCursos) res.status(400).json({ error: "Hoja 'Cursos' no encontrada" });

        const cursos = XLSX.utils.sheet_to_json(hojaCursos, { defval: "" });

        const { resultados, info } = await procesarCursosDesdeExcel(cursos, workbook);

        res.status(200).json({ resultados, info });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al procesar el archivo" });
    }
};

const procesarCursosDesdeExcel = async (cursos: any[], workbook: XLSX.WorkBook) => {
    const info: string[] = [];
    const resultados: any[] = [];

    for (let i = 0; i < cursos.length; i++) {
        const fila = cursos[i];
        const filaNum = i + 2;

        const { nombre, siglas, turnoNombre } = extraerDatosCurso(fila);

        if (!nombre || !siglas || !turnoNombre) {
            info.push(`Fila ${filaNum} - Curso inválido: ${JSON.stringify(fila)}`);
            continue;
        }

        const turno = await obtenerTurnoPorNombre(turnoNombre);
        if (!turno) {
            info.push(`Fila ${filaNum} - Turno inválido: ${JSON.stringify(turnoNombre)}`);
            continue;
        }

        const [cursoDB, creado] = await obtenerOInsertarCurso(nombre, siglas, turno);

        if (creado) {
            resultados.push({ curso: cursoDB });
        } else {
            info.push(`Fila ${filaNum} - El curso '${nombre}' (${siglas}, ${turnoNombre}) ya existe`);
        }

        procesarModulosCurso(siglas, workbook, info, cursoDB)
    }

    return { resultados, info };
};

const extraerDatosCurso = (fila: any) => {
    const nombre = fila["Nombre"]?.toString().trim();
    const siglas = fila["Siglas"]?.toString().trim();
    const turnoNombre = fila["Turno"]?.toString().trim();

    return { nombre, siglas, turnoNombre };
};


const procesarModulosCurso = async (siglasCurso: string, workbook: XLSX.WorkBook, info: string[], cursoDB: Curso) => {
    // --- Procesar hoja con módulos ---
    const hojaModulos = workbook.Sheets[siglasCurso];
    if (!hojaModulos) {
        info.push(`Hoja '${siglasCurso}' no encontrada`);
        return;
    }

    const modulos = XLSX.utils.sheet_to_json(hojaModulos, { defval: "" });

    for (let i = 0; i < modulos.length; i++) {
        const modulo = modulos[i];
        const filaNum = i + 2;
        const nombreModulo = modulo["Nombre"]?.toString().trim();
        const siglasModulo = modulo["Siglas"]?.toString().trim();
        const horas = parseInt(modulo["Horas"]);
        const especialidadNombre = modulo["Especialidad"]?.toString().trim();

        if (!nombreModulo || !siglasModulo || isNaN(horas) || !especialidadNombre) {
            info.push(`Módulo inválido en ${siglasCurso}: fila ${filaNum}`);
            continue;
        }

        // --- Especialidad ---
        const especialidadDB = await obtenerEspecialidadPorNombre(especialidadNombre)
        if (!especialidadDB) {
            info.push(`Fila ${filaNum} - Especialidad inválida: ${JSON.stringify(especialidadNombre)}`);
            continue;
        }

        const [moduloDB, creado] = await obtenerOInsertarModulo(nombreModulo, siglasModulo, horas)
        await asociarModuloEspecialidad(moduloDB, especialidadDB)
        await asociarModuloCurso(moduloDB, cursoDB)
    }
}