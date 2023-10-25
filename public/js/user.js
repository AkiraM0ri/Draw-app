import { socket } from './chat.js'

const newUser = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const user = urlParams.get("user")
  
  socket.emit("newUser", user);

  const playersContainer = document.querySelector('.game__players')

  playersContainer.innerHTML += `
  <div class="player">
    <div class="player__photo"></div>
    <div class="player__infos">
      <p>${user}</p>
      <p>0 pontos</p>
    </div>
  </div>
  `
}

export { newUser }