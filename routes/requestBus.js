commands =[
    {
        name:"getAll",
        controller:"requestBus",
        method:"get",
        api:"/requestBus",
        middleware:[]
    },
    {
        name:"create",
        controller:"requestBus",
        method:"post",
        api:"/requestBus",
        middleware:[]
    },
]
module.exports= commands