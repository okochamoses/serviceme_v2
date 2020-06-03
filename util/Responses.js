const ResponseCode = {
    SUCCESS: 0,
    FAILURE: 10,
    AUTH_FAILURE: 20,
    ERROR: 99,
}

const ResponseMessage = {
    SUCCESS: "Operation successful",
    FAILURE: "Operation failed",
    AUTH_FAILURE: "Authentication failed",
    ERROR: "Error communicating with service",
}

module.exports = { ResponseCode, ResponseMessage }