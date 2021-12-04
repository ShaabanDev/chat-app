const generateMessage=(text)=>{
    return {
        text,
        timestamp: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}