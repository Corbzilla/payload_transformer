import request from 'supertest';
import { app, shutdown } from '../src';

afterAll(() => { shutdown() });

describe('JSON Transformer Endpoint', () => {
    it('should replace exact "dog" values with "cat"', async () => {
        const payload = {
            pets: ['dog', 'cat'],
            info: { favorite: 'dog' }
        };

        const response = await request(app)
            .post('/transform')
            .send(payload)
            .expect(200);

        expect(response.body).toEqual({
            pets: ['cat', 'cat'],
            info: { favorite: 'cat' }
        });
    });

    it('should not replace strings containing "dog"', async () => {
        const payload = {
            pets: ['bulldogs', 'doghouse'],
            info: { favorite: 'my dog' }
        };

        const response = await request(app)
            .post('/transform')
            .send(payload)
            .expect(200);

        expect(response.body).toEqual(payload);
    });

    it('should handle nested complex objects', async () => {
        const payload = {
            level1: {
                level2: {
                    animal: 'dog'
                },
                array: ['dog', 'cat']
            }
        };

        const response = await request(app)
            .post('/transform')
            .send(payload)
            .expect(200);

        expect(response.body).toEqual({
            level1: {
                level2: {
                    animal: 'cat'
                },
                array: ['cat', 'cat']
            }
        });
    });

    it('should handle empty payloads', async () => {
        const payload = {};

        const response = await request(app)
            .post('/transform')
            .send(payload)
            .expect(200);

        expect(response.body).toEqual({});
    });
});