import { Request, Response, NextFunction } from 'express';

export const validarSubidaExcelCursos = (req: Request, res: Response, next: NextFunction) => {
    const { idDepartamento } = req.params;

    // Validar ID del departamento
    if (!idDepartamento || isNaN(Number(idDepartamento))) {
        res.status(400).json({ error: 'ID de departamento inválido' });
        return;
    }

    // Validar que se haya subido un archivo
    if (!req.file) {
        res.status(400).json({ error: 'No se ha subido ningún archivo Excel' });
        return;
    }

    // Validar extensión del archivo
    const ext = req.file.originalname.split('.').pop();
    if (!['xlsx', 'xls'].includes(ext || '')) {
        res.status(400).json({ error: 'El archivo debe ser un Excel con extensión .xlsx o .xls' });
        return;
    }

    next();
};