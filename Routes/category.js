const router=require('express').Router();
const { query } = require('express');
const conn=require('../DB/DataBaseConn')
const {body,validationResult}=require('express-validator')
const util=require('util'); //Helper Function
const Authoried=require('../Middleware/authorize');
const Admin=require('../Middleware/admin');
// Admin [create,Update,delete,list]
//patient [list]
// Authoried
router.get('/',async (req,res)=>{
     try{
        const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
        let search="";
        if(req.query.search){
          search=`where categoryName LIKE '%${req.query.search}%' `
         
             }
        const category = await query(`select * from category ${search} `);
        if (category.length == 0) {
            return res.status(404).json({
                errors: [{
                    "msg": "No Category Until Now !"
                }]
            })
        }
        res.status(200).json(category)
    }
    catch(error){

        res.status(500).json({ error: error })
    }

})
// Admin,
router.post('/addCategory',async (req,res)=>{

const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
const checkcategryNameExist = await query("select * from category where categoryName= ?", [req.body.categoryName]);
if (checkcategryNameExist.length > 0) {
    return res.status(404).json({
        errors: [{
            "msg": "categoryName Is Already Exist"
        }]
    })
}



const categoryObj={
categoryID:req.body.categoryID,
categoryName:req.body.categoryName,
categoryDesc:req.body.categoryDesc
}


await query('insert into category set ?',categoryObj,(err,result)=>{
    if(err){
        return res.json("some thing is wrong")
    }else{
        res.json("Data Inserted")
    }
})




})
// Admin,
router.put('/EditCategory/:id',async (req,res)=>{
const categoryID=req.params.id;

const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
const checkcategryNameExist = await query("select * from category where categoryName= ?", [req.body.categoryName]);
if (checkcategryNameExist.length > 0) {
    return res.status(404).json({
        errors: [{
            "msg": "categoryName Is Already Exist"
        }]
    })
}

    await query(' update category set categoryName=?,categoryDesc=? where categoryID=?',
    [req.body.categoryName,req.body.categoryDesc,req.params.id],
    (err)=>{
        if(err){
            res.json({msg:err})
        }else{
            return res.status(200).json("DataUpdated")
        }
    })
})   
// Admin
router.delete('/deleteCategory/:id',async (req,res)=>{

const categoryID=req.params.id;
const query = util.promisify(conn.query).bind(conn)
 const resu=await query('delete from category  where categoryID=?',categoryID)

 if(resu.affectedRows=="0"){
    return res.status(404).json("Already Deleted")
}else{
  return res.status(200).json('Data Deleted')
}




})

router.get('/count',async (req,res)=>{

    const query = util.promisify(conn.query).bind(conn)
    const resu=await query('select categoryID from category ');
     if(resu.length>0){

       res.json(resu[resu.length-1].categoryID+1)

     }else{
        res.json(1)
     }



})
router.get('/categoryMedicine/:id',async(req,res)=>{
    const query = util.promisify(conn.query).bind(conn)
    const resu=await query(`select category.categoryName,medicine.categoryID,medicineID,medicineName,medcineDesc,price,expirationDate from medicine join category 
     on medicine.categoryID =category.categoryID  where category.categoryID=?`,req.params.id);
res.json({resu})
})




module.exports=router;
