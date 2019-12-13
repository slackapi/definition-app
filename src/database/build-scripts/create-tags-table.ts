import { createConnection } from 'mysql2/promise';
import databaseConfig from '../../config/database';

export async function addTagsTable() : Promise<void> {
    const connection = await createConnection(databaseConfig);
    const mysqlstring = `CREATE TABLE IF NOT EXISTS \`tags\` ( 
        id INT(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, 
        creator_id VARCHAR(255) NOT NULL,
        tag_name VARCHAR(255) NOT NULL,
        created DATETIME NOT NULL,
        updated DATETIME NOT NULL);`;

    connection.execute(mysqlstring).then(() => {
        console.log('addTagsTable run');
        connection.end();
    }).catch(error => {
        console.log(error);
        connection.end();
    });
}

