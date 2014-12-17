var mongoose = require('mongoose');

module.exports = mongoose.model('Comment', {
  courseID: {type : String, default: ''},
  mark: {type : Number, default: 0},
  comment: {type : String, default: ''}
});
