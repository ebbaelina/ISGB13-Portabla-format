'use strict';

window.addEventListener('load', init); //lyssnare load, som lyssnar på när DOMen laddat klart och anropar funktion 

function init (){ //Efter load anrops funktionen init
document.querySelector('#searchform').addEventListener('submit', searchButton); //Lägger lyssare på sökknappen som anropar funkationen seachButton

}

function searchButton (e){ //funktion som tar emot lyssnar objektet från submitknapp (e) 
e.preventDefault(); //Avbryter defaultbeteendet på submitknappen, svaret skickas inte till servern 
document.querySelector('#innehall').innerHTML = null; //sätter innehåller i div elementet med id #innehall till null 
search(document.querySelector('#search').value, document.querySelector('#innehall')); //Anropar funktionen search. Värdet som anges i sökfältet + div med id #innehall skickas med till funktionen 
}

function search (searchValue, container){
// kod ner till rad 24 taget från https://rapidapi.com/apidojo/api/shazam/ för att komma åt Shazams API 
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
            'X-RapidAPI-Key': '2a642f936bmsh39da5abf6485156p1992e5jsn1a952a535bb7'
        }  
    };
    
    fetch('https://shazam.p.rapidapi.com/search?term=' + encodeURIComponent(searchValue) + '&locale=en-US&offset=0&limit=5', options) 
        .then(function(response){
            return response.json() //returar responsen i json format 
        }).then(function(data){ //funktion som ska presentera datan på webbsidan 
        console.log(data); 

        
        //Skapar bootstap kort(kort 1) som läggs in i div med id innehall 
        let kort1 = document.createElement('div');
        kort1.setAttribute("id", "card1");
        kort1.className = 'card'; //insperation till bootstrap korten taget från github https://github.com/karlstad-business-school/ISGB13-Portabla-format-VT22/blob/main/F2/kodexempel/script.js
        kort1.style.maxWidth = '50rem'; 
        kort1.style.width = 100% 
        container.appendChild(kort1); //lägger in kort1 i container 

        //ska skriva ut vädet som är anget i sökrutan i en textnod, som läggs in i bootstrap kortet
        let cardHeader = document.createElement('h2'); 
        let headerTxt = document.createTextNode(searchValue); //textNode som innehåller det användaren skrivit in i sökrutan
        cardHeader.setAttribute('id', 'cardheader'); //id satt på h2 elementet för att styla i css
        cardHeader.appendChild(headerTxt); //textNode läggs in i h2 elementet
        kort1.appendChild(cardHeader);  //h2 elementet läggs in i kortet

        //img element skapas och bild från api läggs in 
        let cardImage = document.createElement('img');
        cardImage.className = 'card-img-top';
        cardImage.setAttribute('id', 'image'); 
        
        cardImage.src = data.artists.hits[0].artist.avatar; //hämtar ut aktuell bild från JSON array. bild baserat på vad användaren har sökt på för artiskt/band 
        kort1.appendChild(cardImage); //bild läggs in i kortet
        //Kort 1 kod tar slut här 

        //Skapar bootstrap kort (kort 2) som läggs in i div med id innehall
        let kort2 = document.createElement('div');
        kort2.setAttribute("id", "card2"); //insperation till bootstrap korten taget från github https://github.com/karlstad-business-school/ISGB13-Portabla-format-VT22/blob/main/F2/kodexempel/script.js
        kort2.className = 'card'; 
        kort2.style.maxWidth = '50rem'; 
        kort2.style.width = 100%
        container.appendChild(kort2);

        

        //ordered list skapas och lägg in i kort 2
        let lista = document.createElement('ol'); 
        lista.setAttribute('id', 'lista'); 
        kort2.appendChild(lista); 
        
        //skapar rubrik för ol listan
        let cardParagraph = document.createElement('th'); 
        let paragraphText = document.createTextNode('Top tracks');
        cardParagraph.setAttribute('id', 'cardtext'); //sätter på id på h2 elementet för att styla i css
        cardParagraph.appendChild(paragraphText); 
        lista.appendChild(cardParagraph);  

        //section element skapas och i den läggs ordered list in 
        /*let section1 = document.createElement('section'); 
        section1.setAttribute('id', 'section1'); //id skapas till section elementet för att styla med css
        section1.appendChild(lista); 
        kort2.appendChild(section1); */

        //for loop som loopar igenom alla top tracks i JSON array samt alla albumcover bilder till tillhörande top track 
        for(let i = 0; i < 5; i++){
            let li = document.createElement('li'); //för varje loop skapas ett li element  
            li.setAttribute('id', 'li');  
            li.textContent = data.tracks.hits[i].track.title + ' '; //varje li element innehåller titeln på låten i den aktuella arrayplatsen 

            let a = document.createElement('a'); //ett a element skapas 
            a.setAttribute('href', 'https://www.shazam.com/track/' + data.tracks.hits[i].track.key + "/"); //a elementet blir en länk, attributet href läggs på. innehåller länk till shazams hemsida som hämtas i JSON array 
            let link = document.createTextNode("Läs mer om låten här"); //en textnode skapas och läggs in i a elementet
            a.appendChild(link); //href läggs in i a elementet 
            li.appendChild(a); //a elementet läggs in i li elementet 

            kort2.appendChild(li); //varje skapad li läggs in i kort 2 
            lista.appendChild(li); //varje skapad li läggs in i ordered list 

            let albumCover = document.createElement('img'); //img element skapas 
           // albumCover.className = 'card.image-right';
            albumCover.setAttribute('id', 'albumcover'); //id läggs för att kunna styla i css 
            albumCover.style.display = "none"; //bild ska ej visas förrens musen är över ett li element - därför göms elementet innan functionen för onmouseover anropas
            albumCover.src = data.tracks.hits[i].track.images.coverart; //img elementet innehåller bild hämtad från JSON array 
            kort2.appendChild(albumCover); //img läggs in i kort 2


            //för att visa albumcover bild när musen pekar på en av top tracks har jag tagit hjälp av https://www.sitepoint.com/community/t/on-mouseover-display-image-first-post/35684/2
            li.onmouseover = function(){ //när musen är på ett element i li så visas aktuell bild kopplat till det li elementet
            albumCover.style.display = "block";  
            }

            li.onmouseout = function(){ //när musen lämnar li elementet så ska img elementet inte visas längre 
                albumCover.style.display = "none"; 
            }

        }
            
    });
}

