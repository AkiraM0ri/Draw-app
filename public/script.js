const canva = document.querySelector("#canva");
const ctx = canva.getContext("2d");
const socket = io.connect();

const pen = {
  active: false,
  moving: false,
  pos: { x: 0, y: 0 },
  oldPos: { x: 0, y: 0 },
  penColor: "red",
};

const screenCfg = () => {
  canva.width = canva.offsetWidth;
  canva.height = canva.offsetHeight;
};

const commands = () => {
  canva.onmousedown = (e) => {
    pen.active = true;
  };
  canva.onmouseup = (e) => {
    pen.active = false;
  };

  canva.onmousemove = (e) => {
    pen.pos.x = e.offsetX;
    pen.pos.y = e.offsetY;
    pen.moving = true;
  };
};

const draw = (line) => {
  ctx.beginPath();
  ctx.moveTo(line.oldPos.x, line.oldPos.y);
  ctx.lineTo(line.pos.x, line.pos.y);
  ctx.stroke();
};

const colorPicker = () => {
  const colorInp = document.querySelector("#colorPicker");
  colorInp.addEventListener("change", () => {
    socket.emit("color", colorInp.value);
    ctx.strokeStyle = colorInp.value;
  });
};

const frame = () => {
  if (pen.active && pen.moving && pen.oldPos) {
    socket.emit("drawing", { pos: pen.pos, oldPos: pen.oldPos });
    pen.moving = false;
  }
  pen.oldPos = { x: pen.pos.x, y: pen.pos.y };
  requestAnimationFrame(frame);
};

socket.on("drawing", (line) => {
  draw(line);
});

socket.on("colorRes", (color) => {
  console.log(color);
  ctx.strokeStyle = color;
});

const chat = () => {
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

//chamada das funcoes
document.addEventListener("DOMContentLoaded", () => {
  screenCfg();
  commands();
  colorPicker();
  chat();

  requestAnimationFrame(frame);
});
