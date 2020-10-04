let sentiment;
let statusEl;
let submitBtn;
let inputBox;
let sentimentResult;

var listaProdutosRecomendados = [];
let catalogo = 
    [
        {
            nome: 'Bateria 1',
            preco: 123,
            familia: 1
        },
        {
            nome: 'Bateria 2',
            preco: 200,
            familia: 1
        },
        {
            nome: 'Guitarra 1',
            preco: 200,
            familia: 2
        },
        {
            nome: 'Guitarra 2',
            preco: 200,
            familia: 2
        },
        {
            nome: 'CDJ 1',
            preco: 200,
            familia: 3
        },
        {
            nome: 'CDJ 2',
            preco: 200,
            familia: 3
        },
        {
            nome: 'Acessorio 1',
            preco: 200,
            familia: 4
        }
    ]

    var app = new Vue({
        el: '#app',
        data: {
            cardinfos: catalogo,
            currentIdx: 0,
            listaProdutosRecomendados: listaProdutosRecomendados
        },
        methods: {
            regista: function (event) {
                // `this` inside methods points to the Vue instance
                alert('Produto: ' + event.nome + '!')
                RegistaVisualizacao(event.familia);
              },
              limpaTracking(){
                localStorage.setItem('tracking',[] );
                RegistaVisualizacao(0);
              },
              start: function(){
                RegistaVisualizacao(0);
              }
    
        },
        beforeCreate: function(){
            
        },
        mounted: function () {
            this.$nextTick(function () {
              // Will be executed when the DOM is ready
              this.start();
            })
          }
    
    })

function RegistaVisualizacao(familiaID){

    var stringJson = localStorage.getItem('tracking');
    var tracking = [];
    if (stringJson && stringJson != 'undefined') {
        tracking = JSON.parse(stringJson)
    }    
    if (familiaID != undefined && familiaID > 0) {
    tracking.push(familiaID);
    }
    var tipo = ObtemTipoCliente(tracking);
    atualizaRecomendacoes(tipo);
    localStorage.setItem('tipo',tipo );
    console.log('tipo: ' + tipo);
    var jsonString = JSON.stringify(tracking);
    localStorage.setItem('tracking',jsonString );
}

function ObtemTipoCliente(listaFamilias){
    const totalItems = listaFamilias.length
    const uniqueItems = [...new Set(listaFamilias)]
    var recomendation = 0;
    uniqueItems.forEach(currFamilia => {
      const numItems = listaFamilias.filter(familia => familia === currFamilia) 
      console.log(`Familia ${currFamilia} represents ${numItems.length * 100 / totalItems}%`)
      if ((numItems.length * 100 / totalItems) > 70 ) {
        recomendation = currFamilia;
      }
    })
    return recomendation;
}


function atualizaRecomendacoes(tipo){
    listaProdutosRecomendados = [];
    if (tipo > 0) {
        listaProdutosRecomendados = catalogo.filter(x => x.familia == tipo);
    }
    app.listaProdutosRecomendados = shuffleArray(listaProdutosRecomendados);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function setup() {
  noCanvas();
  // initialize sentiment
  //sentiment = ml5.sentiment('movieReviews', modelReady);

  // setup the html environment
  statusEl = createP('Loading Model...');
  inputBox = createInput('Today is the happiest day and is full of rainbows!');
  inputBox.attribute('size', '75');
  submitBtn = createButton('submit');
  sentimentResult = createP('sentiment score:');

  for (let i = 0; i < catalogo.length; i++) {
    console.log(catalogo[i].nome);
  }

  // predicting the sentiment on mousePressed()
  submitBtn.mousePressed(getSentiment);
}

function getSentiment() {
  // get the values from the input
  const text = inputBox.value();

  // make the prediction
  const prediction = sentiment.predict(text);

  // display sentiment result on html page
  sentimentResult.html(`Sentiment score: ${prediction.score}`);
}

function modelReady() {
  // model is ready
  statusEl.html('model loaded');
}