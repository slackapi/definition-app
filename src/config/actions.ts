export const globalActions = {
    define: process.env.SLASH_COMMAND_DEFINE as string || 'define',
};

export const blockActions = {
    add_a_term: 'add_a_term',
    search_for_term: 'search_for_term',
    search_or_add: 'search_or_add'
};