const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://0.0.0.0:27017/blogdb')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    timestamp: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogSchema);

app.use(express.json());

app.get('/', (request, response) => {
    response.send('<p>API is running. Date: ' + Date() + '. </p>');
});

app.post('/addblog', async (req, res) => {
    if (!req.body.author) res.status(405).send('No Body')
    else {
        let blogPost = new BlogPost({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author
        });
        blogPost = await blogPost.save();
        res.status(201).send({
            discription: 'ok'
        });
    }
});

app.get('/getblogs', async (req,res) => {
    const id = req.query['id'];
    if (id) {
        allblogs = await BlogPost.findOne({'_id': id});
    }
    else {
        allblogs = await BlogPost.find();
    }
    if (allblogs) res.send(allblogs);
    else res.status(404).send('Error in processing');
});

app.get('/getblogs/id', async (req,res) => {
    const id = req.query['id'];
    
    if (reqblog) res.send(reqblog);
    else res.status(404).send('Error in processing');
})

app.delete('/deleteblogs/id', async (req,res) => {
    const id = req.query['id'];
    const reqblog = await BlogPost.deleteOne({'_id': id});
    if (reqblog) res.send(reqblog);
    else res.status(404).send('Error in processing');
})

app.post('/updateblogs/id', async (req,res) => {
    const id = req.query['id'];
    const reqblog = await BlogPost.findOne({'_id': id});
    if(reqblog) {
        const status = await BlogPost.updateOne({'_id': id},{
            title: req.body.title ? req.body.title : reqblog.title,
            content: req.body.content ? req.body.content : reqblog.content,
            author: req.body.author ? req.body.author : reqblog.author,
        });
        res.send(status);
    }
    else res.status(404).send('Error in processing');
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
