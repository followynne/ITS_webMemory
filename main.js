import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import images from './img/*.jpg';

let isClicked=false;
let cardVal, cardVal2, card1, card2, DatiJson, selection;
let tempArr = [], tempArr2 = [], randArr = [];
let cardCount, getScore, record; 

$(document).ready(() => {
   
   fetch("http://localhost:3000/data").then((response) => response.json()).then((data) => 
   {
      DatiJson = data;
      createDiv(DatiJson);
      checkRequestData(DatiJson);
      selectRandomCards(DatiJson);
      addCards(DatiJson);
      cardCount = DatiJson.cardsSchema.rows*DatiJson.cardsSchema.columns;
      
      $('.external').on('click', (event) =>{
         selection= $(event.target);
         if (!isClicked) {
            showFirstCard(selection);
            return;
         } else {
            showSecondCard(selection);
         }
         checkCards();
      });
   })
})

const createDiv = () => {

   sessionStorage.setItem("Score", 1000);  
   if (!(localStorage.getItem("record"))){
      localStorage.setItem("record", 0);
   }
   getScore = sessionStorage.getItem("Score");
   record = localStorage.getItem("record");
   
   let scoreDiv = `<div class="row-flex d-flex align-items-center points">
                     <div class="col-sm-6 colPoints d-flex justify-content-center align-items-center">
                        <div class ="update">Punteggio: ${getScore}</div>
                     </div>
                     <div class="col-sm-6 colPoints d-flex justify-content-center align-items-center">
                        <div>Record: ${record}</div>
                     </div>
                  </div>
                     `;
   $(".score").html(scoreDiv);
}

const checkRequestData = (par) => {

   if (par.cardsSchema.columns > 6){
      alert("Mi spiace, consento a schermo pieno solo 6 colonne. Modifico la tua richiesta.");
      par.cardsSchema.columns = 6;
      par.cardsSchema.rows = (Math.floor(par.cardsSchema.columns*par.cardsSchema.rows/6)+1);      
   }
   if (par.cardsSchema.rows == 0 || par.cardsSchema.columns == 0){
      alert('Mi spiace, hai selezionato 0 come valore di riga e/o colonna. Modifica le tue scelte.')
      par.cardsSchema.rows = 1;
      par.cardsSchema.columns = 2;
   } else if ((par.cardS.length<(par.cardsSchema.rows*par.cardsSchema.columns)/2)) {
      alert("Hai chiesto troppe carte, decido mi.");
      par.cardsSchema.rows = 1;
      par.cardsSchema.columns = 6;
   } else if ((par.cardsSchema.rows*par.cardsSchema.columns)%2 != 0) {
      alert("Hai chieste un n dispari di carte. Ti credi furbo?")
      par.cardsSchema.rows = 1;
      par.cardsSchema.columns = 4;
   }
}

const selectRandomCards = (par) => {

   for (let i = 0; i < ((par.cardsSchema.rows*par.cardsSchema.columns)/2); i++){
      if (!(par.cardS[i].src)){
         throw alert("Hai dei valori non definiti. Correggi il tuo Json. Nel frattempo, Sarah Connor verrà terminata. ");
      } else {
      tempArr[i] = par.cardS[i].src;
      }
   }
   tempArr2 = tempArr.slice();
   randArr = tempArr.concat(tempArr2);
   randArr.sort(function(a,b){return 0.5 - Math.random()});
}

const addCards = (par) => {

   for (let j = 0; j <(par.cardsSchema.rows); j++){
      let cardLayout ="";
      cardLayout += `<div class="row d-flex mt-3 justify-content-center justify-content-around">`
      for (let i=0; i<(par.cardsSchema.columns); i++){
            cardLayout += `<div class="d-flex col-lg-2 col-md-4 col-6 justify-content-center justify-content-around">
                              <div class="external colImg d-flex flex-wrap justify-content-center">
                                 <img class="front" src="${randArr.pop()}">
                                 <img class="back" src="/Red_back.0f2af71a.jpg">
                              </div>
                           </div>`;
      }          
      $('.addEl').append(cardLayout);  
   }
}

const showFirstCard = (x) => {
   
   if (x.closest(".back").is(':visible')) {
      cardVal = x.siblings().attr('src');
      x.closest(".back").fadeOut(400);
      x.parent().addClass('noClick');
      card1 = x;
      isClicked = true;
   }
}

const showSecondCard = (x2) => {

   if (x2.closest(".back").is(':visible')){
      cardVal2 = x2.siblings().attr('src');
      x2.closest(".back").fadeOut(400);
      x2.parent().addClass('noClick')
      card2 = x2;
   }
}

const checkCards = () => {

   if (cardVal === cardVal2)
   {
      card1 = "", card2= "";
      setTimeout(() => {
         counterCardsRemaining();
      }, 500);
   }
   else{
      $(".addEl").addClass("noClick");
      setTimeout(() => {
         card1.fadeIn(400);
         card2.fadeIn(400);
         cardVal = "", cardVal2 = "";
         card1.parent().removeClass('noClick');
         card2.parent().removeClass('noClick');         
         $(".addEl").removeClass("noClick");
         sessionStorage.setItem("Score", getScore-=5);      
         $(".update").text(`Il tuo punteggio: ${getScore}`);
         if (getScore === 0) {
            sconfitta();
            return;
         }
      }, 600);
   }
   isClicked=false;
}

const counterCardsRemaining = () => {
   cardCount -= 2;
   if (cardCount === 0){
      return vittoria();
   }
};

const vittoria = () => {

   if (getScore === 0) {
      sconfitta();
   } else {
      if (getScore > record) {
         localStorage.setItem("record", getScore);
      }
      alert('Complimenti per la vittoria! Premi f5 per giocare ancora. :)');
      $(".addEl").addClass("noClick");
   }
}

const sconfitta = () => {

   $(".addEl").addClass("noClick");
     alert('Grazie per aver giocato. Oggi hai perso... Per riprovare premi f5.');
}