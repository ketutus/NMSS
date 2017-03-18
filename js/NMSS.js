var newsModel = [
    {id: 1, title: "Noumena's Spinefarm-era albums reissued with bonus tracks", date: "04.04.2016", body: 'Noumena re-releases the second and third albums <span class="bold">Absence</span> and <span class="bold">Anatomy of Life</span> on 29.4.2016. Albums are released in a double CD digipak with five bonus tracks previously available only on digital format. The digipak is reissued by Haunted Zoo Productions.\r\n\r\nAbsence (released in 2005) was widely acknowledged, and it was followed by band\'s third album Anatomy of Life already next year. These Spinefarm-era albums really defined Noumena\'s sound and style and enriched the melodic death metal genre with many remarkable songs.\r\n\r\n- We decided to celebrate the 10th anniversaries of both the albums with this special release. Both the albums have been out of stock for several years, so this also is a favor to our fans. Five bonus tracks from original studio sessions are included on the digipak, and those songs have earlier been available only on Triumph and Loss digital EP, comments Hannu Savolainen, the head of Haunted Zoo Productions and bassist of Noumena.\r\n\r\nCurrently Noumena is working with new songs and getting ready for studio session. Band\'s next album will be released by the end of 2016.', image: "img/reissue.jpg", published: true},
    {id: 2, title: "Myrrys julkaistaan", date: "1.10.1979", body: "Myrrys julkaistaan kun pääsiäinen on jouluna", image: "img/myrrys.jpg", published: false},
];


//jQuery(function() {
window.onload = function() {
    parseNews();
    jQuery("#nav li").click(function(e) {
        e.preventDefault();
        jQuery("#nav li").removeClass("active");
        jQuery(this).addClass("active");
        var id = jQuery(this).find("a").text();
        jQuery(".content").removeClass("active");
        jQuery("#" + id).addClass("active");
    })
    jQuery("#add-news").click(function(){
        var now = new Date();
        now = now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
        var newsItem = new News("", "", now, "",  "", false);
        newsItem.init();
        newsItem.listElement.trigger("click");
        //newsArray.push(newsItem);
    });
}    
//});

var newsArray = [];

function News(id, title, date, body, image, published) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.body = body;
    this.image = image;
    this.published = published;
    this.init = function() {
        this.createNewsElement();
        this.createFormElement();
        this.createListElement();
        jQuery("#news-list").prepend(this.listElement);
        this.events();
    }
    this.createNewsElement = function() {
        var template = jQuery("#templates .news-item").clone();
        template.find(".title").html(this.title);
        template.find(".date").html(this.date);
        template.find(".body").html(this.body.replace(/\r\n|\r|\n/g,"<br />"));
        template.find(".image").html('<img src="' + this.image + '">');
        this.newsElement = template;
    }
    this.newsElement;
    this.createFormElement = function() {
        var template = jQuery("#templates .news-form").clone();
        template.find(".title").val(this.title);
        template.find(".date").val(this.date);
        template.find(".body").val(this.body);
        template.find(".published").prop('checked', this.published);
        this.formElement = template;             
    }
    this.formElement;
    this.createListElement = function() {
        var template = jQuery("#templates .news-list").clone();
        template.find(".title").html(this.title);
        template.find(".date").html(this.date);
        this.listElement = template;
    }    
    this.listElement;     
    this.events = function(template) {
        var base = this;
                     
        this.formElement.find(".title").on("keyup blur", function() {
            base.title = jQuery(this).val();
            base.newsElement.find(".title").html(jQuery(this).val());
            base.listElement.find(".title").html(jQuery(this).val());
            base.listElement.addClass("edited");
            base.formElement.find(".update").addClass("active");
        });
        this.formElement.find(".date").on("keyup blur", function() {
            base.date = jQuery(this).val();
            base.newsElement.find(".date").html(jQuery(this).val());
            base.listElement.addClass("edited");
            base.formElement.find(".update").addClass("active");
        });
        this.formElement.find(".body").on("keyup blur", function() {
            base.body = jQuery(this).val();
            base.newsElement.find(".body").html(jQuery(this).val().replace(/\r\n|\r|\n/g,"<br />"));
            base.listElement.addClass("edited");
            base.formElement.find(".update").addClass("active");
        });
        this.formElement.find(".image").on("change", function(event) {
            var input = event.target;
            var reader = new FileReader();
            reader.onload = function(){
                var dataURL = reader.result;
                base.newsElement.find(".image img").attr("src", dataURL);
            };
            reader.readAsDataURL(input.files[0]);            
        });        
        this.formElement.find(".update").click(function(e) {
            e.preventDefault();
            base.update();
        });
        this.formElement.find(".delete").click(function(e) {
            e.preventDefault();
            var confirmdelete = confirm("Noumena member, oletko varma, että haluat POISTAA uutisen?");
            if (confirmdelete) {
                base.delete();
            } 
        });
        this.formElement.find(".bold").click(function(e) {
            e.preventDefault();
            base.wrapElement("bold");
        });
        this.formElement.find(".italic").click(function(e) {
            e.preventDefault();
            base.wrapElement("italic");
        });
        this.formElement.find(".h3").click(function(e) {
            e.preventDefault();
            base.wrapElement("h3");
        });                                     
        this.listElement.click(function() {
            jQuery(".news-list").removeClass("active");
            base.listElement.addClass("active");
            jQuery("#news-edit-area, #news-preview-area").html("");
            jQuery("#news-edit-area").append(base.formElement);
            jQuery("#news-preview-area").append(base.newsElement);
        });                      
    }
    this.wrapElement = function(tag) {
        var start = this.formElement.find(".body")[0].selectionStart;
        var end = this.formElement.find(".body")[0].selectionEnd;
        var length = this.formElement.find(".body")[0].value.length;
        var selected = this.formElement.find(".body")[0].value.substring(start, end);
        if (tag == "h3") {
            var wrapped = '<h3>' + selected + '</h3>';
        } else {
            var wrapped = '<span class="' + tag + '">' + selected + '</span>';
        }
        var inserted = this.formElement.find(".body").val().substring(0,start) + wrapped + this.formElement.find(".body").val().substring(end,length);
        this.formElement.find(".body").val(inserted);
        this.formElement.find(".body").trigger("keyup");
    }
    this.update = function() {
        var json = {}
        json.title = this.title;
        json.date = this.date;
        json.body = this.body;
        json.id = this.id;
        console.log(JSON.stringify(json));
        this.listElement.removeClass("edited");
        this.formElement.find(".update").removeClass("active");
    }
    this.delete = function() {
        var json = {}
        json.id = this.id;
        this.formElement.remove();
        this.listElement.remove();
        this.newsElement.remove();
        console.log(JSON.stringify(json));        
    }

}
function parseNews() {
    for (var i in newsModel) {
        var newsItem = new News(newsModel[i].id, newsModel[i].title, newsModel[i].date, newsModel[i].body, newsModel[i].image, newsModel[i].published);
        newsItem.init();
        //newsArray.push(newsItem);
    }
}
