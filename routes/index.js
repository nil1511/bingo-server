
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Bingo' });
};
exports.bingo = function(req,res){
    res.render('bingo');
}
