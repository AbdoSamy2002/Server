const router=require('express').Router();
const conn=require('../DB/DataBaseConn');
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const { query } = require('express');
const {body,validationResult}=require('express-validator')
const util=require('util'); //Helper Function

router.get('/register', async (req, res) => {
    const query = util.promisify(conn.query).bind(conn)
    const All = await query('select * from user')
    res.json(All)


})

router.post('/login',


async (req,res)=>{
    try {
       
         //check IF Email Exist
            const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
            const userData = await query("select * from user where email= ?", [req.body.email]);
            if (userData.length == 0) {
                return res.status(404).json({
                    errors: [{
                        "msg": "Email Or Password Not Found !"
                    }]
                })
            }
            //comapare Hashed Password
             const checkPasswordTrue=await bcrypt.compare(req.body.password,userData[0].password);
             if(checkPasswordTrue){
                delete userData[0].password
                res.status(200).json(userData[0]);
             }else{
                return res.status(404).json({
                    errors: [{
                        "msg": "Email Or Password Not Found !"
                    }]
                })
             }
        

        
    } catch (err) {
        res.status(500).json({ err: err })

    }
});


router.post('/register',

async (req,res)=>{
    try {
        
       
         
            const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
            const checkEmailExist = await query("select * from user where email= ?", [req.body.email]);
            if (checkEmailExist.length > 0) {
                return res.status(404).json({
                    errors: [{
                        "msg": "email is Exist please change Your Email"
                    }]
                })
            }
              // Add UserID Dynamic
             
          
            const userObj = {
                userID: req.body.userID,
                userName: req.body.userName,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                phone: req.body.phone,
                status: req.body.status,
                type:req.body.type,
                token: crypto.randomBytes(16).toString("hex")
            }
       
            await query('insert into user set  ? ', userObj);

            delete userObj.password;
            return res.status(200).json(userObj);
        

    } catch (err) {
        res.status(500).json({ err: err })

    }
});


module.exports=router;