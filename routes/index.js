
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Bingo' });
};
exports.game = function(req,res){
    res.render('game');
}
exports.register=function(req,res){
    res.render('register');
}
