// class ExpressError extends Error{
//     constructor(){
//         super();
//         this.statusCode=this.statusCode;
//         this.message=this.message;
//     }
// }

// module.exports=ExpressError;


class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default ExpressError;