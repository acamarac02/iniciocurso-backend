import { body } from "express-validator";

export const validarCrearProfesor = [
  body('nombre_completo')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 150 }).withMessage('El nombre no puede tener más de 150 caracteres'),

  body('correo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo válido')
    .isLength({ max: 100 }).withMessage('El correo no puede tener más de 100 caracteres'),

  body('orden_eleccion')
    .isInt({ min: 1 }).withMessage('El orden de elección debe ser un número entero mayor que 0'),

  body('departamento')
    .notEmpty().withMessage('El departamento es obligatorio'),

  body('especialidad')
    .notEmpty().withMessage('La especialidad es obligatoria'),

  body('roles')
    .optional() // puedes hacerla opcional si no siempre viene
    .isArray().withMessage('Los roles deben ser un array de nombres')
    .custom((arr) => arr.every(r => typeof r === 'string')).withMessage('Todos los roles deben ser cadenas de texto'),
];

import { Request, Response, NextFunction } from 'express';

export const validarSubidaExcelProfesores = (req: Request, res: Response, next: NextFunction) => {
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