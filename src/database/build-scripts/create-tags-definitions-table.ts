import { createConnection } from 'mysql2/promise';
import databaseConfig from '../../config/database';

export async function addTagsDefinitionsBridgeTable() : Promise<void> {
    const connection = await createConnection(databaseConfig);
    const mysqlstring = `CREATE TABLE IF NOT EXISTS \`tags_definitions\` ( 
        id INT(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
        tag_id INT(11) UNSIGNED NOT NULL,
        definition_id INT(11) UNSIGNED NOT NULL,
        FOREIGN KEY (tag_id) REFERENCES tags(id),
        FOREIGN KEY (definition_id) REFERENCES definitions(id),
        created DATETIME NOT NULL,
        updated DATETIME NOT NULL);`;

    connection.execute(mysqlstring).then(() => {
        console.log('addTagsDefinitionsBridgeTable run');
        connection.end();
    }).catch(error => {
        console.log(error);
        connection.end();
    });
}

