import express from 'express';
import { WebClient, WebAPICallResult } from '@slack/web-api';
import { createConnection, RowDataPacket } from 'mysql2/promise';

import { approvedEnterprises, approvedWorkspaces } from '../config/oauth'
import databaseConfig from '../config/database';

const router = express.Router();

const client = new WebClient();

interface SlackOAuthV2Result extends WebAPICallResult {
    app_id: string,
    authed_user: { id: string },
    scope: string,
    token_type: string,
    access_token: string,
    bot_user_id: string,
    team: { id: string, name: string },
    enterprise?: { id: string, name: string },
}

function proceedWithInstall(workspaceID: string, enterpriseID?: string): boolean {
    if (enterpriseID && approvedEnterprises.includes(enterpriseID)) {
        return true;
    }

    if (approvedWorkspaces.includes(workspaceID)) {
        return true;
    }

    return false;
}

router.get('/app_installed', function (req, res) {
    const code = req.query.code;
    if (code !== undefined) {
        client.oauth.v2.access({
            // eslint-disable-next-line @typescript-eslint/camelcase
            client_id: process.env.SLACK_CLIENT_ID as string,
            // eslint-disable-next-line @typescript-eslint/camelcase
            client_secret: process.env.SLACK_CLIENT_SECRET as string,
            code
        }).then(async (authResult): Promise<void> => {
            // const connection = await createConnection(databaseConfig);
            const payload = authResult as SlackOAuthV2Result;
            const workspaceID = payload.team.id as string;
            const enterpriseID = payload.enterprise ? payload.enterprise.id : '';
            if (proceedWithInstall(workspaceID, enterpriseID)) {
                const connection = await createConnection(databaseConfig);
                await connection.query(
                    'SELECT * from tokens WHERE team_id = ? AND installing_user = ?',
                    [workspaceID, payload.authed_user.id]
                ).then(async ([rows]) => {

                    if (((rows) as RowDataPacket).length > 0) {
                        const currentInstall = (rows as RowDataPacket)[0];
                        // Existing install, just give a success and move on
                        const updateTime = new Date();
                        await connection.query(
                            'UPDATE tokens SET bot_token = ?, installing_user = ?, bot_user_id = ?, updated = ? WHERE id = ?',
                            [payload.access_token, payload.authed_user.id, payload.bot_user_id, updateTime, currentInstall.id]
                        ).then(() => {
                            connection.end();
                            res.send('Successful install');
                        }).catch(error => {
                            console.error(error);
                            connection.end();
                            res.send('Install error, check logs');
                        });
                    } else {
                        // Net new install
                        const creationDate = new Date();
                        const newInstall = {
                            teamID: workspaceID,
                            botToken: payload.access_token,
                            installingUser: payload.authed_user.id,
                            botUserID: payload.bot_user_id,
                            createdAt: creationDate,
                            updatedAt: creationDate,
                            enterpriseID
                        }
                        await connection.execute(
                            'INSERT into tokens SET team_id = ?, bot_token = ?, installing_user = ?, bot_user_id = ?, created = ?, updated = ?, enterprise_id = ?',
                            [newInstall.teamID, newInstall.botToken, newInstall.installingUser, newInstall.botUserID, newInstall.createdAt, newInstall.updatedAt, newInstall.enterpriseID]
                        ).then(() => {
                            connection.end();
                            res.send('Successful install');
                        }).catch(error => {
                            console.error(error);
                            connection.end();
                            res.send('Install error, check logs');
                        });
                    }
                }).catch(error => {
                    console.error(error);
                    connection.end();
                    res.send('Install error, check logs');
                });
            } else {
                // Not an approved workspace, so uninstall instantly
                client.apiCall(
                    'apps.uninstall',
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    { token: payload.access_token, client_id: process.env.SLACK_CLIENT_ID, client_secret: process.env.SLACK_CLIENT_SECRET }
                ).then(() => {
                    res.send('The installing workspace has not been approved');
                }
                );
            }
        });
    }
})



export default router;
