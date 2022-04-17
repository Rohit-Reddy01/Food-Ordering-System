const router = require('express').Router();

const queryDeleteRestaurant = 'delete from restaurant_profile where restaurant_id = ?';

module.exports = (connection, redirectLogin) => {
    router.get('/', redirectLogin, (req, res) => {
        const {userIdInSession} = req.session;
        connection.query(queryDeleteRestaurant, [userIdInSession], (err, rows1) => {
            if(err){
                console.log(err);
                res.render('some_error');
            }
            else{
                req.session.destroy((err) => {
                    if(err){
                        console.log(err);
                        res.render('some_error')
                    }
                }
                )
                res.redirect('/');
            }
        })
    })
    return router;
}