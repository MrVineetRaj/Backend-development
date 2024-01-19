require('../db/mongoose')

const Task = require("../models/task");


// 658faacc4847410bfb216674

// Task.findByIdAndDelete("658faacc4847410bfb216674")
// .then((user) =>{
//     console.log(user);
//     return Task.countDocuments({"Completed":false})
// })
// .then((result)=>{
//     console.log(result);
// })
// .catch((e)=>{
//     console.log(e);
// })

let removeTaskByIdAndCount = async (id,Completed)=>{
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({Completed});
    return count; 
}

removeTaskByIdAndCount("6592d6f5328f32253d321901",false)
.then((count)=>{
    console.log(count);
}).catch((e)=>{
    console.log(e);
})