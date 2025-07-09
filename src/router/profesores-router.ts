import { Router } from "express";
import { crearProfesor, crearProfesoresDesdeExcel, obtenerProfesores } from "../handler/profesor";
import { handleInputErrors } from "../middleware";
import { validarCrearProfesor } from "../middleware/profesor.validaciones";
import { upload } from "../middleware/upload.excel";

const profesoresRouter = Router()

profesoresRouter.get('/', obtenerProfesores)

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