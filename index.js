
// ================== Intialize Express=================
const express=require('express');
const App=express();
const conn=require('./DB/DataBaseConn')
// =================== Global Midlle Ware================
App.use(express.json());
App.use(express.urlencoded({extended:true}));
const cors=require('cors');
App.use(cors());
// =================== Require Modules ================
const category=require('./Routes/category');
const Auth=require('./Routes/Auth');
const medicine=require('./Routes/medicine');
const requestmedicine=require('./Routes/RequestedMedicine');
const user=require('./Routes/user')
// ===================  [API EndPoints] ================
App.use('/category',category)
App.use('/Auth',Auth)
App.use('/medicine',medicine)
App.use('/reqMed',requestmedicine)
App.use('/user',user)
App.get('/',(req,res)=>{

res.send('Hallo world !')

})
App.listen(4000,'localhost',(res)=>{
    
    console.log(`server is Running on http://localhost:4000`);
})