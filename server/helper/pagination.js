module.exports = {
  getPagination (page, size) {
    const limit = size ? +size : 2;
    const offset = page ? page * limit : 0;
  
    return { limit, offset };
  },
  
  getPagingData (data, page, limit) {
    const { count: totalItems, rows: needs } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
  
    return { totalItems, needs, totalPages, currentPage };
  },
};