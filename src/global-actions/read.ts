import { emptyQueryView, definitionResultView, undefinedTermView } from '../slack-views/views'
import { createConnection, RowDataPacket } from "mysql2/promise";
import databaseConfig from '../config/database';
import { SayArguments } from '@slack/bolt';

export interface TermFromDatabase {
  term: string,
  definition: string,
  authorID: string,
  updated: Date | string,
  revision: number,
  teamID: string
}

export async function retrieveDefinition(term: string, teamID: string): Promise<TermFromDatabase> {
  const connection = await createConnection(databaseConfig);

  return await connection.query(
    'SELECT term, definition, revision, author_id, updated, team_id FROM definitions WHERE term = ? AND team_id = ? ORDER BY revision DESC LIMIT 1',
    [term, teamID]
  ).then(async ([rows]) => {
    const firstRow = (rows as RowDataPacket)[0];
    connection.end();
    if (firstRow) {
      const result = {
        term: firstRow['term'],
        definition: firstRow['definition'],
        authorID: firstRow['author_id'],
        updated: firstRow['updated'],
        revision: firstRow['revision'],
        teamID: firstRow['team_id']
      }
      return Promise.resolve(result);
    }
    return Promise.resolve({
      term: term,
      definition: '',
      authorID: '',
      updated: '',
      revision: 0, //TODO Clean all this up
      teamID: ''
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