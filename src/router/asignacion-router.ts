import { Router } from "express";
import { crearCursosDesdeExcel, obtenerCursosModulos } from "../handler/cursos";
import { asignarModulo } from "../handler/asignaciones";
import { validarAsignacion } from "../middleware/asignacion.validaciones";
import { handleInputErrors } from "../middleware";

const asignacionesRouter = Router()

//Meter middleware con validaciones
asignacionesRouter.post(
    '/',
    validarAsignacion,
    handleInputErrors,
    asignarModulo)

export default asignacionesRouter