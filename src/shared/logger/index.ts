

import { createWriteStream } from 'fs';
import pino from 'pino'

const stream = createWriteStream('./logs.log', { flags: 'a' });

export const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    },

}, stream);

export const blogLogger = logger.child({ module: 'blog-service' });

export const categoryLogger = logger.child({ module: 'category-service' });
