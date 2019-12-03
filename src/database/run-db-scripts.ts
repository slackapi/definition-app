import { addTokensTable } from "./build-scripts/create-tokens-table";
import { addDefinitionsTable } from "./build-scripts/create-definitions-table";
import { updateDefinitionLength } from "./build-scripts/update-definitions-length"

addTokensTable();
addDefinitionsTable();
updateDefinitionLength();