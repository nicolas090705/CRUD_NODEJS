var mysql = require('mysql2');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
/**/
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended : true
}));


//CONEXION CON MYSQL
var conexion = mysql.createConnection({
  host: 'localhost',
  database: 'node',
  user: 'root',
  password:'n0m3l0'
});

conexion.connect(function(error){
  if(error){
      throw error;
  }else{
      console.log("Conexion Exitosa");
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/agregar',function(req,res){
  // res.send('</h1><form action="/agregarDB" method="get">'+
  // '<label for="nombre">Nombre del producto</label>'+
  // '<input type="text" name="nombre" id="nombre" class="white-text">'+
  // '<label for="precio">Precio de producto</label>'+
  // '<input type="numbre" name="precio" id="precio">'+
  // '<label for="descripcion">Descripcion del produto</label>'+
  // '<input type="text" name="descripcion" id="descripcion">'+
  // '<button class="btn waves-effect waves-light blue darken-1"type="submit">'+
  // 'Enviar<i class="material-icons right">send</i>'+
  // '</button></form><h1>');
  res.render("agregar");
});

app.post('/agregarDB',function(req,res){
  var nombre = req.body.nombre;
  var precio = req.body.precio;
  var descripcion = req.body.descripcion;

  if(nombre!="" && precio!="" && descripcion!=""){
    //INSERTAR 
    conexion.query('INSERT INTO producto(nombre,precio,descripcion) VALUES("'+nombre+'",'+precio+',"'+descripcion+'");',function(error,results){
      if(error) throw error;
      console.log("Producto agregado",results);
      res.render("index");
    });
  }  
});

app.get('/consultar',function(req,res){
  var nombre = [];
  //MOSTRAR
  conexion.query('SELECT * FROM node.producto;',function(error,result,fields){
    if(error)throw error;
       
    // result.forEach(result => {
    //     nombre[0]=result.nombre;
        
    // });
    res.render('consultar',{result:result});
  });
  
});

//ACTUALIZAR
app.get('/actualizar/:nombre',function(req,res){
  const nombre=req.params.nombre;
  conexion.query("SELECT * FROM node.producto WHERE nombre=?",[nombre],(error,results)=>{
    if(error)throw error;
    res.render('actualizar',{user:results[0]});
  })
  //res.send('este es una prueba actualizar');
});

app.post("/actualizarDB",function(req,res){
  var nombreid = req.body.nombreid;
  var nombre = req.body.nombre;
  var precio = req.body.precio;
  var descripcion = req.body.descripcion;

  if(nombre!="" && precio!="" && descripcion!=""){
    //ACTUALIZAR
    //UPDATE producto set nombre='goma', precio=12, descripcion='actualizado' WHERE nombre='Angel';
    conexion.query('UPDATE  producto set nombre="'+nombre+'",precio='+precio+',descripcion="'+descripcion+'" WHERE NOMBRE="'+nombreid+'";',function(error,results){
      if(error) throw error;
      res.render("index");
    });
  }

})

app.get('/eliminar/:nombre',function(req,res){
  nombre= req.params.nombre;
  //ELIMINAR
  //DELETE FROM producto WHERE idproducto=16;
  conexion.query('DELETE FROM producto WHERE nombre="'+nombre+'";',(error,results)=>{
    if(error)throw error;
    res.render('despuesEliminar');
  })
});

app.get('/despuesEliminar', function(req,res){
  res.render('index');
})

app.listen(3000,()=>{
  console.log('Server corriendo en http://localhost:3000')
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



