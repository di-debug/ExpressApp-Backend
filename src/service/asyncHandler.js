c
// Higher Order Function
// (fn) => is reference of a function

const asyncHandler = (fn) =>async (res, req, next) => {
    try {
     await fn(res,req, next)   
    } catch (error) {
        res.status(error.code || 500).json({
            success:false,
            message:error.message
        })
    }
}

export default asyncHandler;