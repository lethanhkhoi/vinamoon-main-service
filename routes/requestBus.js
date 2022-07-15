commands =[
    {
        name:"getAll",
        controller:"requestBus",
        method:"get",
        api:"/requestBus",
        middleware:[]
    },
    {
        name:"getOne",
        controller:"requestBus",
        method:"get",
        api:"/requestBus/:code",
        middleware:[]
    },
    {
        name:"create",
        controller:"requestBus",
        method:"post",
        api:"/requestBus",
        middleware:["authentication"]
    },
]
module.exports= commands