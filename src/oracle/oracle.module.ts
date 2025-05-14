import { Module, Global } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { OrcaleProceduresService } from './services/orcale_procedures.service';
import { OracleController } from './controllers/oracle.controller';

@Global()
@Module({
  providers: [
    OrcaleProceduresService,
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
  controllers: [OracleController],
  exports: ['ORACLE_CONNECTION'],
})
export class OracleModule {}
