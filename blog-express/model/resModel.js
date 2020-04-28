class BaseModel {
    // data为对象，message为字符串，如果只传入字符串，则直接将data赋值给message
    constructor(data, message){
        if(typeof data === 'string'){
            this.message = data
            data = null
            message = null
        }
        if (data) {
            this.data = data
        }

        if (message){
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message){
        super(data, message)
        this.errorno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}
