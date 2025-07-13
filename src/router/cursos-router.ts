import { Router } from "express";
import { upload } from "../middleware/upload.excel";
import { crearCursosDesdeExcel, obtenerCursosModulos } from "../handler/cursos";

const cursosRouter = Router()

cursosRouter.get('/', obtenerCursosModulos)

cursosRouter.post(
    '/subir-excel',
    upload.single('excel-cursos'),
    crearCursosDesdeExcel)

export default cursosRouter