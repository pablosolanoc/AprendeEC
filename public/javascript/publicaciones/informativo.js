let postVisibles=[];
let foroVisibles=[];
let mapaCategoriasPost;
let mapaCategoriasForo;
$(function(){
	document.title='Informativo AprendEC';
	verificarSearch();
	$('#linkLastPost').click(function(){
		//Llamamos a la funcion que nos devolverá los ultimos posts
		document.title='Últimos posts';
		postPublicados(1);
	});
	$('#linkLastForos').click(function(){
		//Llamamos a la funcion que nos devolverá los ultimos posts
		document.title='Últimos foros';
		forosPublicados(1);
	});

});

function verificarSearch(){
	console.log($('#infoBuscar').text());
	console.log($('#info_username').text());
	console.log($('#info_categoria').text());
	console.log($('#info_post_foro').text());
	console.log($('#info_texto').text());
	if($('#infoBuscar').text()=='1'){
		//Pongo el contenido de la búsqueda
		postPublicados(0);
	}else{
		//Poner una imagen en el inicio de la página informativa en el contenedor.
	}
}

//funcion para obtener los ultimo post publicados
function postPublicados(codigo){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", "/getLastPost", true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log('Posts obtenidos exitosamente');
            //window.open('/modPublicaciones')
            //Obtenemos la respuesta que nos da el servidor
            postVisibles=JSON.parse(ajaxRequest.responseText);
            console.log(postVisibles);
            //Mandamos a imprimir eso en la pantalla de informativo 
			mapaCategoriasPost = getCategoriasMapa(postVisibles);
			//Si el codigo es 1, obtengo los ultimos post publicados, sino solo obtengo pero mando a los mas destacados
			if(codigo ==1){
				limpiar();
            	printPost(postVisibles,mapaCategoriasPost,'viewPost',1);
			}else if(codigo ==0){
				forosPublicados(codigo);
			}
			       
        }
    }
    ajaxRequest.send(null);
}

//funcion para obtener los ultimo post publicados
function forosPublicados(codigo){
    let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", "/getLastForo", true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log('Foros obtenidos exitosamente');
            //window.open('/modPublicaciones')
            //Obtenemos la respuesta que nos da el servidor
            foroVisibles=JSON.parse(ajaxRequest.responseText);
            console.log(foroVisibles);
            //Mandamos a imprimir eso en la pantalla de informativo 
			mapaCategoriasForo = getCategoriasMapa(foroVisibles);
			if(codigo==1){
				limpiar();
            	printPost(foroVisibles,mapaCategoriasForo,'viewForo',0);
			}else if(codigo==0){
				imprimirBusqueda();
			}
			       
        }
    }
    ajaxRequest.send(null);
}

//Funcion para imprimir de acuerdo a los campos de busqueda.
function imprimirBusqueda(){
	if($('#info_post_foro').text().includes("post")){
		//Si es true es post
		console.log('Buscando Posts')
		printPost(postVisibles,mapaCategoriasPost,'viewPost',1);
	}else{
		//Si es false es foro
		console.log('Buscando Foro')
		printPost(foroVisibles,mapaCategoriasForo,'viewForo',0);
	}
	setNadaSearch();

}

function setNadaSearch(){
	let ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", "/setInfo", true);
    ajaxRequest.onreadystatechange = function(){
        if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            console.log('setteando info');
			console.log(ajaxRequest.responseText);	
			$('#infoBuscar').text('0')       
        }
    }
    ajaxRequest.send(null);
}


