export const globalActions = {
    define: process.env.SLASH_COMMAND_DEFINE as string || 'define',
};

export const blockActions = {
    addATerm: 'addATerm',
    searchForTerm: 'searchForTerm',
    searchOrAdd: 'searchOrAdd',
    clearMessage: 'clearMessage',
    termOverflowMenu: 'termOverflowMenu',
    searchTypeahead: 'searchTypeahead'
};

export const optionValues = {
    updateTerm: 'updateTerm',
    removeTerm: 'removeTerm',
    revisionHistory: 'revisionHistory'
}