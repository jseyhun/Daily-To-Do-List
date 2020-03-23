const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require("lodash");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
  name: {
    type: String,
    required: [true, "c'mon buddy, gotta have a name"]
  }};

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model('List', listSchema);
const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: "Practice Turkish"
});

const item2 = new Item({
  name: "Practice Guitar"
});

const item3 = new Item({
  name: "Do Coding"
});

const defaultItems = [item1, item2, item3];

app.get('/', function(req, res){

  Item.find(function(err, foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }
      });
      res.redirect('/');
    } else {
      res.render('list', {today: date(), newListItems: foundItems, special: ""});
    }


  });

});

app.get('/:specialList', function(req, res){
  const specialList = _.capitalize(req.params.specialList);

  List.findOne({name: specialList}, function(err, foundList){
    if(err){
      console.log(err);
    } else {
      if(foundList){
        console.log("list " + specialList + " found");
        res.render("list", {today: date(), newListItems: foundList.items, special: specialList});
      } else {
        const newList = new List({
          name: specialList,
          items: defaultItems
        });
        newList.save();
        console.log("list " + specialList + " created");
        res.redirect("/" + specialList);
      }
    }
  });

})


app.post('/', function(req, res){
  const newItem = req.body.newitem;
  const listName = req.body.list;

  const item = new Item({
    name: newItem
  });

  if(listName === ""){
    item.save();
    res.redirect('/')
  } else {
    List.findOne({name: listName}, function(err, foundList){
      if(err){
        console.log(err);
      } else {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }



});

app.post('/delete', function(req, res){
  const checkedItemID = req.body.xButton;
  const listName = req.body.listName;

  if(listName == ""){

    Item.deleteOne({_id: checkedItemID}, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("Item deleted");
        res.redirect('/');
      }
    });

  } else {

    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, function(err, foundList){
      if(err){
        console.log(err);
      } else {
        console.log("listname is " + listName);
        res.redirect('/' + listName);
      }
    });

  }
});

app.listen(3000, function(){
  console.log('You are now listening to smooth jazz on port 3000');
});
