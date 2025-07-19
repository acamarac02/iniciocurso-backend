import { Router } from "express";
import { asignarModuloRueda, asignarModulosBloque, desasignarModulo, intercambiarModulos } from "../handler/asignaciones";
import { validarAsignacionRueda, validarAsignacionBloque, validarDesasignacion, validarIntercambioAsignaciones } from "../middleware/asignacion.validaciones";
import { handleInputErrors } from "../middleware";

const asignacionesRouter = Router()

asignacionesRouter.put(
    '/intercambiar-modulos',
    validarIntercambioAsignaciones,
    intercambiarModulos);

asignacionesRouter.post(
    '/rueda',
    validarAsignacionRueda,
    handleInputErrors,
    asignarModuloRueda)

asignacionesRouter.post(
    '/bloque',
    validarAsignacionBloque,
    handleInputErrors,
    asignarModulosBloque)

asignacionesRouter.delete(
    '/desasignar',
    validarDesasignacion,
    desasignarModulo);

export default asignacionesRouter