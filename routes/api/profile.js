const express = require('express');
//'router' is a variable and RHS router is a method name
const router=express.Router();
const mongoose = require('mongoose');
const passport=require('passport');

//Load Profile model
const Profile = require('../../models/profile');
const User = require('../../models/user');

//@route GET api/profile
//@desc GET current user profile
//@access private
router.get('/',passport.authenticate('jwt',{session:false}),
(req,res) => {
    let errors ={};
    Profile.findOne({user: req.user.id})
    .populate('user',['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile='There is no profile for the user';
            return res.status(404).json(errors);
        }
        res.json(profile);

    })
    .catch(err => res.status(400).json(err));
})

//@route POST api/profile
//@desc Create/Edit user profile
//@access private
router.post('/',passport.authenticate('jwt',{session:false}),
(req,res) => {
    //Get fields
    let errors = {};
    const profilefields = {};
    profilefields.user = req.user.id;
    if(req.body.handle) profilefields.handle = req.body.handle;
    if(req.body.company) profilefields.company = req.body.company;
    if(req.body.website) profilefields.website = req.body.website;
    if(req.body.location) profilefields.location = req.body.location;
    if(req.body.bio) profilefields.bio = req.body.bio;
    if(req.body.status) profilefields.status = req.body.status;
    if(req.body.githubusername) profilefields.githubusername = req.body.githubusername;

    //Skills - split into array
    if(typeof req.body.skills !== 'undefined'){
        profilefields.skills=req.body.skills.split(',');
    }
    //Social
    profilefields.social = {};
    if(req.body.youtube) profilefields.social.youtube = req.body.youtube;
    if(req.body.twitter) profilefields.social.twitter = req.body.twitter;
    if(req.body.facebook) profilefields.social.facebook = req.body.facebook;
    if(req.body.instagram) profilefields.social.instagram = req.body.instagram;
    if(req.body.linkedin) profilefields.social.linkedin = req.body.linkedin;

    Profile.findOne({user:req.user.id})
    .then(profile => {
        if(profile){
            //Update
            Profile.findByIdAndUpdate(
                {user: req.user.id},
                {$set:profilefields},
                {new : true}
            ).then(profile => res.json(profile));
        }
        else{
            //Create
            Profile.findOne({handle: profilefields.handle})
            .then(profile => {
                if(profile){
                    errors.handle = 'There is another profile with same handle';
                    return res.status(400).json(errors);
                }
                //Save Profile - create new entry in mongoose schema
                new Profile(profilefields)
                .save()
                .then(profile => res.json(profile));
            })
        }
    })

}
)
//@route GET api/profile/all
//@desc  GET all profiles
//@access Public

router.get('/all', (req, res) => {
    const errors = {};

    Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
        if(!profiles){
            errors.noprofile = 'There are no profiles';
            return res.status(404).json(errors);
        }

        res.json(profiles);
    })
    .catch(err => res.status(404).json({profile: 'There are no profiles'}));
})

//@route GET api/profile/handle/:handle (:handle means its a parameter in the url)
//@desc  GET profiles by handle
//@access Public

router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({handle: req.params.handle})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There are no profile for this user';
            return res.status(404).json(errors);
        }

        res.json(profile);
    })
    .catch(err => res.status(404).json(err));
})

//@route GET api/profile/user/:user_id (:handle means its a parameter in the url)
//@desc  GET profiles by user_id
//@access Public

router.get('/handle/:user_id', (req, res) => {
    const errors = {};

    Profile.findOne({user: req.params.user_id})
    .populate('user', ['name', 'avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There are no profile for this user';
            return res.status(404).json(errors);
        }

        res.json(profile);
    })
    .catch(err => res.status(404).json(err));
})

//@route POST api/profile/experience
//@desc  Add experience to profile
//@access Private

router.post('/experience', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {};

    Profile.findOne({user : req.user.id})
    .then(profile => {
        if(!profile)
        {
            errors.noprofile = 'There is no profile with this id';
            return res.status(404).json(errors);
        }
        const newExp = {
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            fromdate: req.body.from,
            todate: req.body.to,
            current: req.body.current,
            description: req.body.description
        };
        //Add experience to the top of the array using unshift
        profile.experience.unshift(newExp);
        profile.save().then(profile => res.json(profile));

    })
    .catch(err => res.status(404).json(err));
})

//@route DELETE api/profile/experience/:exp_id
//@desc  Delete experience from profile
//@access Private
router.delete('/experience/:exp_id', passport.authenticate('jwt',{session: false}),
(req,res) => {
    let errors={};
    Profile.findOne({user: req.user.id})
    .then(profile => {
        //get remove index
        const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

        if (removeIndex === -1){
            errors.experiencenotfound = 'Experience not found';
            return res.status(404).json(errors);
        }
        profile.experience.splice(removeIndex, 1);
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
})

module.exports = router;