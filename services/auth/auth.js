const aad = require('azure-ad-jwt');

exports.verifyToken = (req, res) => {
    const bearerToken = req.headers['authorization'];
    const jwtToken = bearerToken.split(' ');
    const token = jwtToken[1];
    console.log("jwtToken", token)
    aad.verify(token, null, function(err, result) {
        if (result) {
            console.log("JWT is valid",  req.headers) ;
            //result(null, res.headers);
            return;
        } else {
            console.log("JWT is invalid: " + err);
            //result(err, null);
        }
})
}