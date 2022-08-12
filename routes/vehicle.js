commands =[
    {
        name:"create",
        controller:"vehicle",
        method:"post",
        api:"/vehicle",
        middleware:["authentication"]
    },
    {
        name:"getAll",
        controller:"vehicle",
        method:"get",
        api:"/vehicle",
        middleware:[]
    },
    {
        name:"update",
        controller:"vehicle",
        method:"patch",
        api:"/vehicle/:code",
        middleware:["authentication"]
    },
]
module.exports= commands