import Curso from "../models/Curso.model";
import Turno from "../models/Turno.model";


export const obtenerOInsertarCurso = async (nombre: string, siglas: string, turno: Turno) => {
    return await Curso.findOrCreate({
        where: {
          nombre,
          siglas,
          turno_id: turno.id,
        },
        defaults: {
          nombre,
          siglas,
          turno_id: turno.id,
        }
      });
};