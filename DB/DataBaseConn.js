const mysql=require('mysql');


const connection= mysql.createConnection({
host:'localhost',
user:'root',
password:"",
database:"pharmasy",
port:"3306",



})
const connect=async()=>{
const connect=new Promise((resolve,reject)=>{
connection.connect((err)=>{
    if(err){
        reject(true)
    }else{
        resolve(true)
    }
})
})

 await connect.then(
(resolve)=>{console.log("connect")},
(reject)=>{console.log("Not Connected")}
)
console .log('hallo')
 }
 connect();
// connection.connect((err)=>{
//     if (err){ 
//         throw err;
//     }else{
//     console.log("connect")
//     }
// })

module.exports=connection;