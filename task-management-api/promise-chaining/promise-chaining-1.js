require('../db/mongoose')

const User = require("../models/user");


// 658faa289a1e2a937e0793d4

// User.findByIdAndUpdate("658faa289a1e2a937e0793d4",{age:20})
// .then((user) =>{
//     console.log(user);
//     return User.countDocuments({age:20})
// })
// .then((result)=>{
//     console.log(result);
// })
// .catch((e)=>{
//     console.log(e);
// })

const updateAgeAndCount = async (id,age) =>{
    const user = await User.findByIdAndUpdate(id,{age});
    const count = await User.countDocuments({age});
    return count;
}

updateAgeAndCount("6592d7b3328f32253d32190a",20)
.then((count) =>{
    console.log(count);
})
.catch((e)=>{
    console.log(e);
})