//Funcion para obtener las categorias de los post
function getCategoriasMapa(lista){
	let mapa = new Map();
	for (var i =0; i <lista.length ; i++) {
		//Verifico si el mapa tiene el id ya ingresado para obtener los valores 
		console.log(mapa.has(lista[i].id));
		if(mapa.has(lista[i].id)){
			let valores=[];
			//Recorro los valores para almacenarlos  en una variable temporal
			var j =0;
			if(mapa.get(lista[i].id).length <= 1){
				valores[j]=mapa.get(lista[i].id)[0];
				valores[j+1]=lista[i].nombre;
			}else{
				for(j=0; j<mapa.get(lista[i].id).length; j++){
					valores[j]=mapa.get(lista[i].id)[j];
				}
				console.log(valores);
				valores[j+1]=lista[i].nombre;
			}
			//setteo mi mapa
			mapa.set(lista[i].id,valores);
			//mapa.set(lista[i].id,lista[i].nombre);

		}else{
			//Agrego por primera vez el nombre de la categoria con el id correspondiente
			let cat = [];
			cat[0]=lista[i].nombre;
			mapa.set(lista[i].id,cat);
		}
	}
	console.log(mapa);
	//Retorno el mapa de las categorias
	return mapa;
}

function limpiar(){
    $('#contenido > div').each(function(){
        $(this).remove();
    })
}

//Funcion para poner en pantalla los últimos post publicados
function printPost(lista,mapa,link,p_o_f){
	let id=-1;
	let mapaAuxiliar=new Map();
	let contador=0;
	for(var i=0 ;i<lista.length; i++){
		if(mapaAuxiliar.has(lista[i].id)){
			continue;
		}
		mapaAuxiliar.set(lista[i].id,"");
		let categorias="";
		//Obtengo un string con las categorias del post
		let listaCate = mapa.get(lista[i].id);
		for (var j = 0 ; j<listaCate.length; j++){
			categorias=categorias +"<em>"+ listaCate[j] + "</em>, ";
		}
		let agregado = " ";
		//SI es 1 entonces es post y se debe agregar la calificación, sino es un foro
		if(p_o_f==1){
			agregado = "<strong>Calificación: "+lista[i].valoracion + " puntos</strong>";
		}
		categorias=categorias.substring(0,categorias.length-2)+".";
        let registros = '<div class="row" id="'+lista[i].id+'">'+
                    '<div class="col-sm-1 mt-5">'+
                    '</div>'+
                    '<div class="col-sm-11">'+
                    '<h3><a href="/'+link+'/'+lista[i].id+"/"+lista[i].username_usuario+'/1'+'" style="color:black">'+lista[i].titulo+'</a></h3>' +
                    '<strong>Categorias: </strong>'+categorias+'<br>'+
                    '<strong>Publicado por: </strong>'+lista[i].username_usuario+'<br>'+
					'<strong>Fecha de publicación: </strong>'+lista[i].fecha_hora+'<br>'+
					agregado+
                    '</p>'+
                    '</div>'+
                    '<div class="container">'+
                    '<hr>'+
                    '</div>'+
					'</div>';
		/**
		 * console.log($('#info_username').text());
			console.log($('#info_categoria').text());
			console.log($('#info_post_foro').text());
			console.log($('#info_texto').text());
		 */
		if($('#infoBuscar').text()=='1'){
			console.log('Hago el filtro');
			let encontrado=0;
			let categoriaCenti=0;
			if(encontrado ==0 && $('#info_categoria').text()==true){
				//Buscando por categoria
				categoriaCenti++;
				if(categorias.includes($('#info_texto').text())){
					encontrado=1;
					contador++;
				}
			}
			if(encontrado ==0 && $('#info_username').text()==true){
				//Buscando por nombre de usuario
				categoriaCenti++;
				if(lista[i].username_usuario.includes($('#info_texto').text())){
					encontrado=1;
					contador++;
				}
			}
			if(encontrado==0 && categoriaCenti<=0){
				//No se busco por ninguno de los campos. entonces solo vamos a buscar el que coincida
				if(registros.includes($('#info_texto').text())){
					encontrado=1;
					contador++;
				}
			}
			if(encontrado==1){
				console.log(registros);
        		$('#contenido').append(registros);
			}			
		}else{
			console.log(registros);
        	$('#contenido').append(registros);
		}
        
	 }
	 if($('#infoBuscar').text()=='1'){
		if(contador==0){
			$('#contenido').append('<div class="container text-center"><i style="text-aling: center" class="fas fa-ban fa-7x"></i></div>');
		}
	 }
}