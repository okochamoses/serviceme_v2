const ServiceResponse = class ServiceResponse {
    constructor(status, description, data) {
        this.status = status;
        this.description = description;
        this.data = data;
    }
};

module.exports = ServiceResponse;
