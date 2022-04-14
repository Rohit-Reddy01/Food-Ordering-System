const router = require('express').Router();

const queryGetNumberOfUsers = 'select count(*) as user_count from user_profile';
const queryForRegister = 'insert into user_profile values(?, ?, ?, ?, ?, ?)';
const queryGetUserForUsername = 'select count(*) as user_count from user_profile where user_name = ?';

module.exports = (connection, redirectHome) => {
    router.get('/', redirectHome, (req, res) => {
        res.render('user_register', { errmsg: '' });
    });

    router.post('/', redirectHome, (req, res) => {
        console.log(req.body);
        const { username, fullname, address, phonenumber, password } = req.body;
        if (username && fullname && address && phonenumber && password) {
            connection.query(queryGetNumberOfUsers, (err, rows1, fields) => {
                if (err) {
                    console.log(err);
                    res.render('some error');
                } 
                else {
                    connection.query(queryGetUserForUsername, [username], (err, rows2, fields) => {
                        if (err) {
                            console.log(err);
                            res.render('some error');
                        } 
                        else {
                            if (rows2[0].user_count !== 0) {
                                res.render('user_register', { errmsg: 'Username already exists'});
                            }
                            else{
                                const user_id = rows1[0].user_count + 1;
                                connection.query(queryForRegister, [user_id, username, fullname, address, phonenumber, password], (err, rows3, fields) => {
                                    if (err) {
                                        console.log(err);
                                        res.render('some_error');
                                    }
                                    else{
                                        req.session.userIdInSession = user_id;
                                        req.session.usernameInSession = username;
                                        console.log('User successfully registered. Details: ', rows3);
                                        res.redirect('/');
                                    }
                                })
                            }
                        }
                    }
                    );
                }
            });
        }
        else{
            res.render('user_register', {errmsg : 'Please fill all the fields'});
        }

    });
    return router;
};
