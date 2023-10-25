const socket = io.connect();

const chat = () => {
  socket.on("newUser", (user) => console.log(user));

  const anwser = document.querySelector("#anwser");
  const anwserContainer = document.querySelector(".anwserContainer ul");

  const createMsg = (msg) => {
    const li = document.createElement("li");
    li.innerHTML = msg;
    anwserContainer.appendChild(li);
  };

  socket.on("msg", (msg) => {
    createMsg(msg);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && anwser.value !== ""){
      socket.emit("msg", anwser.value);
    }
    if(e.key === "Enter") {
      anwser.value = ""
    }
  });
  
};

export { chat, socket }