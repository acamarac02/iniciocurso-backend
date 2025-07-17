import db from "../config/db"
import AsignacionModulo from "../models/AsignacionModulo.model"
import Curso from "../models/Curso.model"
import Departamento from "../models/Departamento.model"
import Especialidad from "../models/Especialidad.model"
import Modulo from "../models/Modulo.model"
import Profesor from "../models/Profesor.model"
import Rol from "../models/Rol.model"
import { obtenerDepartamentoPorNombre } from "./departamento.service"
import { obtenerEspecialidadPorNombre } from "./especialidad.service"
import { obtenerRolesPorNombre } from "./rol.service"

interface CrearProfesorInput {
    nombre_completo: string
    correo: string
    orden_eleccion: number
    departamento: string
    especialidad: string
    roles: string[]
}

export const obtenerProfesoresDB = async () => {
    return Profesor.findAll({
        order: [
            ['orden_eleccion', 'ASC']
        ], include: [
            {
                model: Rol,
                through: { attributes: [] }, // evita mostrar ProfesorRol
                attributes: ['id', 'nombre']
            }
        ]
    })
}

export const crearProfesorService = async (input: CrearProfesorInput) => {
    let { departamento, especialidad, roles } = input

    const transaction = await db.transaction()

    try {
        const dept = await obtenerDepartamentoPorNombre(departamento)
        if (!dept) throw new Error(`Departamento "${departamento}" no encontrado`);

        const espec = await obtenerEspecialidadPorNombre(especialidad)
        if (!espec) throw new Error(`Especialidad ${especialidad} no encontrada`);

        const profesor = await Profesor.create(
            {
                nombre_completo: input.nombre_completo,
                correo: input.correo,
                orden_eleccion: input.orden_eleccion,
                departamento_id: dept.id,
                especialidad_id: espec.id
            },
            { transaction: transaction }
        );

        // Guardamos los roles
        if (roles && roles.length > 0) {
            const rolesDB = await obtenerRolesPorNombre(roles)

            if (rolesDB.length !== roles.length) {
                const nombresDB = rolesDB.map(r => r.nombre)
                const faltantes = roles.filter(r => !nombresDB.includes(r))
                throw new Error(`Los siguientes roles no existen: ${faltantes.join(', ')}`)
            }

            // Asociar los roles al profesor
            await profesor.$set("roles", rolesDB, { transaction: transaction })
        }

        await transaction.commit()
        return profesor

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}

export const buscarProfesorPorCorreo = async (correo: string) => {
    return await Profesor.findOne({ where: { correo } });
};

export const obtenerProfesorPorId = async (id: number) => {
    return await Profesor.findByPk(id, {
        include: [{ model: Departamento }]
    });
};

export const obtenerProfesorConModulos = async (id: number) => {
    return await Profesor.findByPk(id, {
        include: [
            {
                association: Profesor.associations.asignaciones,
                include: [
                    { association: AsignacionModulo.associations.modulo },
                    { association: AsignacionModulo.associations.curso }
                ]
            }
        ]
    });
};

export const obtenerProfesoresDelDepartamento = async (departamentoId: number): Promise<Profesor[]> => {
    return Profesor.findAll({
        where: { departamento_id: departamentoId },
        order: [['orden_eleccion', 'ASC']],
    });
};


export const eliminarProfesorPorId = async (id: number) => {
    await Profesor.destroy({ where: { id } });
};