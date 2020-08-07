const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_EXPIRY_TOKEN, JWT_SECRET, JWT_SECRET_ADMIN } = require("../config/keys");

// TODO: Make all async
const hash = (password, salt = bcrypt.genSaltSync(10)) => {
    const hashVal = bcrypt.hashSync(password, salt);
    return hashVal;
};

const comparePassword = (password, hashVal) => {
    return bcrypt.compareSync(password, hashVal);
};

const generatePassword = () => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const num = "0123456789";

    let pass = "";
    let passwordLength = 0;
    while (passwordLength < 7) {
        pass += lower[Math.floor(Math.random() * lower.length)];
        passwordLength += 1;
    }

    pass = pass.replace(pass[3], pass[3].toUpperCase());
    pass += num[Math.floor(Math.random() * num.length)];
    return pass;
};

const generateToken = (data, type = null) => {
    const secret = (type === "admin" ? JWT_SECRET_ADMIN : JWT_SECRET) || "incredibleMagma";
    const expiry = JWT_EXPIRY_TOKEN || 7890000;

    console.log(expiry)

    return jwt.sign(data, secret, {expiresIn: expiry});
};

const decodeToken = (token, type = null) => {
    try {
        const secret = (type === "admin" ? JWT_SECRET_ADMIN : JWT_SECRET) || "incredibleMagma";
        return jwt.verify(token, secret);
    } catch (error) {
        console.log(error)
        return "Authentication failed"
    }
}

module.exports = { hash, comparePassword, generatePassword, generateToken, decodeToken };