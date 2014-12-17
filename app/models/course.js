var mongoose = require('mongoose');

module.exports = mongoose.model('Course', {
  name : {type : String, default: ''},
  school: {type : String, default: ''}
});
