const users=[];

export const addUser=({id,username,room})=>{
    username=username.trim().toLowerCase();
    room=room.trim().toLowerCase();
   
    //Validate
    if(!username||!room){
        return{
            error:'username and room are required!'
        }
    }

    //existing user
    const existingUser=users.find((user)=>{
        return user.room===room&&user.username===username;
    })
    //Validate username
    if(existingUser){
        return{
            error:'Username is in use!'
        }
    }

    //Store user
    const user={id,username,room};
    users.push(user);
    return{user};
}

export const removeUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id);
    if(index!=-1){
        return users.splice(index,1)[0]
    }
    return undefined;
}
export const getUser=(id)=>{
     return users.find((user)=>user.id===id);
}
export const getUsersInRoom=(room)=>{
    return users.filter((user)=>user.room===room);
}
