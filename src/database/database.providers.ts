import { DataSource } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { SubCategory } from '../sub-categories/entities/sub-category.entity';
import { Product } from '../products/entities/product.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || '1234',
        database: process.env.DB_NAME || 'dax_bazaar_db',
        entities: [Category, SubCategory, Product],
        synchronize: true, 
      });

      return dataSource.initialize();
    },
  },
];
