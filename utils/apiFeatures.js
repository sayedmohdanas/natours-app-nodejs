class ApiFeatures {
    constructor(query, queryString) {
      console.log('call ');
      this.query = query;
      this.queryString = queryString;
    }
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['sort', 'page', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
      console.log({excludedFields})
      // 1B Advance Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/, (match) => `$${match}`);
      this.query.find(JSON.parse(queryStr));
     
      return this;
    }
    sort() {
      console.log('hello from sort features');
  
      if (this.queryString.sort) {
        console.log('hello from sort features');
        const sortBy = this.queryString.sort.split(',').join(' ');
  
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
    limitField() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-_v');
      }
      return this;
    }
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }
  module.exports= ApiFeatures;