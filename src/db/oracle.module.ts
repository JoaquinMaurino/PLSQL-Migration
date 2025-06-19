import { Module, Global } from '@nestjs/common';
import * as oracledb from 'oracledb';

/* @Global()
@Module({
  providers: [
    {
      provide: 'ORACLE_CONNECTION',
      useFactory: async () => {
        try {
          oracledb.initOracleClient({
            libDir: process.env.ORACLE_LIB_DIR,
            configDir: process.env.ORACLE_CONFIG_DIR,
          });
          console.log('Initializing Oracle Client...');
          const connection = await oracledb.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONNECT_STRING,
          });
          console.log('Connected to Oracle');
          return connection;
        } catch (error) {
          console.log('Error connecting to Oracle: ', error);
          throw error;
        }
      },
    },
  ],
  exports: ['ORACLE_CONNECTION'],
})
export class OracleModule { } */


async function testConnection() {
  try {
    oracledb.initOracleClient({ libDir: 'E:\instantclient_23_8' });

    const conn = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
    });

    console.log('Conexión exitosa!');
    await conn.close();
  } catch (err) {
    console.error('Error al conectar:', err);
  }
}

testConnection();
