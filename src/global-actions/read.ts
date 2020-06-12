import { emptyQueryView, revisionHistoryModal, singleTermResultView, undefinedTermModal, blockedGuestUsageModal } from '../slack-views/views'
import { createConnection, RowDataPacket } from "mysql2/promise";
import databaseConfig from '../config/database';
import { App } from '@slack/bolt';
import { Option } from '@slack/types';
import { option } from '../utils/block-builder';
import { ViewsPayload } from '../utils/view-builder';

export interface TermFromDatabase {
  term: string,
  definition: string,
  authorID: string,
  updated: Date | string,
  revision: number,
}

async function retrieveAllTermsWithValue(value: string): Promise<string[]> {
  const connection = await createConnection(databaseConfig);
  return await connection.query(
    "SELECT DISTINCT term FROM definitions WHERE term LIKE" + connection.escape('%' + value + '%') + " LIMIT 99"
  ).then(async ([rows]) => {
    connection.end();
    const terms: string[] = [];
    for (const row of (rows as RowDataPacket[])) {
      terms.push(row['term']);
    }
    return terms;
  }).catch(error => {
    console.error(error);
    return Promise.reject(error);
  });

}

export async function retrieveAllTermsOptions(value: string): Promise<Option[]> {
  const terms = await retrieveAllTermsWithValue(value);
  const options: Option[] = [];
  for (const term of terms) {
    options.push(option(term, term));
  }

  return Promise.resolve(options);
}

export async function retrieveDefinition(term: string): Promise<TermFromDatabase> {
  const connection = await createConnection(databaseConfig);

  /*
    In a public facing (i.e. not internal) application, it would be a good practice to reference the `team_id` and/or the `enterprise_id` in this query,
    but because this application is intended to be deployed internally, all users can access all terms, so it's not as relevant.
  */
  return await connection.query(
    'SELECT term, definition, revision, author_id, updated FROM definitions WHERE term = ? ORDER BY revision DESC LIMIT 1',
    [term]
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
      }
      return Promise.resolve(result);
    }
    return Promise.resolve({
      term: term,
      definition: '',
      authorID: '',
      updated: '',
      revision: 0, //TODO Clean all this up
    });
  }).catch(error => {
    connection.end();
    console.error(error);
    return Promise.reject(error);
  }
  );
}

export async function retrieveDefinitionRevisions(term: string): Promise<TermFromDatabase[]> {
  const connection = await createConnection(databaseConfig);

  return await connection.query(
    'SELECT term, definition, revision, author_id, updated FROM definitions WHERE term = ? ORDER BY revision DESC LIMIT 30',
    [term]
  ).then(async ([rows]) => {
    connection.end();
    const termRows: TermFromDatabase[] = [];
    for (const row of (rows as RowDataPacket[])) {
      termRows.push(
        {
          term: row['term'],
          definition: row['definition'],
          authorID: row['author_id'],
          updated: row['updated'],
          revision: row['revision'],
        }
      )
    }
    return Promise.resolve(termRows);
  }).catch(error => {
    connection.end();
    console.error(error);
    return Promise.reject(error);
  }
  );

}

export async function definition(term: string): Promise<ViewsPayload> {
  
  if (term.length < 1) {
    return Promise.resolve(emptyQueryView());
  }
  
  term = term.trim();

  return await retrieveDefinition(term).then(row => {

    if (row.definition.length < 1) {
      return Promise.resolve(undefinedTermModal(term));
    }
    return Promise.resolve(singleTermResultView(row.term, row.definition, row.authorID, row.updated as Date))
  }).catch(error => {
    console.error(error);
    return Promise.reject(undefinedTermModal(term));
  });
}

export async function displayRevisionsModal(botToken: string, triggerID: string, term: string, viewID: string): Promise<void> {
  const app = new App({
    token: botToken,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  });
  const revisions = await retrieveDefinitionRevisions(term);
  app.client.views.update({
    token: botToken,
    // eslint-disable-next-line @typescript-eslint/camelcase
    trigger_id: triggerID,
    view: revisionHistoryModal(term, revisions),
    // eslint-disable-next-line @typescript-eslint/camelcase
    view_id: viewID
  }).then(
    () => {
      Promise.resolve()
    }).catch(error => {
      console.error(JSON.stringify(error, null, 2));
      Promise.reject(error);
    });
}

export async function displaySearchModal(botToken: string, triggerID: string): Promise<void> {
  const app = new App({
    token: botToken,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  });
  app.client.views.open({
    token: botToken,
    // eslint-disable-next-line @typescript-eslint/camelcase
    trigger_id: triggerID,
    view: emptyQueryView()
  }).then(
    () => {
      Promise.resolve()
    }).catch(error => {
      console.error(JSON.stringify(error, null, 2));
      Promise.reject(error);
    });
}

export async function displayResultModal(botToken: string, triggerID: string, term: string, viewID?: string): Promise<unknown> {
  const app = new App({
    token: botToken,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  });
  const result = await retrieveDefinition(term);
  const view = result.definition.length > 0 ? singleTermResultView(result.term, result.definition, result.authorID, result.updated as Date) : undefinedTermModal(term)
  if (viewID) {
    return Promise.resolve(view);
  } else {
    app.client.views.open({
      token: botToken,
      // eslint-disable-next-line @typescript-eslint/camelcase
      trigger_id: triggerID,
      view
    }).then(
      () => {
        Promise.resolve()
      }).catch(error => {
        console.error(JSON.stringify(error, null, 2));
        Promise.reject(error);
      });
  }
  return Promise.resolve();
}

export async function displayBlockedGuestModal(botToken: string, triggerID: string): Promise<void> {
  const app = new App({
    token: botToken,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  });

  const view = blockedGuestUsageModal();
  app.client.views.open({
    token: botToken,
    // eslint-disable-next-line @typescript-eslint/camelcase
    trigger_id: triggerID,
    view
  }).then(
    () => {
      return Promise.resolve()
    }).catch(error => {
      console.error(JSON.stringify(error, null, 2));
      return Promise.reject(error);
    });
  
}