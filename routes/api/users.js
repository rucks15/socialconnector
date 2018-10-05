const express = require('express');
//'router' is a variable and RHS router is a method name
const router=express.Router();
const User = require('../../models/user');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../keys');
const passport = require('passport');

router.get('/test', (req,res) => res.json({msg: 'Users route worked!'}));

// @route  POST api/users/register
// @desc   Register user
// @access Public
router.post('/register', (req,res) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user){
            return res.status(400).json({email: 'Email already exists'});
        }
        else{
            const avatar = gravatar.url(req.body.email,{
                s: '200', //size
                r: 'pg',  //rating
                d: 'mm'
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar, //similar to avatar(schema): avatar(local variable)
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                if(err) throw err;
                bcrypt.hash(newUser.password, salt, (err,hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
                })
            });
        }
    })
})

// @route  POST api/users/login
// @desc   Login User / Return a JWT(JSON Web Token) token
// @access Public
router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    //Here {email : email} is rewritten as email
    User.findOne({email})
    .then(user =>{
        //Check for user
        if(!user){
            return res.status(404).json({email:'User not found'});
        }

        //Check password
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(isMatch){
                //User Matched (Make a 'payload' using id and email and pic to make it unique)
                const payload = { id: user.id, name: user.name, avatar: user.avatar};
                //Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {expiresIn: 3600},
                    //call back
                    (err, token) => {
                        if(err) throw err;
                        res.json({
                            success: true,
                            token: 'Bearer token' + token
                        })
                    });
            }
            else{
                return res.status(400).json({password:'password incorrect'});
            }
        })
    })
})

// @route  GET api/users/login
// @desc   return current user
// @access Private/Protected

router.get('/current', passport.authenticate('jwt', {session: 
    false}),(req,res) => {
    res.json({message: 'success'});
});

module.exports = router;