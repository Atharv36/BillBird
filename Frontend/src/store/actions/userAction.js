export const fetchUserRequest = () =>({
    type:"FETCH_USER_REQUEST"
})

export const fetchUserSuccess = (user) =>({
    type:"FETCH_USER_SUCCESS",
    payload:user
})

export const fetchUserFailure = (err) =>({
    type:"FETCH_USER_FAILURE",
    payload:err
})

export const fetchUser = () => async(dispatch)=>{
    dispatch(fetchUserRequest())
    try{
        const response = await fetch("http://localhost:8181/user");
        const data = await response.json();
        dispatch(fetchUserSuccess(user))
    }catch(error){
        dispatch(fetchUserFailure(error))
    }
}