import { addTokensTable } from "./build-scripts/create-tokens-table";
import { addDefinitionsTable } from "./build-scripts/create-definitions-table";
import { updateDefinitionLength } from "./build-scripts/update-definitions-length"
import { addTagsTable } from "./build-scripts/create-tags-table";
import { addTagsDefinitionsBridgeTable } from "./build-scripts/create-tags-definitions-table";

addTokensTable();
addDefinitionsTable();
updateDefinitionLength();
addTagsTable();
addTagsDefinitionsBridgeTable();