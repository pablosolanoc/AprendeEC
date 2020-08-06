let listaPost=[];
let checked=-1;
const PUBLICADO='Publicado';
const NO_PUBLICADO='No publicado';
let accion=0;
$(function() {
    // $('#barraNavegacion').load('navbar.html');
    document.title='Posts'
    disabledButtons();
    console.log($('#usuarioActivo').text());
    getPosts($('#usuarioActivo').text());
    $('#btnCrear').click(function() {
        editar(-1);
    });
    $('#btnPublicar').click(function() {
        //Debajo debe ir el evento que se genera. En este caso la publicación del post en el sitio
        $('#exampleModalLabel').text('Publicar Post');
        $('#contenidoModel').text('¿Está seguro de que desea publicar el post?. Una vez publicado no se podrá editar.');
        $('#modalMessage').modal('show');
        accion=1;
    });
    $('#btnVer').click(function() {
        let username = $('#usuarioActivo').text();
        // let username='luchoCode';
        let id = checked;
        //window.open('/viewPost/'+id+'/'+username, '_blanck');
        verPost(id,username);
    });
    $('#btnEliminar').click(function(){
        $('#exampleModalLabel').text('Eliminar Post');
        $('#contenidoModel').text('¿Está seguro de que desea eliminar el post?');
        $('#modalMessage').modal('show');
        accion=2;
    });

    $('#btnYesPublicar').click(function(){
        //Aqui mandamos a cambiar el estado de la publicación en true 
        console.log('Publicar');     
        $('#modalMessage').modal('toggle');  
        if(accion==1)
            publicarPost($('#usuarioActivo').text());
        if(accion==2)
            eliminarPost($('#usuarioActivo').text());
    });
    $('#btnEditar').click(function(){
        //Mando el objeto a editar
        editar(checked);
    });

});

//Funcion para definir el objeto que voy a editar
function editar(id){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", "/defEditorPost/"+id, true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log('Definido exitosamente');
            window.open('/editor', '_self')
        }
    }
    ajaxRequest.send(null);
}


//Llamada a la vista del post
function verPost(id,username){
    let httpReq = new XMLHttpRequest();
    //Verifico si el post corresponde al usuario quien quiere verlo
    //El usuario puede ver post publicados y sin publicar, un usuario no registrado solo puede ver post publicados
    httpReq.open('GET','/viewPost/'+id+'/'+username+'/0',true);
    httpReq.onreadystatechange = function(){
        if(httpReq.readyState == 4 && httpReq.status==200){
            console.log(httpReq.responseText);
            window.open('/verPost','_self');
        }
    }
    httpReq.send(null);
}

//Funcion para eliminar un post
function eliminarPost(userActivo){
    let id_post = checked;
    let username = userActivo;
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("DELETE", "/deletePub/"+username+'/'+id_post+'/post', true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log('Eliminado exitosamente');
            //window.open('/modPublicaciones')
            $('#'+id_post).remove();
            checked=-1;
            disabledButtons();
        }
    }
    ajaxRequest.send(null);
}


//Funcion para cabiar el estado de la publicación
function publicarPost(userActivo){
    let id_post = checked;
    let username = userActivo;
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("PUT", "/publicarPub/"+username+'/'+id_post+'/post', true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log('Actualizado exitosamente');
            $('#estadoPost'+id_post).text(PUBLICADO);  
            $('#revisor'+id_post).prop('checked',false);
            checked=-1;
            disabledButtons();
        }
    }
    ajaxRequest.send(null);
}

//Inicializo los botones a disabled 
function disabledButtons(){
    $('#btnPublicar').prop('disabled',true);
    $('#btnVer').prop('disabled',true);
    $('#btnEliminar').prop('disabled',true);
    $('#btnEditar').prop('disabled',true);    
}

//Pongo a los botones en enabled
function enabledButtons(){
    $('#btnPublicar').prop('disabled',false);
    $('#btnVer').prop('disabled',false);
    $('#btnEliminar').prop('disabled',false);
    $('#btnEditar').prop('disabled',false);    
}


//Obtenemos los posts del usuario
function getPosts(user){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", "/getPost/"+user, true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            listaPost=categorias=JSON.parse(ajaxRequest.responseText);
            console.log(listaPost);  
            if(listaPost.length>0) 
                printPosts(listaPost);     
        }
    }
    ajaxRequest.send(null);
}

//Add listener to checkboxes
function listenToCheckBox(){
    checkboxes = document.getElementsByClassName("checkbox");
    console.log(checkboxes);
    for(let i=0 ;i<checkboxes.length; i++){
        checkboxes[i].addEventListener('click',function(){
            //Obtengo el id del post
            let id = $(this).attr('id');
            id = id.substring(7,id.length);
            console.log($(this).prop('checked'));
            if($(this).prop('checked')==true){
                //pongo en false a el checkbox que esta activo
                if(checked!=-1){
                    console.log('Doble marcado');
                    $('#revisor'+checked).prop('checked',false);
                }
                checked=id;
                enabledButtons();
                //Verifico si está publicado o no. Si está Publicado, no se puede publicar dos veces y tampoco editar.
                //Caso contrario, sí.
                let estado = $('#estadoPost'+checked).text();
                console.log(estado);
                if(estado==PUBLICADO){
                    $('#btnPublicar').prop('disabled',true);
                    $('#btnEditar').prop('disabled',true);  
                }
            }else{
                checked=-1;
                disabledButtons();
            }
            console.log(checked);
            //if($('#estadoPost'+))
        });
    }
}




//Ponemos los posts en la vista del usuario
function printPosts(lista){
     for(var i=0 ;i<lista.length ; i++){
        //Variable para almacenar el valor de publicado o no publicado. 
        let publicado;
        if(lista[i].publicado==1){
            publicado=PUBLICADO;
        }else{
            publicado=NO_PUBLICADO;
        }

        let registros = '<div class="row" id="'+lista[i].id+'">'+
                    '<div class="col-sm-1 mt-5">'+
                    '<input class=checkbox type="checkbox" id="revisor'+lista[i].id+'" name="checkBox'+lista[i].id+'">'+
                    '</div>'+
                    '<div class="col-sm-11">'+
                    '<h3>'+lista[i].titulo+'</h3>' +
                    '<p id=comLabel'+lista[i].id+'><strong>Comentarios: </strong>...<br>'+
                    '<strong>Calificación: </strong>'+lista[i].valoracion+' ptos.<br>'+
                    '<strong>Estado: </strong> <em id="estadoPost'+lista[i].id+'">'+publicado+'</em><br>'+
                    '</p>'+
                    '</div>'+
                    '<div class="container">'+
                    '<hr>'+
                    '</div>'+
                    '</div>';
        console.log(registros);
        $('#verPosts').append(registros);
        getNumerosComentarios(lista[i].id,lista[i].valoracion,lista[i].id,publicado)
     }
     //Coloco los event listener en los checkboxes
     listenToCheckBox();
}

function getNumerosComentarios(id_post,calificacion,id_estado,publicado){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", "/getNumeroComentarios/"+id_post, true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            let comentarios=JSON.parse(ajaxRequest.responseText);
            console.log(comentarios[0].total);  
            $('#comLabel'+id_post).text('');
            let putLabel = '<strong>Comentarios: </strong>'+comentarios[0].total+'<br>'+
            '<strong>Calificación: </strong>'+calificacion+' ptos.<br>'+
            '<strong>Estado: </strong> <em id="estadoPost'+id_estado+'">'+publicado+'</em><br>';
            $('#comLabel'+id_post).append(putLabel);    
        }
    }
    ajaxRequest.send(null);
}