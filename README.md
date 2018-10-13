# User-API

USER API is used for sign up , login and data retrieval.It is intended primarily to assist application developers 
wishing to use an api for sign up , login and data retrieval operations in their applications or websites. 
JWT (JSON Web Tokens) are used for Authentication and AUthorization.

What's available:

This api provides 5 kinds of operations: **SignUp** which is used for account registration, 
**Login** which is used for login in to the account, 
**Data Retrieval** for retrieving the account specific details,
**Update Data** for updating user's profile data.

**Register a User**

Post /users.   
Accept: application/json.  
Content-Type: application/json.   
       
{.  
    "name":"user1",  
    "password":"123456"           
    "age":20,    
    "weight":"65",   
    "address":"charlotte"   
}.  
// All passwords will be encrypted before storing storing in database.

RESPONSE: HTTP 201 (Created).  

**User Login**

Post /login.   
Accept: application/json.  
Content-Type: application/json.   
       
{.  
    "name":"user1",    
    "password":"123456".   
}    

RESPONSE: HTTP 200 (Ok).  
Content : Security token. 

// Every JSON web token will have username included in it so that while getting user details we just pass the token.

**Retrieve User Details.** 

Get /users

Header : Authorization : json web token. 

Response: HTTP 200.  
Content: User Details.   

**Update User Details.**   

put /users.   
Accept: application/json.  
Header : Authorization : json web token.

Content-Type: application/json.   
       
{.       
    "password":"123456"  
    "age":29,    
    "weight":"55",   
    "address":"california"    
}.  

RESPONSE: HTTP 200 (ok). 
