import { emptyQueryView, definitionResultView, undefinedTermView } from '../slack-views/views'
import { createConnection, RowDataPacket } from "mysql2/promise";
import databaseConfig from '../config/database';
import { SayArguments } from '@slack/bolt';

interface TermFromDatabase {
  term: string,
  definition: string,
  authorID: string,
  updated: Date | string
}

export async function retrieveDefinition(term: string, teamID: string): Promise<TermFromDatabase> {
  const connection = await createConnection(databaseConfig);

  return await connection.query(
    'SELECT term, definition, revision, author_id, updated FROM definitions WHERE term = ? ORDER BY revision LIMIT 1',
    [term, teamID]
  ).then(async ([rows]) => {
    const firstRow = (rows as RowDataPacket)[0];
    connection.end();
    if (firstRow) {
      const result = {
        term: firstRow['term'],
        definition: firstRow['definition'],
        authorID: firstRow['author_id'],
        updated: firstRow['updated']
      }
      return Promise.resolve(result);
    }
    return Promise.resolve({
      term: term,
      definition: '',
      authorID: '',
      updated: ''
    });
  }).catch(error => {
    connection.end();
    console.error(error);
    return Promise.reject(error);
  }
  );
}

export async function definition(term: string, teamID: string): Promise<SayArguments> {
  term = term.trim();

  if (term.length < 1) {
    return Promise.resolve(emptyQueryView());
  }

  return await retrieveDefinition(term, teamID).then(row => {

    if (row.definition.length < 1) {
      return Promise.resolve(undefinedTermView(term));
    }
    return Promise.resolve(definitionResultView(row.term, row.definition, row.authorID, row.updated as Date))
  }).catch(error => {
    console.error(error);
    return Promise.reject(undefinedTermView(term));
  });

}