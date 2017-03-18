var newsModel = [
    {id: 1, title: "Hello", date: "1.10.1979", body: "Hello world"},
    {id: 2, title: "Hello again", date: "31.3.1979", body: "Hello world again"}
];


jQuery(function() {
    parseNews();
    renderNews();
});

var newsArray = [];

function News(id, title, date, body) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.body = body;
    this.render = function() {
        var template = jQuery(".news-item.template").clone();
        template.removeClass("template");
        template.find(".title").html(this.title);
        template.find(".date").html(this.date);
        template.find(".body").html(this.body);
        jQuery("body").append(template);
        this.newsElement = template;
    }
    this.newsElement;
    this.renderForm = function() {
        var template = jQuery(".news-form.template").clone();
        template.removeClass("template");
        template.find(".title").val(this.title);
        template.find(".date").val(this.date);
        template.find(".body").val(this.body);
        jQuery("body").append(template);
        this.formevents(template);       
    }
    this.formevents = function(template) {
        var base = this;
        template.find(".title").on("keyup blur", function() {
            base.newsElement.find(".title").html(jQuery(this).val());
            base.newsElement.find(".edited").show();
        });
        template.find(".date").on("keyup blur", function() {
            base.newsElement.find(".date").html(jQuery(this).val());
            base.newsElement.find(".edited").show();
        });
        template.find(".body").on("keyup blur", function() {
            base.newsElement.find(".body").html(jQuery(this).val())
            base.newsElement.find(".edited").show();
        });               
    }
}
function parseNews() {
    for (var i in newsModel) {
        var newsItem = new News(newsModel[i].id, newsModel[i].title, newsModel[i].date, newsModel[i].body);
        newsArray.push(newsItem);
    }
}
function renderNews() {
     for (var i in newsArray) {
         newsArray[i].render();
         newsArray[i].renderForm();
     }
}
