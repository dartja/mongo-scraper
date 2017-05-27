var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  commentBody:{
    type:String
  },
  _articleId: {
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }
});

var Note = mongoose.model("Comment", commentSchema);
module.exports = Note;