const mysql=require('mysql');
const express=require('express');
var app=express();
const bodyparser=require('body-parser');
const jwt=require('jsonwebtoken');

app.use(bodyparser.json());

var mysqlConnection=mysql.createConnection(
{
    host:'localhost',
    user:'root',
    password:'Hydrogen@01',
    database:'EmployeeDB',
    multipleStatements:true
}
);

mysqlConnection.connect((err) =>{
    if(!err)
       console.log('DB connection succeded.');
    else
       console.log('DB connection failed \n Error : '+JSON.stringify(err, undefined, 2));
}
);

app.listen(3000,()=>console.log('Express server is running at port: 3000'));

//Get user details
app.get('/users',verifyToken,(req,res)=>{
    jwt.verify(req.token,'secretkey',(err,authData) =>{

        if (err){
            res.sendStatus(403);
        }
        else{

            mysqlConnection.query('SELECT * FROM user where username=?',authData.username,(err,rows,fields)=>{
                if(!err)
                 {
                 res.send(rows[0]);
              }
                else
                 console.log(err); 
          })
        }
    });

});



    //INSERT employees
    app.post('/users',(req,res)=>{
        var appData = {
            'error': 1,
            'data': ''
            };
    let user=req.body;        
    var sql="Insert into user (username,name,age,weight,address,passw) values(?,?,?,?,?,?);";
        mysqlConnection.query(sql, [user.username,user.name,user.age,user.weight,user.address,user.password],(err,rows,fields)=>{
            if (!err) {
                appData.error = 0;
                appData['data'] = 'User registered successfully!';
                res.status(201).json(appData);
                } else {
                appData['data'] = err;
                res.status(400).json(appData);
                }
                });
                });


    //UPDATE employees
    app.put('/users',verifyToken,(req,res)=>{
        var appData = {
            'error': 1,
            'data': ''
            };
        jwt.verify(req.token,'secretkey',(err,authData) =>{

            if (err){
                res.sendStatus(403);
            }
            else{
            let emp=req.body;        
            var sql="Update user set name=?, age=?,weight=?,address=?,passw=? where username=?;";
                mysqlConnection.query(sql, [emp.name,emp.age,emp.weight,emp.address,emp.password,authData.username],(err,rows,fields)=>{
                      if(!err)
                       {
                        appData.error = 0;
                        appData['data'] = 'User Updated successfully!';
                        res.status(201).json(appData);
                        } else {
                        appData['data'] = err;
                        res.status(400).json(appData);
                        }
                })
            }
                });
            });

//FORMAT OF TOKEN
//AUTHORIZATION:Bearer <access_token>

//Verify Token
function verifyToken(req,res,next){
//Get auth header value
const bearerHeader=req.headers['authorization'];
//CHECK IF Bearer is undefined
if(typeof bearerHeader!=='undefined')
{
    const bearer = bearerHeader.split(' ');
    const bearertoken = bearer[1];
    req.token=bearertoken;
    next();
}else{
 //FORBIDDEN
    res.sendStatus(403);
}};

app.post('/login',(req,res)=>{
    
    var appData = {
        'error': 1,
        'token': '',
        'username':''
        };
        var username = req.body.username;
        var password = req.body.password; 
        var sql="select * from user where username=?;";
                mysqlConnection.query(sql, [username],(err,rows,fields)=>{
                      if(!err)
                       {
                        if (rows.length > 0) {
                            if (rows[0].passw == password) {
                            token = jwt.sign(JSON.parse(JSON.stringify(rows[0])), 'secretkey', {
                            expiresIn: 5000
                            });
                            appData.error = 0;
                            appData['token'] = token;
                            appData['username'] = rows[0].username;
                            res.status(200).json(appData);
                            } else {
                            appData.error = 1;
                            appData['token'] = 'Email and Password does not match';
                            res.status(204).json(appData);
                            }
                            }
                    }
                      else
                       console.log(err); 
                });
        
        });