import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import $ from 'jquery'

const addCards = () => {
   
}

$(document).ready(() => {

   fetch("http://localhost:3000/cardsSchema").then((result) => result.json())
   .then((data) => {
      for (let j = 0; j<=data.rows; j++){
         for (let i = 0; i<=data.columns; i++){
            const cardLayout = `<div class="col col-lg-1 col-md-4 col-sm-6">
                              <div class="d-flex card justify-content-center align-items-center">
                                 Re di Spade</div>
                                 </div>`;
            $('.addEl').append(cardLayout);
         }
      };
   })

    
})








/* creare funz per creare il div con il punteggio e il record inserito
let punteggio = () => {

    //let pointsStart = `<div class="col d-flex justify-content-end>
                            Punteggio:` +  + `

                         </div>`
    

};*/

// creare funzione in cui, partendo da 1000, restituisco il punteggio e lo aggiorno in rif alle show
// localStorage el per il record