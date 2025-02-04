import { z } from 'zod';

export const transformSchema = z.record(z.unknown());

export const validateTransformPayload = (payload: unknown) => {
    return transformSchema.parse(payload);
};