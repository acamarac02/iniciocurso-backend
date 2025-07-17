import { Router } from "express";
import { asignarModulo, intercambiarModulos } from "../handler/asignaciones";
import { validarAsignacion, validarIntercambioAsignaciones } from "../middleware/asignacion.validaciones";
import { handleInputErrors } from "../middleware";

const asignacionesRouter = Router()

asignacionesRouter.put(
    '/intercambiar-modulos', 
    validarIntercambioAsignaciones,
    intercambiarModulos);

asignacionesRouter.post(
    '/',
    validarAsignacion,
    handleInputErrors,
    asignarModulo)

export default asignacionesRouter