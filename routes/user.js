commands =[
    {
        name:"getAll",
        controller:"user",
        method:"get",
        api:"/user",
        middleware:[]
    },
    {
        name:"login",
        controller:"user",
        method:"post",
        api:"/login",
        middleware:[]
    },
    {
        name:"register",
        controller:"user",
        method:"post",
        api:"/register",
        middleware:[]
    },
]
module.exports= commands