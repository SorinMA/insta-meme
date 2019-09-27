var  connection = require('../Database/configDB.js');
module.exports = function(app) {
    let user;
    let message;
    let qryIMG;
    let index;
    let nrPhotos;
    let nrComments;
    let comments;
    let like;
    let nrLikes;

    app.get('/profile/showPhotos', (req, res) => {
        let sqlQry = "Select * from Photos Where  "+
                    "Photos.user_id = " + '\''+req.user.id+'\'' + 
                    " ORDER BY (SELECT COUNT(*) FROM Likes WHERE Likes.photo_id = Photos.id) DESC, "+
                    " Photos.created_at DESC;";
        connection.query(sqlQry, function(err, rez) {
            if(err) {
                console.log(err);
                return err;
            }
            
            if(rez[0] == undefined) {

                 user = req.user;
                 message = 'Welcome to picture center!';
                 qryIMG = [];
                 index = -1;
                 nrPhotos = 0;
                 nrComments = 0;
                 comments = [];
                res.render('showImg.ejs', { 
                    user: user,
                    message: message,
                    qryIMG: qryIMG,
                    index: index,
                    nrPhotos: nrPhotos,
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
                let newQ = "Select Count(*) as NR from Photos Where  "+
                "Photos.user_id = " + '\''+req.user.id+'\';';
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
                    nrComments = 0;
                    comments = [];
                    res.render('showImg.ejs', { 
                        user: user,
                        message: message,
                        qryIMG: qryIMG,
                        index: index,
                        nrPhotos: nrPhotos,
                        nrComments: nrComments,
                        comments = comments
                     }); 
                     */

                    let qryPC =  "Select * from Photos, Comments, User Where User.id = Comments.user_id AND "+
                    "Photos.id = Comments.photo_id AND  Photos.id = " +rez[0].id+
                    " ORDER BY Comments.created_at DESC;";
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
                                user = req.user;
                                message = 'Welcome to picture center my frends!'
                                qryIMG = rez;
                                index = 0;
                                nrPhotos = rezNQ[0].NR;
                                nrComments = rezPCNR[0].NR;
                                comments = rezPC;
                                res.render('showImg.ejs', { 
                                    user: user,
                                    message: message,
                                    qryIMG: qryIMG,
                                    index: index,
                                    nrPhotos: nrPhotos,
                                    nrComments: nrComments,
                                    comments: comments,
                                    like: like,
                                    nrLikes: nrLikes
                                });
                            })
                        } else {
                            user = req.user;
                            message = 'Welcome to picture center my frends!'
                            qryIMG = rez;
                            index = 0;
                            nrPhotos = rezNQ[0].NR;
                            nrComments = 0;
                            comments = [];
                            res.render('showImg.ejs', { 
                                user: user,
                                message: message,
                                qryIMG: qryIMG,
                                index: index,
                                nrPhotos: nrPhotos,
                                nrComments: nrComments,
                                comments: comments,
                                like: like,
                                nrLikes: nrLikes
                            });
                        }
                    });


                });
            });}); //--- de la like qry

            }
        });
    });

    app.get('/profile/showPhotos/nextImg', (req, res) => {
        index = (index == -1 ? -1 : index < nrPhotos - 1 ? index + 1 : 0 );
       
        if(index != -1 ) {
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
                    let qryPC =  "Select * from Photos, Comments, User Where User.id = Comments.user_id AND "+
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
                                user = req.user;
                                message = 'Welcome to picture center my frends!'
                                qryIMG = qryIMG;
                                index = index;
                                nrPhotos = nrPhotos;
                                nrComments = rezPCNR[0].NR;
                                comments = rezPC;
                                res.render('showImg.ejs', { 
                                    user: user,
                                    message: message,
                                    qryIMG: qryIMG,
                                    index: index,
                                    nrPhotos: nrPhotos,
                                    nrComments: nrComments,
                                    comments: comments,
                                    like: like,
                                    nrLikes: nrLikes
                                });
                            })
                        } else {
                            user = req.user;
                            message = 'Welcome to picture center my frends!'
                            qryIMG = qryIMG;
                            index = index;
                            nrPhotos = nrPhotos;
                            nrComments = 0;
                            comments = [];
                            res.render('showImg.ejs', { 
                                user: user,
                                message: message,
                                qryIMG: qryIMG,
                                index: index,
                                nrPhotos: nrPhotos,
                                nrComments: nrComments,
                                comments: comments,
                                like: like,
                                nrLikes: nrLikes
                            });
                        }
                    }); });});
        } else {
            res.render('showImg.ejs', { 
            user: user,
            message: 'Welcome to picture center my frends!',
            qryIMG: qryIMG,
            index: index = index == -1 ? -1 : index > 0 ? index - 1 : nrPhotos - 1,
            nrPhotos: nrPhotos,
            nrComments: nrComments,
            comments: comments ,
            like: like,
            nrLikes: nrLikes
         }); 
        }
 
    });

    app.get('/profile/showPhotos/lastImg', (req, res) => {
       console.log("Usename-----------------------");
       console.log(user.username)
       console.log("Usename+++++++++++++++++++");
       index = index == -1 ? -1 : index > 0 ? index - 1 : nrPhotos - 1 ;
       if(index != -1 ) {

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
        let qryPC =  "Select * from Photos, Comments, User Where User.id = Comments.user_id AND "+
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
                    user = req.user;
                    message = 'Welcome to picture center my frends!'
                    qryIMG = qryIMG;
                    index = index;
                    nrPhotos = nrPhotos;
                    nrComments = rezPCNR[0].NR;
                    comments = rezPC;
                    res.render('showImg.ejs', { 
                        user: user,
                        message: message,
                        qryIMG: qryIMG,
                        index: index,
                        nrPhotos: nrPhotos,
                        nrComments: nrComments,
                        comments: comments,
                        like: like,
                        nrLikes: nrLikes
                    });
                })
            } else {
                user = req.user;
                message = 'Welcome to picture center my frends!'
                qryIMG = qryIMG;
                index = index;
                nrPhotos = nrPhotos;
                nrComments = 0;
                comments = [];
                res.render('showImg.ejs', { 
                    user: user,
                    message: message,
                    qryIMG: qryIMG,
                    index: index,
                    nrPhotos: nrPhotos,
                    nrComments: nrComments,
                    comments: comments,
                    like: like,
                    nrLikes: nrLikes
                });
            }
        }); });});
    } else {
        res.render('showImg.ejs', { 
            user: user,
            message: 'Welcome to picture center my frends!',
            qryIMG: qryIMG,
            index: index = index == -1 ? -1 : index > 0 ? index - 1 : nrPhotos - 1,
            nrPhotos: nrPhotos,
            nrComments: nrComments,
            comments: comments ,
            like: like,
            nrLikes: nrLikes
         }); 
        }
    });

    app.get('/profile/showPhotos/like', (req, res) => {
        let sqlLike = "INSERT INTO Likes (user_id, photo_id) "+
                      "VALUES(" + user.id + "," + qryIMG[index].id + ");";
        connection.query(sqlLike, function(err, rezILike) {
            if(err) {
                console.log(err);
                return err;
            } 
            /*let sqlQry = "Select * from Photos Where  "+
                    "Photos.user_id = " + '\''+user.id+'\'' + 
                    " ORDER BY (SELECT COUNT(*) FROM Likes WHERE Likes.photo_id = Photos.id) DESC, "+
                    " Photos.created_at DESC;";
            connection.query(sqlQry, function(err, rezS) {
                if(err) {
                    console.log(err);
                    return err;
                }
            let sqlQryNewIndex = "Select COUNT(*) AS NR from Photos Where  "+
                "Photos.created_at >= (SELECT P.created_at FROM Photos P where " +
                "P.user_id = " + user.id +
                " AND P.id = " + qryIMG[index].id + ")" +
                " AND Photos.user_id = " + user.id + 
                " ORDER BY (SELECT COUNT(*) FROM Likes WHERE Likes.photo_id = Photos.id) DESC, "+
                " Photos.created_at DESC;";
            connection.query(sqlQryNewIndex, function(err, rezNRIND) { 
                if(err) {
                    console.log(err);
                    return err;
                }
            */
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
                    }/*
                    console.log("New index--------------------");
                    console.log(rezNRIND[0].NR - 1);
                    console.log("New index ==============");*/

                    res.render('showImg.ejs', { 
                        user: user,
                        message: 'Welcome to picture center my frends!',
                        qryIMG: /*rezS*/ qryIMG,
                        index: /*rezNRIND[0].NR == nrPhotos ? 0 : rezNRIND[0].NR - 1*/ index,
                        nrPhotos: nrPhotos,
                        nrComments: nrComments,
                        comments: comments ,
                        like: like,
                        nrLikes: nrLikes
                     }); 
                });});
          /*  });});*/
        });
    });

    app.get('/profile/showPhotos/disLike', (req, res) => {
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


                    res.render('showImg.ejs', { 
                        user: user,
                        message: 'Welcome to picture center my frends!',
                        qryIMG: qryIMG,
                        index: index ,
                        nrPhotos: nrPhotos,
                        nrComments: nrComments,
                        comments: comments ,
                        like: like,
                        nrLikes: nrLikes
                     }); 
                });});

        });
    });


    app.post('/profile/showPhotos/comment', (req, res) => {
      
        let sqlQ = "INSERT INTO Comments (comment_text, user_id, photo_id) " +
                   "VALUES(" + '\'' + req.body.comments + '\','+
                    user.id + "," + qryIMG[index].id + ");";
        connection.query(sqlQ, function(err, rezI) {
            if(err) {
                console.log(err);
                return err;
            }
            let sqlQry = "Select * from Photos Where  "+
                    "Photos.user_id = " + '\''+req.user.id+'\'' + 
                    " ORDER BY (SELECT COUNT(*) FROM Likes WHERE Likes.photo_id = Photos.id) DESC, "+
                    " Photos.created_at DESC;";
            connection.query(sqlQry, function(err, rez) {
                if(err) {
                   console.log(err);
                   return err;
                }
            
                if(rez[0] == undefined) {

                 user = req.user;
                 message = 'Welcome to picture center!';
                 qryIMG = [];
                 index = -1;
                 nrPhotos = 0;
                 nrComments = 0;
                 comments = [];
                 res.render('showImg.ejs', { 
                    user: user,
                    message: message,
                    qryIMG: qryIMG,
                    index: index,
                    nrPhotos: nrPhotos,
                    nrComments: nrComments,
                    comments: comments,
                    like: like,
                    nrLikes: nrLikes
                 }); 

            } else {
                console.log("--------------------");
                console.log(rez[0].image_url);
                console.log("========================");
                let newQ = "Select Count(*) as NR from Photos Where  "+
                "Photos.user_id = " + '\''+req.user.id+'\';';
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
                    nrComments = 0;
                    comments = [];
                    res.render('showImg.ejs', { 
                        user: user,
                        message: message,
                        qryIMG: qryIMG,
                        index: index,
                        nrPhotos: nrPhotos,
                        nrComments: nrComments,
                        comments = comments
                     }); 
                     */

                    let qryPC =  "Select * from Photos, Comments, User Where User.id = Comments.user_id AND  "+
                    "Photos.id = Comments.photo_id AND  Photos.id = " +qryIMG[index].id+" ORDER BY Comments.created_at DESC;";
                    connection.query(qryPC, function(err, rezPC) {
                        if(err) {
                            console.log(err);
                            return err;
                        }
                        if(rezPC[0]) {

                            let qryPCNR =  "Select COUNT(*) AS NR from Photos, User, Comments  Where User.id = Comments.user_id AND "+
                            "Photos.id = Comments.photo_id AND  Photos.id = " +qryIMG[index].id+";";
                            connection.query(qryPCNR, function(err, rezPCNR) {
                                if(err) {
                                    console.log(err);
                                    return err;
                                } 
                                user = req.user;
                                message = 'Welcome to picture center my frends!'
                                qryIMG = rez;
                                index = index;
                                nrPhotos = rezNQ[0].NR;
                                nrComments = rezPCNR[0].NR;
                                comments = rezPC;
                                res.render('showImg.ejs', { 
                                    user: user,
                                    message: message,
                                    qryIMG: qryIMG,
                                    index: index,
                                    nrPhotos: nrPhotos,
                                    nrComments: nrComments,
                                    comments: comments,
                                    like: like,
                                    nrLikes: nrLikes
                                });
                            })
                        } else {
                            user = req.user;
                            message = 'Welcome to picture center my frends!'
                            qryIMG = rez;
                            index = index;
                            nrPhotos = rezNQ[0].NR;
                            nrComments = 0;
                            comments = [];
                            res.render('showImg.ejs', { 
                                user: user,
                                message: message,
                                qryIMG: qryIMG,
                                index: index,
                                nrPhotos: nrPhotos,
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


    app.get('/profile/showPhotos/stergeImg', (req, res) => {
        //index = (index == -1 || nrPhotos <= 1 ? -1 : index < nrPhotos - 1 ? index + 1 : 0 );
        if(index != -1 ) {
            connection.query("DELETE FROM Photos where id = "+qryIMG[index].id+";",
                              function(err, rezDel) {
                if(err) {
                    console.log(err);
                    return err;
                }
                index = index == (nrPhotos-1) && index == 0 ? -1 : index == (nrPhotos-1) ? 0 : index;
                nrPhotos -= 1;
            if(index != -1 ) { 
            
            let sqlQry = "Select * from Photos Where  "+
                "Photos.user_id = " + '\''+user.id+'\'' + 
                " ORDER BY (SELECT COUNT(*) FROM Likes WHERE Likes.photo_id = Photos.id) DESC, "+
                " Photos.created_at DESC;";
            connection.query(sqlQry, function(err, rez) {
                if(err) {
                    console.log(err);
                    return err;
                }    

            connection.query("Select * from Likes where photo_id = " +rez[index].id+
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
                connection.query("Select COUNT(*) AS NR from Likes where photo_id = " +rez[index].id+";",
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
                    let qryPC =  "Select * from Photos, Comments, User Where User.id = Comments.user_id AND "+
                    "Photos.id = Comments.photo_id AND  Photos.id = " +rez[index].id+" ORDER BY Comments.created_at DESC;";
                    connection.query(qryPC, function(err, rezPC) {
                        if(err) {
                            console.log(err);
                            return err;
                        }
                        if(rezPC[0]) {

                            let qryPCNR =  "Select COUNT(*) AS NR from Photos, Comments, User Where User.id = Comments.user_id AND  "+
                            "Photos.id = Comments.photo_id AND  Photos.id = " +rez[index].id+";";
                            connection.query(qryPCNR, function(err, rezPCNR) {
                                if(err) {
                                    console.log(err);
                                    return err;
                                } 
                                user = req.user;
                                message = 'Welcome to picture center my frends!'
                                qryIMG = rez;
                                index = index;
                                nrPhotos = nrPhotos;
                                nrComments = rezPCNR[0].NR;
                                comments = rezPC;
                                res.render('showImg.ejs', { 
                                    user: user,
                                    message: message,
                                    qryIMG: qryIMG,
                                    index: index,
                                    nrPhotos: nrPhotos,
                                    nrComments: nrComments,
                                    comments: comments,
                                    like: like,
                                    nrLikes: nrLikes
                                });
                            })
                        } else {
                            user = req.user;
                            message = 'Welcome to picture center my frends!'
                            qryIMG = rez;
                            index = index;
                            nrPhotos = nrPhotos;
                            nrComments = 0;
                            comments = [];
                            res.render('showImg.ejs', { 
                                user: user,
                                message: message,
                                qryIMG: qryIMG,
                                index: index,
                                nrPhotos: nrPhotos,
                                nrComments: nrComments,
                                comments: comments,
                                like: like,
                                nrLikes: nrLikes
                            });
                        }
                    }); });}); });
                } else {
                    res.render('showImg.ejs', { 
                        user: user,
                        message: 'Welcome to picture center my frends!',
                        qryIMG: qryIMG,
                        index: index = index == -1 ? -1 : index > 0 ? index - 1 : nrPhotos - 1,
                        nrPhotos: nrPhotos,
                        nrComments: nrComments,
                        comments: comments ,
                        like: like,
                        nrLikes: nrLikes
                     }); 
                }    
            });
        } else {
            res.render('showImg.ejs', { 
            user: user,
            message: 'Welcome to picture center my frends!',
            qryIMG: qryIMG,
            index: index = index == -1 ? -1 : index > 0 ? index - 1 : nrPhotos - 1,
            nrPhotos: nrPhotos,
            nrComments: nrComments,
            comments: comments ,
            like: like,
            nrLikes: nrLikes
         }); 
        }
    });


};