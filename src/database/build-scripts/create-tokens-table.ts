import { createConnection } from 'mysql2/promise';
import databaseConfig from '../../config/database';

export async function addTokensTable() : Promise<void> {
    const connection = await createConnection(databaseConfig);
    const mysqlstring = `CREATE TABLE IF NOT EXISTS \`tokens\` ( 
        id INT(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, 
        team_id VARCHAR(255) NOT NULL, 
        bot_token VARCHAR(255) NOT NULL, 
        installing_user VARCHAR(255) NOT NULL,
        installing_user_token VARCHAR(255) NOT NULL,
        bot_user_id VARCHAR(255) NOT NULL,
        enterprise_id VARCHAR(255) NOT NULL,
        created DATETIME NOT NULL,
        updated DATETIME NOT NULL);`;

    connection.execute(mysqlstring).then(() => {
        console.log('addTokensTable run');
        connection.end();
    }).catch(error => {
        console.log(error);
        connection.end();
    });
}

