import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import images from './img/*.jpg';
import { createDecipheriv } from 'crypto';
import { TIMEOUT } from 'dns';

let isClicked=false;
let cardVal, cardVal2, card1, card2, DatiJson, selection;
let tempArr = [], tempArr2 = [], randArr = [];
let cardCount;
let getScore = sessionStorage.getItem("cardScore");
let record = localStorage.getItem("record");

const createDiv = () => {
   
   sessionStorage.setItem("cardScore", 1000);  
   if (!(record)){
      localStorage.setItem("record", 0);
   }

   let scoreDiv = `<div class="row-flex justify-content-center align-items-center">
                     <div class="col d-flex align-items-start">
                        <div class="points d-flex justify-content-center align-items-center">
                           <div class ="update">Il tuo punteggio: ${sessionStorage.getItem("cardScore")}</div>
                        </div>
                     </div>
                     <div class="col d-flex align-items-end">
                        <div class="points d-flex justify-content-center align-items-center">
                           <div>Il tuo record: ${localStorage.getItem("record")}</div>
                        </div>
                     </div>
                  </div>`
   $(".score").html(scoreDiv);   

}

const checkRequestData = (par) => {

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

   for (let i = 0; i < ((par.cardsSchema.columns*par.cardsSchema.rows)/2); i++){
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

let addCards = (par) => {
/* 
   if (par.cardS.columns > 7){
      console.log("Mi spiace, consento a schermo pieno solo 7 colonne. Modifico la tua richiesta con più colonne.");



   } */

   for (let j = 0; j <(par.cardsSchema.rows); j++){
      let cardLayout ="";
      cardLayout += `<div class="row d-flex mt-4 justify-content-center justify-content-around">`
      for (let i=0; i<(par.cardsSchema.columns); i++){
         cardLayout += `<div class="col d-flex justify-content-center justify-content-around">
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
   
   if (x.closest(".back").is(':visible'))
   {
      cardVal = x.siblings().attr('src');
      x.closest(".back").hide();
      x.parent().addClass('noClick');
      card1 = x;
      isClicked = true;
   }

}

const showSecondCard = (x2) => {

   if (x2.closest(".back").is(':visible')){
      cardVal2 = x2.siblings().attr('src')
      x2.closest(".back").hide();
      x2.parent().addClass('noClick')
      card2 = x2;
   }
}

let checkCards = () => {

   if (cardVal === cardVal2){
      card1 = "", card2= "";
      counterCardsRemaining();
   } else {
      $(".addEl").addClass("noClick");
      setTimeout(() => {
         card1.show();
         card2.show();
         cardVal = "", cardVal2 = "";
         card1.parent().removeClass('noClick');
         card2.parent().removeClass('noClick');         
         $(".addEl").removeClass("noClick");
      }, 1000);
      sessionStorage.setItem("cardScore", getScore-=5);
      update();
      if (getScore === 0){
         sconfitta();
      }
   }
   isClicked=false;

}

let update = () => {
   $(".update").text(`Il tuo punteggio: ${sessionStorage.getItem("cardScore")}`);
}

let counterCardsRemaining = () => {
   cardCount -= 2;
   console.log(cardCount)
   if (cardCount === 0){
      return vittoria();
   }
};

let vittoria = () => {
   if (updatingScore === 0) {
      return sconfitta();
   } else {
      localStorage.setItem("record", updatingScore);
      alert('Complimenti per la vittoria, qua arrivano i complimenti!');
      $(".external").addClass("noClick");
      return;
   }
}

let sconfitta = () => {
   //return window.prompt("Hai perso, mi spiace... ritenta?");
  alert('Thank You.');
  window.location.reload();
}

$(document).ready(() => {

   createDiv();

   fetch("http://localhost:3000/data").then((response) => response.json()).then((data) => 
      {
      DatiJson = data;
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

// set timeout to put at line 187!
// add modify Col-Row on json at createDiv
// find better ways for animate cards
// adjust css styles

