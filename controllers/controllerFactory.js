const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/APIFeatures');

// Factory function that returns a generic handler to create a single document
exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc
      }
    });
  });

// Factory function that returns a generic handler to update a single document
exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const docID = req.params.id;

    const doc = await Model.findByIdAndUpdate(docID, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

// Factory function that returns a generic handler to delete a single document
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const docID = req.params.id;
    const doc = await Model.findByIdAndDelete(docID);

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

/*
Factory function that returns a generic handler to fetch a single document
  -can accept options object specifying the fields to be populated
  object structure example { path: 'reviews', select?: 'name' }
*/
exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const docID = req.params.id;
    let query = Model.findById(docID);

    // If populateOptions is provided will be added to the query
    if (populateOptions) query = query.populate(populateOptions);

    // Execute the query
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }

    // Send response
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

/*
Factory function that returns a generic handler to fetch all document from given collection
  - this function will take into account all applicable queries sent through the req.query and
  will apply them to the db query
*/
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {

    // Build the query
    const features = new APIFeatures(Model.find(), req.query);
    features
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query
    const docs = await features.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });
  });

// Factory function that returns a generic handler to get the documents count in a collection
exports.getCount = (Model) =>
  catchAsync(async (req, res, next) => {
    const docsCount = await Model.countDocuments();

    res.status(200).json({
      status: 'success',
      count: docsCount
    });
  });