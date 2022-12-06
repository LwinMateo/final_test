var fs = require("fs");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");



var finalUsers = new Schema({
    "email" : {
        type : String,
        unique : true
    },
    "password" : String,

});

let F_User;

var students=[];
exports.startDB = ()=>{
   // console.log("Testing");
   /*return new Promise((resolve, reject)=>{
        fs.readFile("./students.json", (err, data)=>{
            if (err) {reject("unable to read file.");}
            students = JSON.parse(data);
           // console.log(students);
            resolve("File read success.");
        }); 
   });*/
    return new Promise(function (resolve, reject) {
        let finalDb = mongoose.createConnection("mongodb+srv://Lwin_Final:Lwintest4@test4.17bvq2i.mongodb.net/Test4", { useNewUrlParser : true});

        finalDb.on('error', (err)=> { 
            console.log("Cannot connect to DB.");
            reject(err);
        });

        finalDb.once('open', ()=>{
            F_User = finalDb.model("users", finalUsers);
            console.log("DB connection successful.");
            resolve();
        });
    });
};

exports.register = (user)=>{
    return new Promise(function (resolve, reject) {
        if(user.email.trim().length == 0 || user.password.trim().length == 0){
            reject("Error. email or password cannot be empty.");
        }else{
            bcrypt.genSalt(12, function(err, salt){
                bcrypt.hash(newData.password, salt, (er, hash) => {
                    if(er){
                        reject("There was an error encrypting the password");
                    }else{
                        user.password = hash;
                        let newUser = new F_User(user);

                        newUser.save((error, user) => {
                            if(error){
                                if(error.code === 11000){
                                    //let txt = `Error: ${user.email} already exists.`;
                                    reject("Error: ", user.email, " already exist.");
                                }
                                else{
                                    reject("Error: cannot create the user.");
                                }
                            }   
                            else{
                                resolve();
                            }
                        });
                    }
                });
            });
        }
    });
}

exports.signIn = (user) => {
    return new Promise(function (resolve, reject) {

        User.findOne({user : user.email}).exec().then(function(U){

            if(U.length > 0){
                bcrypt.compare(user.password, user[0].password)
                .then(function(res){
                    if(res === true){
                        //resolve(user[0]);
                       resolve(user)
                    }
                    else{
                        reject("Incorrect Password for user: ", user.email);
                    }
                });

            }
            else{
                reject("Cannot find user: " + user.email);
            }

        }).catch(function(err){
            reject("Cannot find user: " + user.email);
        });

    });
}