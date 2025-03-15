

class ApiResponse{
    constructor(
        statusCode,
        data,
        message = "success",
    ){
        this.statusCode = statusCode
        this.data = data || null
        this.message = message
        this.success = statusCode < 400 ? true : false;

    }
}

module.exports = ApiResponse;