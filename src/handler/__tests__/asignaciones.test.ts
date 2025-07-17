import request from 'supertest';
import server from '../../server';

describe('POST /api/asignaciones', () => {
    it ('No existe el módulo', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 36,
                cursoId: 4,
                profesorId: 2
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Módulo, curso o profesor no encontrado');
    })

    it ('No existe el curso', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 9,
                cursoId: 20,
                profesorId: 2
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Módulo, curso o profesor no encontrado');
    })

    it ('No existe el profesor', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 9,
                cursoId: 4,
                profesorId: 80
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Módulo, curso o profesor no encontrado');
    })

    it ('Módulo no asociado a curso', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 9,
                cursoId: 5,
                profesorId: 2
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'El módulo no está vinculado al curso. No se puede asignar.');
    })

    it ('Departamento sin proceso activo', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 9,
                cursoId: 4,
                profesorId: 30
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'El departamento Comercio no tiene un proceso activo');
    })

    it ('Departamento sin proceso en BBDD', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 9,
                cursoId: 4,
                profesorId: 31
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'El departamento Administración no tiene un proceso activo');
    })

    it ('No es turno del profesor', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 9,
                cursoId: 4,
                profesorId: 3
            });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'No es el turno del profesor.');
    })

    it ('Módulo ya asignado', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 14,
                cursoId: 5,
                profesorId: 2
            });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('error', 'Ese módulo de ese curso ya está asignado a un profesor');
    })

    it ('Módulo distinta especialidad', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 9,
                cursoId: 4,
                profesorId: 2
            });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'La especialidad del módulo no coincide con la del profesor');
    })

    it ('Supera 21h', async () => {
        const response = await request(server)
            .post('/api/asignaciones')
            .send({
                moduloId: 15,
                cursoId: 5,
                profesorId: 2
            });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('error', 'No puedes superar las 21 horas asignadas.');
    })
})