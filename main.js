import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import images from './img/*.jpg';

let isClicked=false;
let cardVal, cardVal2, card1, card2, DatiJson, selection;
let tempArr = [], tempArr2 = [], randArr = [];

let cardCount;

let selectRandomCards = (par) => {

   for (let i = 0; i < ((par.cardsSchema.columns*par.cardsSchema.rows)/2); i++){
      tempArr[i] = par.cardS[i].src;
   }
   console.log(tempArr);
   tempArr2 = tempArr.slice();
   console.log(tempArr2);
   randArr = tempArr.concat(tempArr2)
   randArr.sort(function(a,b){return 0.5 - Math.random()});
   console.log(randArr)
   
}

let addCards = (par) => {
   for (let j = 0; j <=(par.cardsSchema.rows)-1; j++){
      let cardLayout ="";
      cardLayout += `<div class="row d-flex mt-4 justify-content-center justify-content-around">`
      for (let i=0; i<=(par.cardsSchema.columns)-1; i++){
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

let showFirstCard = (x) => {
   
   if (x.closest(".back").is(':visible')){
      cardVal = x.siblings().attr('src')
      x.closest(".back").fadeOut();
      x.parent().addClass('noClick')
      card1 = x;
      isClicked = true;
/*       console.log(cardVal)
      console.log(isClicked)
      console.log(card1) */
   }   
}

let showSecondCard = (x) => {

   if (x.closest(".back").is(':visible')){
      cardVal2 = x.siblings().attr('src')
      x.closest(".back").fadeOut();
      x.parent().addClass('noClick')
      card2 = x;
/*       console.log(cardVal2) */
   }
}

let checkCards = () => {

   if (cardVal === cardVal2){

      card1.parent().removeClass('.external');
      card2.parent().removeClass('.external');
      card1 = "", card2= "";
      isClicked=false;
      counterCardsRemaining();
   
   } else {

      card1.show(1000);
      card2.show(1000);
      cardVal = "", cardVal2 = "";
      card1.parent().removeClass('noClick');
      card2.parent().removeClass('noClick');
      isClicked=false;

   }
}

/* let counterCardsRemaining = () => {
   if (cardCount === 2){
      vittoria();
   } else {
      cardCount -= 2;
      console.log(cardCount)
   }
};

let vittoria = () => {
   alert('Complimenti per la vittoria, qua arrivano i complimenti!')
} */

$(document).ready(() => {

   fetch("http://localhost:3000/main/").then((response) => response.json())
      .then((data) => {
         DatiJson = data;
         if (DatiJson.cardsSchema.rows === 0 || DatiJson.cardsSchema.columns === 0){
            alert('Mi spiace, hai selezionato 0 come valore di riga e/o colonna. Modifica le tue scelte.')
            return;
         }
         selectRandomCards(DatiJson);
         addCards(DatiJson);
         cardCount = DatiJson.cardsSchema.rows*DatiJson.cardsSchema.columns
         
         $('.external').on('click', (event) =>{
            selection= $(event.target);
            if (!isClicked) {
               showFirstCard(selection);
               return;
            } else {
               showSecondCard(selection);
            }
            checkCards();
         })
      }
   );


}) 