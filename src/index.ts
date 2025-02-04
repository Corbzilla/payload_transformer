import cors from "cors";
import express, { Express, Request, Response } from 'express';
import helmet from "helmet";
import { pino } from "pino";
import { env } from "./utils/envConfig"
import rateLimiter from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import swaggerUi from 'swagger-ui-express';
import { specs } from './docs/swaggerJsdoc';
import { healthCheck } from "./routes/healthCheck";
import { validateTransformPayload } from "./validators/validateTransformPayload";

const logger = pino({ name: "server start" });
const app: Express = express();
const port = env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(healthCheck);
app.use(rateLimiter);
app.use(requestLogger);

function transformPayload(data: unknown): unknown {
    if (typeof data === 'object' && data !== null) {
        if (Array.isArray(data)) {
            return data.map(transformPayload);
        }
        
        const transformed: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data)) {
            transformed[key] = transformPayload(value);
        }
        return transformed;
    }
    
    return data === 'dog' ? 'cat' : data;
}

/**
 * @openapi
 * /transform:
 *   post:
 *     summary: Transform JSON payload by replacing 'dog' with 'cat'
 *     tags: [Transform]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             pets: ['dog', 'cat']
 *             info: { favorite: 'dog' }
 *             nested: {
 *               animals: ['dog', 'bird'],
 *               details: { bestFriend: 'dog' }
 *             }
 *     responses:
 *       200:
 *         description: Transformed payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               pets: ['cat', 'cat']
 *               info: { favorite: 'cat' }
 *               nested: {
 *                 animals: ['cat', 'bird'],
 *                 details: { bestFriend: 'cat' }
 *               }
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.post('/transform', (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const validatedPayload = validateTransformPayload(payload);
        const transformedPayload = transformPayload(validatedPayload);
        res.json(transformedPayload);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
        logger.error(error);
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

const shutdown = async () => {
    if (server) {
        await new Promise((resolve) => {
            server.close(() => {
                logger.info('Server shut down');
                resolve(true);
            });
        });
    }
};

export { app, logger, shutdown };