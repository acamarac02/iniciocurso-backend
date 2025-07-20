import { Router } from "express";
import { upload } from "../middleware/upload.excel";
import { crearCursosDesdeExcel, obtenerCursosModulos } from "../handler/cursos";
import { validarSubidaExcelCursos } from "../middleware/cursos.validaciones";

const cursosRouter = Router()

cursosRouter.get('/', obtenerCursosModulos)

cursosRouter.post(
    '/subir-excel/:idDepartamento',
    upload.single('excel-cursos'),
    validarSubidaExcelCursos,
    crearCursosDesdeExcel)

export default cursosRouter