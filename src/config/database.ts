import { parse as parseUrl } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const databaseConfig: {[k: string]: string | null | undefined } = {}; 
// TODO we can probably do a better job of typings here

if (databaseUrl) {
    // when the DATABASE_URL is defined, parse it for individual values
    const parsedDatabaseUrl = parseUrl(databaseUrl);
    databaseConfig.host = parsedDatabaseUrl.hostname;
    databaseConfig.database = (parsedDatabaseUrl.pathname as string).substr(1);
    databaseConfig.user = parsedDatabaseUrl.auth ?
        parsedDatabaseUrl.auth.substr(0, parsedDatabaseUrl.auth.indexOf(':')) : undefined;
    databaseConfig.password = parsedDatabaseUrl.auth ?
        parsedDatabaseUrl.auth.substring(parsedDatabaseUrl.auth.indexOf(':') + 1) : undefined;
} else {
    databaseConfig.host = process.env.DB_HOSTNAME;
    databaseConfig.database = process.env.DB_NAME;
    databaseConfig.user = process.env.DB_USERNAME;
    databaseConfig.password = process.env.DB_PASSWORD;
}

export default databaseConfig;
