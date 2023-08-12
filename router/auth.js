const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const authenticate = require("../middleware/authenticatestudent")
const authenticate2 = require("../middleware/authenticatecompany")
const cookieParser =require("cookie-parser");
router.use(cookieParser());


require("../db/connection");
const User = require("../model/userSchema");
const User2 = require("../model/userSchema2");

//companysignup
router.post("/companysignup", async(req, res) => {

    const { name, email, phone, gstin, headquarter, companytype, otheremail, otherphone, password, cpassword } = req.body;

  if (!name || !email || !phone || !gstin || !companytype || !headquarter || !otheremail || !otherphone || !password || !cpassword) {
    return res.status(422).json({ error: "Plz fill all properties" });
  }

  try {
    const userExist = await User.findOne({ email: email })
        if (userExist) {
          return res.status(422).json({ error: "Email already exist" });
        }else if(password != cpassword){
          return res.status(422).json({ error: "Password not matching" });
        }else{
          const user = new User({name,email,phone,gstin,headquarter,companytype,otheremail,otherphone,password,cpassword,});
          // yaha par hashing kra hai maine
          await user.save();
          return res.status(201).json({ message: "user registered succuessfully" });
        }

  } catch (err) {
    console.log(err);
  }
});

//student signup
router.post("/studentsignup", async(req, res) => {
const { name, email, phone, profession, college, applyingfor, city, password, cpassword} = req.body;

if (!name || !email || !phone || !profession || !college || !applyingfor || !city || !password || !cpassword) {
  return res.status(422).json({ error: "Plz fill all properties" });
}

try {
    const userExist = await User2.findOne({ email: email })
        if (userExist) {
          return res.status(422).json({ error: "Email already exist" });
        }else if(password != cpassword){
          return res.status(422).json({ error: "Password not matching" });
        }else{
            const user = new User2({name,email,phone,profession,college, applyingfor,city, password,cpassword});
            // yaha par hashing kra hai maine
            await user.save();
            return res.status(201).json({ message: "user registered succuessfully" });
          }
  } catch (err) {
    console.log(err);
  }
});

//company login
router.post("/companylogin", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        let token;
        if (!email || !password) {
    	  return res.status(400).json({ error: "Plz fill all properties" });
	    }
	    const userLogin = await User.findOne({email:email});    	
    	if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            token = await userLogin.generateAuthToken();
            res.cookie("jwtokencomp" , token, {
                  expires:new Date(Date.now() + 25892000000),
                  httpOnly:true
              });
              
            if (!isMatch) {
                res.status(400).json({ message: "Invalid cred p" });
        	  } else {
        	    res.json({ message: "Login successful" });
           	    // console.log(userLogin);
              }
	    }else{ 
	        res.status(400).json({message:"Login not successful"})
    	    }
    	} catch (err) {}
    });

    //student login
    router.post("/studentlogin", async (req, res) => {
        const { email, password } = req.body;
        try {
            let token;
            if (!email || !password) {
              return res.status(400).json({ error: "Plz fill all properties" });
            }
            const userLogin = await User2.findOne({email:email});
            
            if (userLogin) {
                const isMatch = await bcrypt.compare(password, userLogin.password);
                token = await userLogin.generateAuthToken();
                res.cookie("jwtoken" , token, {
                  expires:new Date(Date.now() + 25892000000),
                  httpOnly:true
              });
                if (!isMatch) {
                  res.status(400).json({ message: "Invalid cred p" });
                  } else {
                    res.json({ message: "Login successful" });
                  }
            }else{
                res.status(400).json({message:"Login not successful"})
                }
            } catch (err) {}
        });

        router.get("/companybutton", authenticate2, async(req,res) =>{
          res.send(req.rootUser);
        })

        router.get("/studentbutton", authenticate, async(req,res) =>{
          res.send(req.rootUser);
        })
        
        router.get("/companylist", authenticate, async(req,res) =>{
          const existData = await User.find({},{_id:0, name:1, email:2, phone:3, gstin:4, headquarter:5, companytype:6, otheremail:7, otherphone:8});
          let ans = [];
          let x = {...existData};
          let y = Object.values(x);
          y.forEach(z => {
            let xx = {};
            xx.name = z.name; xx.email = z.email; xx.phone = z.phone; xx.gstin = z.gstin;
            xx.headquarter = z.heaquarter; xx.companytype = z.companytype;
            xx.otheremail = z.otheremail; xx.otherphone = z.otherphone;
            ans.push(xx);
          });
           res.json(ans);
        })

        router.get("/studentlist", authenticate2, async(req,res) =>{
          const existData = await User2.find({},{_id:0, name:1, email:2, phone:3, profession:4, college:5, applyingfor:6, city:7});
          let ans = [];
          let x = {...existData};
          let y = Object.values(x);
          y.forEach(z => {
            let xx = {};
            xx.name = z.name; xx.email = z.email; xx.phone = z.phone; 
            xx.profession = z.profession;xx.college = z.college;
            xx.applyingfor = z.applyingfor; xx.city = z.city;
            ans.push(xx);
          });
           res.json(ans);
        })

        router.get("/studentprofile", authenticate, async(req,res) =>{
          res.send(req.rootUser);
        })

        router.get("/companyprofile", authenticate2, async(req,res) =>{
          res.send(req.rootUser);
        })

        router.get("/logoutstudent", async(req,res) =>{
          res.clearCookie('jwtoken' , {path: '/'});
          res.status(200).send('User Logged Out');
        })

        router.get("/logoutcompany", async(req,res) =>{
          res.clearCookie('jwtokencomp' , {path: '/'});
          res.status(200).send('User Logged Out');
        })

module.exports = router;
