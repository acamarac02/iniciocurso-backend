

export const validarDepartamentoId = (req, res, next) => {
    const { idDepartamento } = req.params;

    if (!idDepartamento || isNaN(Number(idDepartamento))) {
        return res.status(400).json({ error: 'ID de departamento inválido' });
    }

    next();
};

export const validarInicioProceso = (req, res, next) => {
    const { idDepartamento } = req.params;
    const { permitir_otras_especialidades, modo_asignacion } = req.body || {};

    if (!idDepartamento || isNaN(Number(idDepartamento))) {
        return res.status(400).json({ error: 'ID de departamento inválido' });
    }

    if (typeof permitir_otras_especialidades !== 'boolean') {
        return res.status(400).json({ error: 'El campo permitir_otras_especialidades debe ser booleano' });
    }

    if (typeof modo_asignacion !== 'string' || !['bloque', 'rueda'].includes(modo_asignacion)) {
        return res.status(400).json({ error: 'El campo modo_asignacion debe ser "bloque" o "rueda"' });
    }

    next();
};

export const validarModificacionProceso = (req, res, next) => {
    const { idDepartamento } = req.params;
    const { permitir_otras_especialidades } = req.body;

    if (!idDepartamento || isNaN(Number(idDepartamento))) {
        return res.status(400).json({ error: 'ID de departamento inválido' });
    }

    if (typeof permitir_otras_especialidades !== 'boolean') {
        return res.status(400).json({ error: 'El campo permitir_otras_especialidades debe ser booleano' });
    }

    next();
};
