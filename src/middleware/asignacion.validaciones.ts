import { body, validationResult } from "express-validator";

export const validarAsignacion = [
  body("moduloId")
    .exists().withMessage("moduloId es requerido")
    .isInt({ gt: 0 }).withMessage("moduloId debe ser un entero positivo"),

  body("cursoId")
    .exists().withMessage("cursoId es requerido")
    .isInt({ gt: 0 }).withMessage("cursoId debe ser un entero positivo"),

  body("profesorId")
    .exists().withMessage("profesorId es requerido")
    .isInt({ gt: 0 }).withMessage("profesorId debe ser un entero positivo"),
];


export const validarIntercambioAsignaciones = [
  body('idProfesor1')
    .exists().withMessage('idProfesor1 es obligatorio')
    .isInt({ min: 1 }).withMessage('idProfesor1 debe ser un entero positivo'),
  body('idAsignacion1')
    .exists().withMessage('idAsignacion1 es obligatorio')
    .isInt({ min: 1 }).withMessage('idAsignacion1 debe ser un entero positivo'),
  body('idProfesor2')
    .exists().withMessage('idProfesor2 es obligatorio')
    .isInt({ min: 1 }).withMessage('idProfesor2 debe ser un entero positivo')
    .custom((value, { req }) => value !== req.body.idProfesor1).withMessage('idProfesor2 debe ser diferente a idProfesor1'),
  body('idAsignacion2')
    .exists().withMessage('idAsignacion2 es obligatorio')
    .isInt({ min: 1 }).withMessage('idAsignacion2 debe ser un entero positivo')
    .custom((value, { req }) => value !== req.body.idAsignacion1).withMessage('idAsignacion2 debe ser diferente a idAsignacion1'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];