commands =[
    {
        name:"getOne",
        controller:"pickingAddress",
        method:"get",
        api:"/address/:code",
        middleware:[]
    }
]
module.exports= commands