import { Injectable, OnModuleInit } from '@nestjs/common';
import * as oracledb from 'oracledb'

@Injectable()
export class OracleService implements OnModuleInit {
    private connection: oracledb.Connection;

    async onModuleInit() {
        this.connection = await oracledb.getConnection({
            user: 'PACHU',
            password: 'fDasfayoirewr5633$$',
            connectionString: 'adb.sa-saopaulo-1.oraclecloud.com:1522/gdd66892f39bdf3_cgtest_tp.adb.oraclecloud.com'
        });
        
        console.log('Conectado a Oracle');
    }
    async ejecutarStoredProcedure(): Promise<any> {
        const result = await this.connection.execute(
            `DECLARE

            BEGIN hr.PKG_TEST_HR_PLSQL.REF_CUR_EMPLOYEES ( v_cursor ); END:`
        )
    }
}
