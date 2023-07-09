const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mydb',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});


// const contact1 = new contact({
//     name: "Fidil",
//     nohp: "081223364451",
//     email: "arya@gmail.com"
// }) 

// contact1.save().then((c) =>  console.log(c))