var mongoose = require('mongoose');
var User = require('./models/user');
var Course = require('./models/course');
var Comment = require('./models/comment');

module.exports = function(app, passport) {
  //Routes for login and signup ================================================
  app.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send({ success : false, message : info.message });
      }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
          return res.send({success : true});
      });
    })(req, res, next);
  });

  app.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send({ success : false, message : info.message });
      }
      req.logIn(user, function(err) {
        if (err)
          return next(err);
        return res.send({success : true});
      });
    })(req, res, next);
  });

  //Route for checking if user is logged in ====================================
  app.get('/loggedin', function(req, res) {
    res.json(req.isAuthenticated() ? req.user.toJSON() : '0');
  });

  //Route for logout ===========================================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.json({message :"Logout OK"});
  });

  //API routes =================================================================
  app.get('/api/courses', function(req, res) {
    Course.find({'school': req.user.local.school}, function(err, courses) {
      if(err)
        return res.json(err);
      if(!courses)
        return res.json({success: false, message: 'No course have been created yet for your school'});
      else
        return res.json({success: true, courses: courses});
    });
  });

  app.post('/api/course', function(req, res) {
    Course.findOne({'name': req.body.name, 'school': req.user.local.school}, function(err, course) {
      if(err)
        return res.json(err);
      if(course)
        return res.json({success: false, message: 'This course has already be created !!!'});
      else
        var newCourse = new Course();
        newCourse.name = req.body.name;
        newCourse.school = req.user.local.school;

        newCourse.save(function(err) {
          if(err)
            return res.json(err);
          return res.json({success: true, message: 'Successful creation !!!'});
        });
    });
  });

  app.get('/api/comments', function(req, res) {
    Comment.find(function(err, comments) {
      if(err)
        return res.json(err);
      if(!comments)
        return res.json({success: false, message: 'Sorry, no comments have been posted yet !!!'});
      else
        return res.json({success: true, comments: comments});
    });
  });

  app.get('/api/comments/:courseID', function(req, res) {
    Comment.find({'courseID': req.params.courseID},function(err, comments) {
      if(err)
        return res.json(err);
      if(!comments)
        return res.json({success: false, message: 'Sorry, no comments have been posted yet !!!'});
      else
        return res.json({success: true, comments: comments});
    });
  });

  app.post('/api/comments/:courseID', function(req, res) {
    Course.findById(req.params.courseID, function(err, course) {
      if(err)
        return res.json(err);
      if(!course)
        return res.json({success:false, message: 'Sorry but this course does not exist !!!'});
      if(course)
        var newComment = new Comment();
        newComment.courseID = course._id;
        newComment.comment = req.body.comment;
        newComment.mark = req.body.mark;

        newComment.save(function(err) {
          if(err)
            return res.json(err);
          return res.json({success: true, message: 'Successful creation !!!'});
        });
    });
  });
}
