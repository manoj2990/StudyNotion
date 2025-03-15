


const asyncHandler = (fxn) => {
    return (req, res, next) =>{
            Promise
            .resolve( fxn(req, res, next))
            .catch( (error)=>{
                next(error)
            })
        }
    }
    
    

module.exports =  asyncHandler;
    
    