import { createConnection } from 'mysql2/promise';
import databaseConfig from '../../config/database';

export async function addDefinitionsTable() : Promise<void> {
    const connection = await createConnection(databaseConfig);
    const mysqlstring = `CREATE TABLE IF NOT EXISTS \`definitions\` ( 
        id INT(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, 
        author_id VARCHAR(255) NOT NULL,
        term VARCHAR(255) NOT NULL,
        definition VARCHAR(255) NOT NULL,
        revision INT(11) NOT NULL,
        created DATETIME NOT NULL,
        updated DATETIME NOT NULL);`;

    connection.execute(mysqlstring).then(() => {
        console.log('addDefinitionsTable run');
        connection.end();
    }).catch(error => {
        console.log(error);
        connection.end();
    });
}

