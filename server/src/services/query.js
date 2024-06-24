const DEFAULT_PAGE_LIMIT = 0; // if pass 0 as a limit mongo understands it as all documents to return

function getPagination(query) {
    const page = Math.abs(query.page) || 1;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;
    return {skip, limit};
};


module.exports = {getPagination};