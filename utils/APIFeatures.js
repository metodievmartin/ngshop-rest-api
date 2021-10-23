class APIFeatures {
  constructor(query, queryString) {
    // Mongoose query object
    this.query = query;
    // Request query object
    this.queryString = queryString;
  }

  // Allows you to narrow down your search by filtering the results
  filter() {
    // Copy the query string to not mutate the original object
    const queryObj = { ...this.queryString };

    // Create an array with the queryObj fields that are to be excluded
    // (they're not schema fields and are handled by the other methods)
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    // Remove those field from the queryObj
    excludeFields.forEach(el => delete queryObj[el]);

    // Check if querying by category - this will allow querying by multiple category IDs
    if (queryObj.category) {
      // Split to get all category IDs into one array
      const categoryIds = queryObj.category.split(',');

      // Assign the category IDs array to the query param so that if queried by multiple
      // category IDs the DB will find them and send response correctly
      queryObj.category = categoryIds;
    }

    // Stringify the queryObj into a queryString so that string operations can be performed on it
    let queryStr = JSON.stringify(queryObj);

    // Find mongoose operators and add a '$' symbol before each one to make them valid filter operators
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    console.log(queryStr);

    // Apply the queryObj to the db query filter
    this.query = this.query.find(JSON.parse(queryStr));

    // Allows method chaining
    return this;
  }

  // Allows you to sort the results
  sort() {
    if (this.queryString.sort) {
      // Extract all sorting criteria
      const sortBy = this.queryString.sort.split(',').join(' ');

      //Apply sorting criteria to the db query
      this.query = this.query.sort(sortBy);
    } else {
      // Default case - the newest will pop up first
      this.query = this.query.sort('-dateCreated');
    }

    return this;
  }

  // Allows you to choose which document fields to be selected
  limitFields() {
    if (this.queryString.fields) {
      // Extracting all fields in one string
      const fields = this.queryString.fields.split(',').join(' ');

      // Apply only the selected field to the db query
      this.query = this.query.select(fields);
    } else {
      // Default case - the entire doc is being sent without the '__v' field
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // Allows you to paginate the results by specifying the page number and the results per page
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 100;
    const skip = (page - 1) * limit;

    //Apply pagination criteria to the db query
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;