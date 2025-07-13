import { body } from "express-validator";

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
