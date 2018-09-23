const express = require('express');
//'router' is a variable and RHS router is a method name
const router=express.Router();

router.get('/test', (req,res) => res.json({msg: 'Posts route worked!'}));

module.exports = router;