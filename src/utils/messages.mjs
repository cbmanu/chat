export function generateMessage(text){
    return{
        text,
        createdAt:new Date().getTime()
    }
}
