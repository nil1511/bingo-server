
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Bingo',page:'index' });
};
exports.bingo = function(req,res){
    res.render('bingo',{page:'bingo'});
}
