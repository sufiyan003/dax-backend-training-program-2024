

import pino from 'pino'

export const logger = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    },
});

export const blogServiceLogger = logger.child({ service: 'blog-service' });
export const blogRepoLogger = logger.child({ service: 'blog-service', repository: "blog-repository" });

export const categoryLogger = logger.child({ service: 'category-service' });
