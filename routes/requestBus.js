commands =[
    {
        name:"getAll",
        controller:"requestBus",
        method:"get",
        api:"/requestBus",
        middleware:["authentication"]
    },
    {
        name:"getOne",
        controller:"requestBus",
        method:"get",
        api:"/requestBus/:code",
        middleware:["authentication"]
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