//Variables globales, velocidad del juego, tamaño
var velocidad = 80;
var tamano = 10;
//rutina para deteccion de colisiones
//metodo de deteccion de colisiones del objeto serpiente
class objeto {
	constructor(){
		this.tamano = tamano;
	}
	//funcion choque
	choque(obj){
		//variables para detectar las colisiones, diferencia de "x" y diferencia de "y" y para que no sea un valor negativo con abs
		var difx = Math.abs(this.x - obj.x);
		var dify = Math.abs(this.y - obj.y);
		//si es mayor o igual que 0 y si es menor que tamaño en x, y
		if(difx >= 0 && difx < tamano && dify >= 0 && dify < tamano){
			return true;
		} else {
			return false;
		}
	}
}
//subclase para crear el objeto
//hereda elementos, variables de objeto serpiente 
class Cola extends objeto {
	constructor(x,y){
		super();
		//variables donde se guardara el valor
		this.x = x;
		this.y = y;
		//variable de recursividad iniciada igual a null
		this.siguiente = null;
	}
	//crea metodo de dibujo con contexto grafico
	dibujar(ctx){
		//si siguiente no es igual a  null 
		if(this.siguiente != null){
			//la funcion se llamara a si misma
			this.siguiente.dibujar(ctx);
		}
		//dar color al objeto serpiente
		ctx.fillStyle = "#00FF00";
		//cuadro que formara el objeto serpiente
		ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
	}
	//funcion setxy recibe x, y, importante para asignar posiciones
	setxy(x,y){
		//si siguiente no es igual a null
		if(this.siguiente != null){
			//antes de asiganr una posicion nueva se almacenara la posicion anterior en el siguiente, asi dara la sensacion de cruzar, pero lo que hace es seguir al objeto serpiente
			this.siguiente.setxy(this.x, this.y);
		}
		//asignar posicion nueva
		this.x = x;
		this.y = y;
	}
	//metodo para agregar el siguiente
	meter(){
		// si siguiente es igual a null
		if(this.siguiente == null){
			//siguiente es igual a new cola, inicialmente se les dara el mismo x, y
			this.siguiente = new Cola(this.x, this.y);
		} else {
			//entonces siguiente se agregara 
			this.siguiente.meter();
		}
	}
	//funcion que devuelve el siguiente
	verSiguiente(){
		return this.siguiente;
	}
}
//subclase para crear la comida aleatoriamente
//hereda elementos variables de objeto serpiente
class Comida extends objeto {
	constructor(){
		super();
		//funcion que pertenece a la clase
		this.x = this.generar();
		this.y = this.generar();
	}
	//funcion generar
	generar(){
		//variable num, eliminar decimales con floor y generar un num entre 0 y 1 con random, donde 0 es inclusivo y 1 no lo es, lo que podria incluir el 0 pero no el 1, 
		//multiplicado por 59 lo que genera numeros aleatorios entre 0 y 59, donde 59 no esta incluido, multiplicado por 10 para generar numeros aleatorios entre 0 y 590 pero de 10 en 10 por el tamaño de la cuadricula de juego
		var num = (Math.floor(Math.random() * 59))*10;
		return num;
	}
	//medotodo colocar igual al constructor, que es mandado a llamar con cada colision y dara una nueva posicion
	colocar(){
		this.x = this.generar();
		this.y = this.generar();
	}
	//crea metodo de dibujo con contexto grafico 
	dibujar(ctx){
		//color del objeto comida
		ctx.fillStyle = "#0000FF";
		//cuadro que formara el objeto comida
		ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
	}
}
//Objetos del juego
//instancias de objeto serpiente
var cabeza = new Cola(20,20);
var comida = new Comida();
//variables booleanas para el movimiento, permitiran habilitar o bloquer los ejes de modo que, cuando se mueva dentro de un eje, no se podra mover en el mismo eje, retrocerder
var ejex = true;
var ejey = true;
var xdir = 0;
var ydir = 0;
//funcion movimiento 
function movimiento(){
	//variables nuevas de cabeza, para la direccion del movimiento
	var nx = cabeza.x+xdir;
	var ny = cabeza.y+ydir;
	//acceder al objeto creado, nueva posicion
	cabeza.setxy(nx,ny);
}
//funcion para llamar con eventos de teclas
//objeto event, objeto interno de javascript que permite acceder a la informacion de un evento en especifico, por ejemplo que tecla lo desencadeno
function control(event){
	//variables obteniendo propiedad keyCode
	var cod = event.keyCode;
	// si eje "x" esta activo nos podemos mover en eje "y", no se puede retroceder
	if(ejex){
		//si nos movemos hacia arriba (38 obtenido del keyCode), si nos movemos en eje "y" no nos tenemos que mover en eje "x" desactivar direccion de eje "x" y activar direccion de eje "y"  
		if(cod == 38){
			ydir = -tamano;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
		//si nos movemos hacia abajo (40 obtenido del keyCode), si nos movemos en eje "x" no nos tenemos que mover en eje "y" desactivar direccion de eje "x" y activar deireccio de eje "y" 
		if(cod == 40){
			ydir = tamano;
			xdir = 0;
			ejex = false;
			ejey = true;
		}
	}
	// si nos estamos moviendo en el eje "y" ya nos podemos mover en el eje "x"
	if(ejey){
		//si nos movemos a la derecha (37 obtenido del keyCode), significa que estamos sobre el eje "y" y desactivar la direccion de el eje "y" y activar eje "x", evita que el objeto se mueva de forma diagonal
		if(cod == 37){
			ydir = 0;
			xdir = -tamano;
			ejey = false;
			ejex = true;
		}
		//si nos movemos a la izquierda (39 obtenido del keyCode), significa que estamos sobre el eje "y" y desactivar direccion de eje "y" y activar direccion de eje "x", evita que el objeto se mueva de forma diagonal
		if(cod == 39){
			ydir = 0;
			xdir = tamano;
			ejey = false;
			ejex = true;
		}
	}
}
//funcion fin de juego, todas las variables a su valor original
function findeJuego(){
	xdir = 0;
	ydir = 0;
	ejex = true;
	ejey = true;
	cabeza = new Cola(20,20);
	comida = new Comida();
	alert("PERDISTE!!... Fin del juego");
}
//funcion choquepared, deteccion de la colisiones con las paredes
function choquepared(){
	//si cabeza en eje "x" es menor a 0 o mayor a 590 y cabeza en eje "y" es menor a 0 o mayor a 590, no menor-igual porque al tocar el cuadro finalizaria el juego  
	if(cabeza.x < 0 || cabeza.x > 590 || cabeza.y < 0 || cabeza.y > 590){
		//si sucede entonces
		findeJuego();
	}
}
//funcion choquecuerpo,
function choquecuerpo(){
	//variable temp inicialmente igual a null
	var temp = null;
	//try-catch para evaluar errores
	try{
		//versiguiente del metodo cola, al principo del juego versiguiente igual a null
		temp = cabeza.verSiguiente().verSiguiente();
	}catch(err){
		//no se puede acceder 
		temp = null;
	}
	//bucle que se ejecutara hasta que temp no sea null
	while(temp != null){
		//si cabeza choque con temp, si cabeza choca con el cuerpo del objeto serpiente 
		if(cabeza.choque(temp)){
			//fin de juego
			findeJuego();
		} else {
			//entonces se podra versiguiente
			temp = temp.verSiguiente();
		}
	}
}
//motor de juego 1
//funcion que permite dibujar, renderizar los graficos
function dibujar(){
	//acceder al canvas
	var canvas = document.getElementById("canvas");
	//acceder al contexto grafico del canvas
	var ctx = canvas.getContext("2d");
	//contexto grafico de canvas, cuadro de limpieza todo lo que este detras se borrara, x, y ancho y alto del cuadro
	ctx.clearRect(0,0, canvas.width, canvas.height);
	//aquí abajo va todo el dibujo con el contexto grafico ya creado
	cabeza.dibujar(ctx);
	comida.dibujar(ctx);
}
//motor de juego 2
//funcion que permite la animacion, todas las funciones se llamaran aqui
//funcion principal de la animacion
function main(){
	//esta funcion se debe mandar a llamar antes sino crea un bug en donde parece que choca antes de llegar al cuerpo del objeto
	choquecuerpo();
	choquepared();
	dibujar();
	movimiento();
	//metodo choque que esta en la clase padre de ambas
	//si cabeza colisiona con comida
	if(cabeza.choque(comida)){
		//comida sera colocada aleatoriamente mediante el metodo colocar
		comida.colocar();
		//al colisionar, cabeza metera el siguiente
		cabeza.meter();
	}
}
//bucle con parametros, llamara a la funcion cada tiempo determinado
setInterval("main()", velocidad);