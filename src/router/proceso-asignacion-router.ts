import { Router } from "express";
import { validarDepartamentoId, validarInicioProceso, validarModificacionProceso } from "../middleware/proceso.validaciones";
import { obtenerProcesoActivoYPendientesHandler, finalizarProcesoAsignacionHandler, iniciarProcesoAsignacionHandler, modificarProcesoAsignacionHandler } from "../handler/proceso";

const procesoRouter = Router();

procesoRouter.get(
    '/:idDepartamento',
    validarDepartamentoId,
    obtenerProcesoActivoYPendientesHandler);

procesoRouter.put(
    '/finalizar/:idDepartamento',
    validarDepartamentoId,
    finalizarProcesoAsignacionHandler);

procesoRouter.post(
    '/iniciar/:idDepartamento',
    validarInicioProceso,
    iniciarProcesoAsignacionHandler);

procesoRouter.patch(
    '/modificar/:idDepartamento', 
    validarModificacionProceso, 
    modificarProcesoAsignacionHandler);


export default procesoRouter