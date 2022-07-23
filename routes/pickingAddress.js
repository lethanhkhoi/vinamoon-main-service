commands =[
    {
        name:"getOne",
        controller:"pickingAddress",
        method:"get",
        api:"/address/:code",
        middleware:[]
    },
    {
        name:"getFrequency",
        controller:"pickingAddress",
        method:"post",
        api:"/frequency",
        middleware:[]
    }
]
module.exports= commands