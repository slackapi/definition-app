import { createConnection } from 'mysql2/promise';
import databaseConfig from '../../config/database';

export async function updateDefinitionLength() : Promise<void> {
    const connection = await createConnection(databaseConfig);
    const mysqlstring = `ALTER TABLE definitions MODIFY definition VARCHAR(3100);`;

    connection.execute(mysqlstring).then(() => {
        console.log('updateDefinitionLength run');
        connection.end();
    }).catch(error => {
        console.log(error);
        connection.end();
    });
}

