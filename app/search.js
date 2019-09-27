var connection = require('../Database/configDB.js');
module.exports = function(app) {
    let searchUser;
    let nrRz;
    let AnonimUsr;
    let user;
    app.get('/profile/search', (req, res) => {
        searchUser = [];
        nrRz = 0;
        AnonimUsr = [];
        user = req.user;
        res.render('search.ejs', {
            user: user,
            message: 'Hi!',
            searchUser: searchUser,
            nrRz: nrRz,
            AnonimUsr: AnonimUsr
        });
    });

    app.post('/profile/search', (req, res) => {
        
        let qry = "Select username from User where " + 
                  "username = " + '\''+req.body.username+'\'' +
                  "OR username LIKE '%" + req.body.username+'\'' +
                  "OR username LIKE '%" + req.body.username+'%\'' +
                  "OR username LIKE '" + req.body.username+'%\'' +';';

        connection.query(qry, function(err, rez) {
            if(err) {
                console.log(err);
                return err;
            }

            if(rez[0]) {
                let newQ = "Select COUNT(*) AS NR from User where  " +
                "username = " + '\''+req.body.username+'\'' +
                "OR username LIKE '%" + req.body.username+'\'' +
                "OR username LIKE '%" + req.body.username+'%\'' +
                "OR username LIKE '" + req.body.username+'%\'' +';';

                connection.query(newQ, function(err, rezN) {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    AnonimUsr = [];
                    searchUser = rez;
                    nrRz = rezN[0].NR;
                    res.render('search.ejs', {
                     user: user,
                     message: 'No user!!',
                     searchUser: searchUser,
                     nrRz: nrRz,
                     AnonimUsr: AnonimUsr
                    }); });

            } else {
                searchUser = [];
                nrRz = 0;
                AnonimUsr = [];
                res.render('search.ejs', {
                 user: user,
                 message: 'No user!!',
                 searchUser: searchUser,
                 nrRz: nrRz,
                 AnonimUsr: AnonimUsr
                });
            }

        });

    });

    
    let message;
    let qryIMG;
    let index = 0;
    let nrPhotos;
    let nameAnonim;
    let nrComments;
    let comments;
    let like;
    let nrLikes;


    app.post('/profile/search/user', (req, res) => {
        console.log( req.body.rez+ "|------------");
        nameAnonim = req.body.rez;
        /*let sqlQry = "Select Photos.id, Photos.image_url, Photos.user_id from Photos inner join User on  User.id = Photos.user_id Where "+
                    "User.username = " + '\''+req.body.rez+'\';';*/

        let sqlQry = "Select  Photos.id, Photos.image_url, Photos.user_id  from Photos, User Where  "+
                    "Photos.user_id = User.id AND User.username = " + '\''+nameAnonim+'\'' + 
                    " ORDER BY (SELECT COUNT(*) FROM Likes WHERE Likes.photo_id = Photos.id) DESC, "+
                    " Photos.created_at DESC;";
        connection.query(sqlQry, function(err, rez) {
            if(err) {
                console.log(err);
                return err;
            }
            
            if(rez[0] == undefined) {

                 user = user;
                 message = 'Welcome to picture center!';
                 qryIMG = [];
                 index = -1;
                 nrPhotos = 0;
                 nrComments = 0;
                 comments = [];
                res.render('showImgAnonim.ejs', { 
                    user: user,
                    message: message,
                    qryIMG: qryIMG,
                    index: index,
                    nrPhotos: nrPhotos,
                    nameAnonim: nameAnonim,
                    nrComments: nrComments,
                    comments: comments,
                    like: like,
                    nrLikes: nrLikes
                 }); 

            } else {


                     connection.query("Select * from Likes where photo_id = " +rez[0].id+
                                 " AND user_id = " + '\''+req.user.id+'\';', function(err, rezExistLike){
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezExistLike[0]) {
                        like = 1;
                    } else {
                        like = 0;
                    }
                connection.query("Select COUNT(*) AS NR from Likes where photo_id = " +rez[0].id+";",
                                 function(err, rezNRLikes) {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezNRLikes[0]) {
                        nrLikes = rezNRLikes[0].NR;
                    } else {
                        nrLikes = 0;
                    }



                console.log("--------------------");
            console.log(rez[0].image_url);
            console.log("========================");
            console.log("UsrID ananan0---------------------");
                    console.log(rez[0].id);
                    console.log("UsrID ananan0---------------------");
                let newQ = "Select Count(*) as NR from Photos inner join User on  User.id = Photos.user_id Where "+
                "User.username = " + '\''+req.body.rez+'\';';
                connection.query(newQ, function(err, rezNQ) {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    /*
                    user = req.user;
                    message = 'Welcome to picture center my frends!'
                    qryIMG = rez;
                    index = 0;
                    nrPhotos = rezNQ[0].NR;
                    
                    res.render('showImgAnonim.ejs', { 
                        user: user,
                        message: message,
                        qryIMG: qryIMG,
                        index: index,
                        nrPhotos: nrPhotos,
                        nameAnonim: nameAnonim
                     }); */
                     
                     let qryPC =  "Select Comments.comment_text, User.username from Photos, Comments, User Where User.id = Comments.user_id AND  "+
                    "Photos.id = Comments.photo_id AND  Photos.id = " +rez[0].id+" ORDER BY Comments.created_at DESC;";
                    connection.query(qryPC, function(err, rezPC) {
                        if(err) {
                            console.log(err);
                            return err;
                        }
                        if(rezPC[0]) {

                            let qryPCNR =  "Select COUNT(*) AS NR from Photos, Comments, User Where User.id = Comments.user_id AND  "+
                            "Photos.id = Comments.photo_id AND  Photos.id = " +rez[0].id+";";
                            connection.query(qryPCNR, function(err, rezPCNR) {
                                if(err) {
                                    console.log(err);
                                    return err;
                                } 
                               
                                message = 'Welcome to picture center my frends!'
                                qryIMG = rez;
                                index = 0;
                                nrPhotos = rezNQ[0].NR;
                                nrComments = rezPCNR[0].NR;
                                comments = rezPC;
                                res.render('showImgAnonim.ejs', { 
                                    user: user,
                                    message: message,
                                    qryIMG: qryIMG,
                                    index: index,
                                    nrPhotos: nrPhotos,
                                    nameAnonim: nameAnonim,
                                    nrComments: nrComments,
                                    comments: comments,
                                    like: like,
                                    nrLikes: nrLikes
                                });
                            })
                        } else {
                            
                            message = 'Welcome to picture center my frends!'
                            qryIMG = rez;
                            index = 0;
                            nrPhotos = rezNQ[0].NR;
                            nrComments = 0;
                            comments = [];
                            res.render('showImgAnonim.ejs', { 
                                user: user,
                                message: message,
                                qryIMG: qryIMG,
                                index: index,
                                nrPhotos: nrPhotos,
                                nameAnonim: nameAnonim,
                                nrComments: nrComments,
                                comments: comments,
                                like: like,
                                nrLikes: nrLikes
                             });
                        }
                    });
                     

                }); });});

            }
        });
    }); 

    app.get('/profile/search/user/showPhotosAnonim/nextImg', (req, res) => {
        index = index == -1 ? -1 : index < nrPhotos - 1 ? index + 1 : 0 ;
        console.log("NrPhotots |" + nrPhotos + "|-------------------");
        if(index == -1) {

        res.render('showImgAnonim.ejs', { 
            user: user,
            message: message,
            qryIMG: qryIMG,
            index: index = index == -1 ? -1 : index < nrPhotos - 1 ? index + 1 : 0,
            nrPhotos: nrPhotos,
            nameAnonim: nameAnonim,
            nrComments: nrComments,
            comments: comments,
            like: like,
            nrLikes: nrLikes
            
         }); } else {
             connection.query("Select * from Likes where photo_id = " +qryIMG[index].id+
                                 " AND user_id = " + '\''+user.id+'\';', function(err, rezExistLike){
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezExistLike[0]) {
                        like = 1;
                    } else {
                        like = 0;
                    }
                connection.query("Select COUNT(*) AS NR from Likes where photo_id = " +qryIMG[index].id+";",
                                 function(err, rezNRLikes) {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezNRLikes[0]) {
                        nrLikes = rezNRLikes[0].NR;
                    } else {
                        nrLikes = 0;
                    }
            console.log("NrPhoPhoto id next : tots |" + qryIMG[index].id + "|-------------------");
            let qryPC =  "Select Comments.comment_text, User.username from Photos, Comments, User Where User.id = Comments.user_id AND  "+
            "Photos.id = Comments.photo_id AND  Photos.id = " +qryIMG[index].id+" ORDER BY Comments.created_at DESC;";
            connection.query(qryPC, function(err, rezPC) {
                if(err) {
                    console.log(err);
                    return err;
                }
                if(rezPC[0]) {

                    let qryPCNR =  "Select COUNT(*) AS NR from Photos, Comments, User Where User.id = Comments.user_id AND  "+
                    "Photos.id = Comments.photo_id AND  Photos.id = " +qryIMG[index].id+";";
                    connection.query(qryPCNR, function(err, rezPCNR) {
                        if(err) {
                            console.log(err);
                            return err;
                        } 
                       
                        message = 'Welcome to picture center my frends!'
                        qryIMG = qryIMG;
                        index = index;
                        nrPhotos = nrPhotos;
                        nrComments = rezPCNR[0].NR;
                        comments = rezPC;
                        res.render('showImgAnonim.ejs', { 
                            user: user,
                            message: message,
                            qryIMG: qryIMG,
                            index: index,
                            nrPhotos: nrPhotos,
                            nameAnonim: nameAnonim,
                            nrComments: nrComments,
                            comments: comments,
                            like: like,
                            nrLikes: nrLikes
                        });
                    })
                } else {
                    
                    message = 'Welcome to picture center my frends!'
                    qryIMG = qryIMG;
                    index = index;
                    nrPhotos = nrPhotos;
                    nrComments = 0;
                    comments = [];
                    res.render('showImgAnonim.ejs', { 
                        user: user,
                        message: message,
                        qryIMG: qryIMG,
                        index: index,
                        nrPhotos: nrPhotos,
                        nameAnonim: nameAnonim,
                        nrComments: nrComments,
                        comments: comments,
                        like: like,
                        nrLikes: nrLikes
                     });
                }
            });});});
         }
    });

    app.get('/profile/search/user/showPhotosAnonim/lastImg', (req, res) => {
       index = index == -1 ? -1 : index > 0 ? index - 1 : nrPhotos - 1 ;
       if(index == -1) {
        res.render('showImgAnonim.ejs', { 
            user: user,
            message: 'Welcome to picture center my frends!',
            qryIMG: qryIMG,
            index: index = index == -1 ? -1 : index > 0 ? index - 1 : nrPhotos - 1,
            nrPhotos: nrPhotos,
            nameAnonim: nameAnonim,
            nrComments: nrComments,
            comments: comments,
            like: like,
            nrLikes: nrLikes
         }); } else {
              connection.query("Select * from Likes where photo_id = " +qryIMG[index].id+
                                 " AND user_id = " + '\''+user.id+'\';', function(err, rezExistLike){
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezExistLike[0]) {
                        like = 1;
                    } else {
                        like = 0;
                    }
                connection.query("Select COUNT(*) AS NR from Likes where photo_id = " +qryIMG[index].id+";",
                                 function(err, rezNRLikes) {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezNRLikes[0]) {
                        nrLikes = rezNRLikes[0].NR;
                    } else {
                        nrLikes = 0;
                    }
            let qryPC =  "Select Comments.comment_text, User.username from Photos, Comments, User Where User.id = Comments.user_id AND  "+
            "Photos.id = Comments.photo_id AND  Photos.id = " +qryIMG[index].id+" ORDER BY Comments.created_at DESC;";
            connection.query(qryPC, function(err, rezPC) {
                if(err) {
                    console.log(err);
                    return err;
                }
                if(rezPC[0]) {

                    let qryPCNR =  "Select COUNT(*) AS NR from Photos, Comments, User Where User.id = Comments.user_id AND  "+
                    "Photos.id = Comments.photo_id AND  Photos.id = " +qryIMG[index].id+";";
                    connection.query(qryPCNR, function(err, rezPCNR) {
                        if(err) {
                            console.log(err);
                            return err;
                        } 
                       
                        message = 'Welcome to picture center my frends!'
                        qryIMG = qryIMG;
                        index = index;
                        nrPhotos = nrPhotos;
                        nrComments = rezPCNR[0].NR;
                        comments = rezPC;
                        res.render('showImgAnonim.ejs', { 
                            user: user,
                            message: message,
                            qryIMG: qryIMG,
                            index: index,
                            nrPhotos: nrPhotos,
                            nameAnonim: nameAnonim,
                            nrComments: nrComments,
                            comments: comments,
                            like: like,
                            nrLikes: nrLikes
                        });
                    })
                } else {
                    
                    message = 'Welcome to picture center my frends!'
                    qryIMG = qryIMG;
                    index = index;
                    nrPhotos = nrPhotos;
                    nrComments = 0;
                    comments = [];
                    res.render('showImgAnonim.ejs', { 
                        user: user,
                        message: message,
                        qryIMG: qryIMG,
                        index: index,
                        nrPhotos: nrPhotos,
                        nameAnonim: nameAnonim,
                        nrComments: nrComments,
                        comments: comments,
                        like: like,
                        nrLikes: nrLikes
                     });
                }
            }); });});
         }
    });

    app.post('/profile/search/user/showPhotosAnonim/comment', (req, res) => {
        let sqlQ = "INSERT INTO Comments (comment_text, user_id, photo_id) " +
        "VALUES(" + '\'' + req.body.comments + '\','+
         user.id + "," + qryIMG[index].id + ");";
         console.log("Userid-------------------------------");
         console.log(user.id);
         console.log("Userid-------------------------------");
         connection.query(sqlQ, function(err, rezMain) {
            if(err) {
                console.log(err);
                return err;
            }
            
        let sqlQry = "Select Photos.id, Photos.image_url, Photos.user_id  from Photos inner join User on  User.id = Photos.user_id Where "+
                    "User.username = " + '\''+nameAnonim+'\';';
        connection.query(sqlQry, function(err, rez) {
            if(err) {
                console.log(err);
                return err;
            }
            
            if(rez[0] == undefined) {

              
                 message = 'Welcome to picture center!';
                 qryIMG = [];
                 index = -1;
                 nrPhotos = 0;
                 nrComments = 0;
                 comments = [];
                res.render('showImgAnonim.ejs', { 
               
                    message: message,
                    qryIMG: qryIMG,
                    index: index,
                    nrPhotos: nrPhotos,
                    nameAnonim: nameAnonim,
                    nrComments: nrComments,
                    comments: comments,
                    like: like,
                    nrLikes: nrLikes
                 }); 

            } else {
                console.log("--------------------");
            console.log(rez[0].image_url);
            console.log("========================");
                let newQ = "Select Count(*) as NR from Photos inner join User on  User.id = Photos.user_id Where "+
                "User.username = " + '\''+nameAnonim+'\';';
                connection.query(newQ, function(err, rezNQ) {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    /*
                    user = req.user;
                    message = 'Welcome to picture center my frends!'
                    qryIMG = rez;
                    index = 0;
                    nrPhotos = rezNQ[0].NR;
                    
                    res.render('showImgAnonim.ejs', { 
                        user: user,
                        message: message,
                        qryIMG: qryIMG,
                        index: index,
                        nrPhotos: nrPhotos,
                        nameAnonim: nameAnonim
                     }); */

                     let qryPC =  "Select Comments.comment_text, User.username from Photos, Comments, User Where User.id = Comments.user_id AND "+
                    "Photos.id = Comments.photo_id AND  Photos.id = " +qryIMG[index].id+" ORDER BY Comments.created_at DESC;";
                    connection.query(qryPC, function(err, rezPC) {
                        if(err) {
                            console.log(err);
                            return err;
                        }
                        if(rezPC[0]) {

                            let qryPCNR =  "Select COUNT(*) AS NR from Photos, Comments, User Where User.id = Comments.user_id AND "+
                            "Photos.id = Comments.photo_id AND  Photos.id = " +qryIMG[index].id+";";
                            connection.query(qryPCNR, function(err, rezPCNR) {
                                if(err) {
                                    console.log(err);
                                    return err;
                                } 
                           
                                console.log("Users all-------------------");
                                console.log(rezPC);
                                console.log("Users all-------------------");
                                message = 'Welcome to picture center my frends!'
                                qryIMG = rez;
                                index = index;
                                nrPhotos = rezNQ[0].NR;
                                nrComments = rezPCNR[0].NR;
                                comments = rezPC;
                                res.render('showImgAnonim.ejs', { 
                                    user: user,
                                    message: message,
                                    qryIMG: qryIMG,
                                    index: index,
                                    nrPhotos: nrPhotos,
                                    nameAnonim: nameAnonim,
                                    nrComments: nrComments,
                                    comments: comments,
                                    like: like,
                                    nrLikes: nrLikes
                                });
                            })
                        } else {
                      
                            message = 'Welcome to picture center my frends!'
                            qryIMG = rez;
                            index = index;
                            nrPhotos = rezNQ[0].NR;
                            nrComments = 0;
                            comments = [];
                            res.render('showImgAnonim.ejs', { 
                                user: user,
                                message: message,
                                qryIMG: qryIMG,
                                index: index,
                                nrPhotos: nrPhotos,
                                nameAnonim: nameAnonim,
                                nrComments: nrComments,
                                comments: comments,
                                like: like,
                                nrLikes: nrLikes
                             });
                        }
                    });
                     

                });

            }
        });
         });
    });




    app.get('/profile/search/user/showPhotosAnonim/like', (req, res) => {
        let sqlLike = "INSERT INTO Likes (user_id, photo_id) "+
                      "VALUES(" + user.id + "," + qryIMG[index].id + ");";
        connection.query(sqlLike, function(err, rezILike) {
            if(err) {
                console.log(err);
                return err;
            } 

            connection.query("Select * from Likes where photo_id = " +qryIMG[index].id+
                                 " AND user_id = " + '\''+user.id+'\';', function(err, rezExistLike){
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezExistLike[0]) {
                        like = 1;
                    } else {
                        like = 0;
                    }
                connection.query("Select COUNT(*) AS NR from Likes where photo_id = " +qryIMG[index].id+";",
                                 function(err, rezNRLikes) {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezNRLikes[0]) {
                        nrLikes = rezNRLikes[0].NR;
                    } else {
                        nrLikes = 0;
                    }


                    res.render('showImgAnonim.ejs', { 
                        user: user,
                        message: 'Welcome to picture center my frends!',
                        qryIMG: qryIMG,
                        index: index,
                        nrPhotos: nrPhotos,
                        nameAnonim: nameAnonim,
                        nrComments: nrComments,
                        comments: comments ,
                        like: like,
                        nrLikes: nrLikes
                     }); 
                });});

        });
    });

    app.get('/profile/search/user/showPhotosAnonim/disLike', (req, res) => {
        let sqlLike = "DELETE FROM  Likes WHERE  "+
                      "user_id = " + user.id + " AND photo_id = " + qryIMG[index].id + ";";
        connection.query(sqlLike, function(err, rezILike) {
            if(err) {
                console.log(err);
                return err;
            } 

            connection.query("Select * from Likes where photo_id = " +qryIMG[index].id+
                                 " AND user_id = " + '\''+user.id+'\';', function(err, rezExistLike){
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezExistLike[0]) {
                        like = 1;
                    } else {
                        like = 0;
                    }
                connection.query("Select COUNT(*) AS NR from Likes where photo_id = " +qryIMG[index].id+";",
                                 function(err, rezNRLikes) {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    if(rezNRLikes[0]) {
                        nrLikes = rezNRLikes[0].NR;
                    } else {
                        nrLikes = 0;
                    }


                    res.render('showImgAnonim.ejs', { 
                        user: user,
                        message: 'Welcome to picture center my frends!',
                        qryIMG: qryIMG,
                        index: index ,
                        nrPhotos: nrPhotos,
                        nameAnonim: nameAnonim,
                        nrComments: nrComments,
                        comments: comments ,
                        like: like,
                        nrLikes: nrLikes
                     }); 
                });});

        });
    });
};