const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

const {body,validationResult,check} = require('express-validator');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const methodOverride = require('method-override')
app.use(methodOverride('_method'));

//require db
require('./utils/db.js')
const {contact} = require('./utils/model/contact.js');


//konfigurasi ejs
app.use(express.urlencoded({extended:false}));
app.use(expressLayouts);
app.use(express.static('public'));
app.set('view engine','ejs');

//konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
    cookie : {maxAge:6000},
    secret : "secret",
    resave : true,
    saveUninitialized : true
}));
app.use(flash());



app.get('/',(req,res) => {
    res.render('index.ejs',{
        title:'ITS HOMEPAGE',
        layout:'layouts/main-layout.ejs',
        nama: 'Arya Julianda'
    });
});

app.get('/about',(req,res) => {
    res.render('about',{
        title: 'INi about',
        layout: 'layouts/main-layout.ejs'
    });
});

app.get('/contact',async (req,res) => {
    
    const contacts = await contact.find();
    res.render('contact',{
        title: 'INi contact',
        layout: 'layouts/main-layout.ejs',
        contacts,
        msg: req.flash('msg')
    })
});

app.get('/contact/add',(req,res) => {
    res.render('add',{
        title: "Form add Contact",
        layout: 'layouts/main-layout.ejs'
    })
})

//form add contact
app.get('/contact/add',(req,res) => {
    res.render('add',{
        title: "Form add Contact",
        layout: 'layouts/main-layout.ejs'
    })
})

//proses add contact
app.post('/contact',
[   
    body('name').custom( async (value) => {
        const duplicate = await contact.findOne({name: value});
        if(duplicate) {
            throw new Error ('Name is was exist before!');
        }
        return true;
    }),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email format'),
    check('nohp','Number Phone not valid!').isMobilePhone('id-ID')
],
(req,res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        res.render('add',{
            title: "Form add Contact",
            layout: 'layouts/main-layout.ejs',
            errors: error.array()
        })
    }  else {

        contact.insertMany(req.body,(error) => {
            //krim flash
            req.flash('msg','Add Contact is Successfull')
            res.redirect('contact');
        });
    }
})

// edit contact
app.get('/contact/edit/:name',async (req,res) => {
    const editContact = await contact.findOne({name : req.params.name});

    res.render('edit',{
        title : "form edit",
        layout : 'layouts/main-layout.ejs',
        editContact
    })
})

// prosses update contact
app.put('/contact',
[   
    body('name').custom(async (value,{req}) => {
        const duplicate = await contact.findOne({name: value});
        if(req.body.oldName != value && duplicate) {
            throw new Error('Name is was exist before!');
        }
        return true;
    }),
    body('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email format'),
    check('nohp','Number Phone not valid!').isMobilePhone('id-ID')
],
(req,res) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
      return res.render('edit',{
            title: "Form edit Contact",
            layout: 'layouts/main-layout.ejs',
            errors: error.array(),
            editContact:req.body
        })

    } 

    contact.updateOne(
        {_id : req.body._id},
        {
           $set:{
                name: req.body.name,
                nohp: req.body.nohp,
                email: req.body.email
           } 
        }).then(() => {
             //krim flash
             req.flash('msg','Edit Contact is Successfull')
             res.redirect('contact');
        })
})

//delete contact
app.delete('/contact',(req,res) => {
    contact.deleteOne({_id : req.body.id}).then((result) => {
        req.flash('msg','Delete Contact is Successfull')
        res.redirect('/contact');
    }).catch(() => {
        res.send("Are you kidding me?")
    }) 
})


//detail contact
app.get('/contact/:name',async(req,res) => {
    const contactDetail = await contact.findOne({ name : req.params.name });

    res.render('detail',{
        title: 'INi detail',
        layout: 'layouts/main-layout.ejs',
        contactDetail,
    })
});


app.listen(port, () => {
    console.log(`Server is listen in port http://localhost:${port}`)
})