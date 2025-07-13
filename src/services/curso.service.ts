import Curso from "../models/Curso.model";
import Modulo from "../models/Modulo.model";
import Turno from "../models/Turno.model";
import { obtenerTurnoPorId } from "./turno.service";


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

export const obtenerCursosModulosDB = async (turnoId?: number) => {
  let whereClause = {};

  // Validar si turnoId existe en BD
  if (turnoId) {
    const turnoExiste = await obtenerTurnoPorId(turnoId);
    if (turnoExiste) {
      whereClause = { turno_id: turnoId };
    }
  }

  return Curso.findAll({
      where: whereClause,
      include: [
          {
              model: Modulo,
              through: { attributes: [] },
          },
          {
              model: Turno,
          },
      ],
  });
};

export const obtenerCursoPorId = async (id: number) => {
  return Curso.findByPk(id);
};