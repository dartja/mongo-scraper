$(document).ready(function(){
 $.getJSON("/pga_title", function(response) {
    response.forEach(function(article) {
  var body_section = "<div class='col-md-4 col-md-offset-4'>";
      body_section += "<h3>" + article.title + "</h3>";
     
      body_section += "<form method='POST' action='/submit'>"
        + "<div class='form-group>"
        + "<input type='text' class='form-control' name='articleId' id='articleInput' value=" + article._id + ">"
        + "<textarea class='form-control' rows='3' placeholder='Add comments' name='commentBody'></textarea></br>"
        + "<input type='submit' name='button' class='btn btn-default'></form>";
      body_section += "</div>"; // close-article-addNote
      body_section += "</div>"; //close-article-box
      body_section += "</div>"; //col m8addNote

    $(".row").append(body_section);

    });
  });

});
