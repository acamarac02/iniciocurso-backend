import { Router } from "express";
import { crearProfesor, crearProfesoresDesdeExcel, obtenerModulosDelProfesor, obtenerProfesores } from "../handler/profesor";
import { handleInputErrors } from "../middleware";
import { validarCrearProfesor, validarSubidaExcelProfesores } from "../middleware/profesor.validaciones";
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
    '/subir-excel/:idDepartamento',
    upload.single('excel-profesores'),
    validarSubidaExcelProfesores,
    crearProfesoresDesdeExcel)

export default profesoresRouter