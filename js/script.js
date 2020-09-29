 //L'esercizio di oggi è quello di creare, come fatto in aula, una todo list sulla quale sarà possibile svolgere le operazioni di CRUD, usando qusta Api: http://157.230.17.132:3021/todos


 $(document).ready(function() {

    getList();


    $("#send-note").click(function(){
        sendNote();
    });

    $("#input-note").keypress(function(e) {
        if ((e.which == 13) && ($(this).val().length > 0)) {
          sendNote();
        }
    });

    $(".note-container").on("click", ".delete", function(){
        deleteElement(this);
    });

    $(".note-container").on("click", ".modify", function(){
        modifyElement(this);
    });

    $(".note-container").on("click", ".note-done", function(){
        doneElement(this);
    });

    $(".done-note-container").on("click", ".note-done", function(){
        doneElement(this);
    })


});


function getList(){

    $.ajax({
        url: "http://157.230.17.132:3021/todos",
        method: "GET",

        success: function (data) {
            printToDoList(data);
        },
        error: function (err) {
            alert("E' avvenuto un errore. ");
        }
    });

};


function printToDoList(data){
    for(var i=0; i<data.length;i++){
        var source = $("#note-template").html();
        var template = Handlebars.compile(source);
    

        
        var destination = $(".note-container");

        var context = {
            "text": data[i].text,
            "id": data[i].id,
        }
    
        var done = data[i].done;
        if(done == "true"){
            var source = $("#done-note-template").html();
            var template = Handlebars.compile(source);

            destination = $(".done-note-container")
        }

        console.log(done);



        var html = template(data[i]);
        destination.append(html);
    }


};


//funzione che invoia ALL'API la nuova nota
function sendNote(){
    var input = $("#input-note").val();
    $.ajax({
        url: "http://157.230.17.132:3021/todos",
        method: "POST",
        "data": {
          "text":input,  
          "done":false,
        },
        success: function (data) {
            printElement(data);

        },
        error: function (err) {
            alert("Errore di connessione, la tua nota non si è sincronizzata.");
        }
    });


    var input = $("#input-note").val("");
};

//aggiunge in pagina la nuova nota
function printElement(data){
    var source = $("#note-template").html();
    var template = Handlebars.compile(source);

    var html = template(data);
    $(".note-container").append(html);
 
};






function deleteElement(questo){
   
    var thisElement = $(questo).parents(".note-element");
    var elementId = thisElement.attr("data-id");
    console.log(elementId);

    thisElement.remove();


    $.ajax({
        url: "http://157.230.17.132:3021/todos/" + elementId,
        method: "DELETE",

        success: function (data) {
            console.log(data);
        },
        error: function (err) {
            alert("E' avvenuto un errore. ");
        }
    });


};

function modifyElement (questo){
    var thisElement = $(questo).parents(".note-element");
    var elementId = thisElement.attr("data-id");

    var newInput = $("#input-note").val();

    $(".note-text", thisElement).text(newInput);

    $.ajax({
        url: "http://157.230.17.132:3021/todos/" + elementId,
        method: "PATCH",
        data:{
            "text": newInput,
        },
        success: function (data) {
        },
        error: function (err) {
            alert("E' avvenuto un errore. ");
        }
    });


};


function doneElement(questo){
    var thisElement = $(questo).parents(".note-element");
    var elementId = thisElement.attr("data-id");


    if($(".note-done", thisElement).prop('checked')){

        $.ajax({
            url: "http://157.230.17.132:3021/todos/" + elementId,
            method: "PATCH",
            data:{
                "done":true,
            },
            success: function (data) {
                thisElement.remove();
                
                var source = $("#done-note-template").html();
                var template = Handlebars.compile(source);

                var html = template(data);
                $(".done-note-container").prepend(html);
            },
            error: function (err) {
                alert("E' avvenuto un errore. ");
            }
        });
    
    } else {
        $.ajax({
            url: "http://157.230.17.132:3021/todos/" + elementId,
            method: "PATCH",
            data:{
                "done":false,
            },
            success: function (data) {
                thisElement.remove();
                
                var source = $("#note-template").html();
                var template = Handlebars.compile(source);

                var html = template(data);
                $(".note-container").append(html);
            },
            error: function (err) {
                alert("E' avvenuto un errore. ");
            }
        });
    }













};
















