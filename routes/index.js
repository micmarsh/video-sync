
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Video Sync. n00bs' });
};