import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as oracledb from 'oracledb';
import * as path from 'path';

oracledb.initOracleClient({
  libDir: process.env.ORACLE_LIB_DIR,
  configDir: process.env.ORACLE_CONFIG_DIR,
});

console.log('DB user:', process.env.ORACLE_USER);
console.log('DB password:', process.env.ORACLE_PASSWORD);
console.log('DB connect string:', process.env.ORACLE_CONNECT_STRING);


export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'oracle',
  serviceName: 'XE',
  connectString: process.env.ORACLE_CONNECT_STRING,
  username: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  entities: [path.join(__dirname, '/../**/*.entity.{ts,js}')],
  synchronize: false,
};
