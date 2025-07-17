import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'
import Curso from "../models/Curso.model";
import Departamento from "../models/Departamento.model";
import Especialidad from "../models/Especialidad.model";
import Modulo from "../models/Modulo.model";
import Profesor from "../models/Profesor.model";
import Rol from "../models/Rol.model";
import ProfesorRol from "../models/ProfesorRol.model";
import AsignacionModulo from "../models/AsignacionModulo.model";
import ProcesoAsignacion from "../models/ProcesoAsignacion.model";
import ModuloCurso from "../models/ModuloCurso.model";
import ModuloEspecialidad from "../models/ModuloEspecialidad.model";
import Turno from "../models/Turno.model";

dotenv.config()

const db = new Sequelize(process.env.DATABASE_URL!, {
    logging: false
})

db.addModels([
    Curso,
    Departamento,
    Especialidad,
    Modulo,
    Profesor,
    Rol,
    ProfesorRol,
    AsignacionModulo,
    ProcesoAsignacion,
    ModuloCurso,
    ModuloEspecialidad,
    Turno
]);

export default db