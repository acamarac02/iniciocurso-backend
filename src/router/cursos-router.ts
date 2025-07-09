import { Router } from "express";
import { upload } from "../middleware/upload.excel";
import { crearCursosDesdeExcel } from "../handler/cursos";

const cursosRouter = Router()

//profesoresRouter.get('/', obtenerProfesores)


cursosRouter.post(
    '/subir-excel',
    upload.single('excel-cursos'),
    crearCursosDesdeExcel)

export default cursosRouter