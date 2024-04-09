// Your code here
document.addEventListener('DOMContentLoaded',()=>{
    const lists= document.querySelector('ul')
    lists.textContent=""
    
    fetch("http://localhost:3000/films")
    .then(response => {
      if(!response.ok){
        throw new Error('Could not fetch resource')
      }
      return response.json()
    })
    .then(data => {
      data.forEach(movie => {
        const li = document.createElement('li')
        li.innerHTML +=`${movie.title}`
        lists.appendChild(li)
        li.addEventListener('click',(e)=>{
          e.preventDefault()
          displayDetails(movie)
        })

      })
    })
    .catch(error => console.error())
  
  })

  //This updates the number oftickets remaining after every click on the buy button
  function update(movie){
    movie.tickets_sold +=1
    updated_tickets =document.getElementById('ticket-num')
    updated_tickets.innerHTML=`${movie.capacity-movie.tickets_sold} tickets`
    updateSoldTickets(movie)
  }

function updateSoldTickets(movie){
  fetch(`http://localhost:3000/films/${movie.id}`,{
    method:'PATCH',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify(movie)
  })
  .then(res => res.json())
  .then(movie=>console.log(movie))
}


function displayDetails(movie){
    const title= document.getElementById('title')
    title.textContent=movie.title

    const runtime = document.getElementById('runtime')
    runtime.innerHTML=`<p>runtime: ${movie.runtime}</p>`

    const showtime = document.getElementById('showtime')
    showtime.innerHTML=`<p>runtime: ${movie.showtime}</p>`

    
    const poster = document.getElementById('poster')
    poster.src=`${movie.poster}`
    poster.alt=`${movie.title}`
    
    const description =document.getElementById('film-info')
    description.innerHTML=`<p>${movie.description}</p>`
    //
    const remaining=document.getElementById('ticket-num')
    remaining.innerHTML=`${movie.capacity-movie.tickets_sold} tickets`
    //initialize my button
    const buyTicket= document.getElementById('buy-ticket')
    buyTicket.addEventListener('click',(e)=>{
      e.preventDefault()
      update(movie)
    })
 }
