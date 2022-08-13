function dataPagination(match, sort, page = 1, limit = 10, join = false) {
  const aggregate = [{ $match: match }];
  let data = [];
  data.push({ $sort: sort });
  if (page > 1) {
    let skip = (page - 1) * limit;
    data.push({ $skip: skip });
  }
  data.push({ $limit: limit });
  if (join) {
    join.forEach((item) => data.push(item));
  }
  aggregate.push({ $facet: { data } });
  return aggregate;
}

function handlePagination(data) {
  if (data.metadata && data.metadata.length > 0) {
    data.metadata = data.metadata[0];
  }
  if (!data.metadata || data.metadata.length === 0) {
    data.metadata = false;
  }
  return data;
}
module.exports = {
  dataPagination,
  handlePagination,
};
