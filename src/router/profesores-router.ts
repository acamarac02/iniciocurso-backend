import { Router } from "express";
import { crearProfesor, crearProfesoresDesdeExcel, obtenerModulosDelProfesor, obtenerProfesores } from "../handler/profesor";
import { handleInputErrors } from "../middleware";
import { validarCrearProfesor } from "../middleware/profesor.validaciones";
import { upload } from "../middleware/upload.excel";

const profesoresRouter = Router()

profesoresRouter.get('/', obtenerProfesores)

profesoresRouter.get('/:id/modulos', obtenerModulosDelProfesor)

profesoresRouter.post(
    '/', 
    validarCrearProfesor,
    handleInputErrors,
    crearProfesor)

profesoresRouter.post(
    '/subir-excel',
    upload.single('excel-profesores'),
    crearProfesoresDesdeExcel)

export default profesoresRouter