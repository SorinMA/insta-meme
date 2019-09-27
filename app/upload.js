var upload = require('express-fileupload');

var connection = require('../Database/configDB.js');

module.exports = function(app) {
    app.use(upload());
    app.get('/profile/upload', (req, res) => {
        res.render('upload.ejs', { 
            user: req.user,
            message: 'Welcome to upload center!'
         }); 
    });
    app.post('/profile/upload', (req, res) => {
        console.log("first step");
        if(req.files) {
            
            var img = req.files.img;
            var saveName = Date.now() + img.name;
            console.log("------------------------------");
            console.log(saveName);
            console.log("+++++++++++++++++++++++++++++++=");
            img.mv('./public/img_DB/' + saveName, function(err){
                if(err) {
                    console.log(err);
                    res.render('upload.ejs', { 
                        user: req.user,
                        message: 'error'
                     }); 
                    return err;
                } else {
                    console.log("done upload!");
                    let sqlInsertQry = "INSERT INTO Photos (user_id, image_url) " +
                    "VALUES("+'\''+req.user.id+'\''+", "+
                    '\''+saveName+'\''+");";
                    connection.query(sqlInsertQry, function(err, rez) {
                        if(err) {
                            console.log(err);
                            return err;
                        }
                        res.render('upload.ejs', { 
                            user: req.user,
                            message: 'DONE!'
                         }); 
                    });
                }
            });
        }
    });
};