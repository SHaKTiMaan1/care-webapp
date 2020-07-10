const router  	= express.Router();

    
router.get("/cwc", function(req, res){
    res.render("cwclanding.ejs");
});


router.get('/addChild',function(req, res){
    res.render("addChild.ejs");
});


router.post('/addChild', function(req, res){
    
});
  

router.get('/registered/:id/:name',function(req, res){
   
});


router.get('/details',function(req, res){
       
});


module.exports = router;