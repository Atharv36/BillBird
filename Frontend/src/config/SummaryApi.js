
export const baseUrl = "http://localhost:8989"
//  import.meta.env.VITE_API_BASE_URL 

const SummaryApi={
    register : {
        url:'/api/user/register',
        method:'post'
    },
    login:{
        url:'/api/user/login',
        method:'post'
    }, 
    
}


export default SummaryApi