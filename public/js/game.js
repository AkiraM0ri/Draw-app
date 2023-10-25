import { chat, socket } from './chat.js'
import { newUser } from './user.js'

const canva = document.querySelector("#canva");
const ctx = canva.getContext("2d");

// config da caneta
const pen = {
  tool: "brush",
  active: false,
  moving: false,
  penWidth: 1,
  pos: { x: 0, y: 0 },
  oldPos: { x: 0, y: 0 },
};

// ferramentas de desenho
const toolsObj = {
  "brush": (colorInp) => {
    pen.tool = "brush"
    socket.emit("color", colorInp.value);
    ctx.strokeStyle = colorInp.value;
  },
  "eraser": () => {
    pen.tool = "eraser"
    socket.emit("color", "#ffffff");
    ctx.strokeStyle = "#ffffff";
  }
}

// opcoes do canva
const screenCfg = () => {
  canva.width = canva.offsetWidth;
  canva.height = canva.offsetHeight;
};

// comandos do mouse
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

// Desenhar no canva
const draw = (line) => {
  ctx.beginPath();
  ctx.moveTo(line.oldPos.x, line.oldPos.y);
  ctx.lineTo(line.pos.x, line.pos.y);
  ctx.stroke();
};

// seletor de cor
const colorPicker = () => {
  const colorInp = document.querySelector("#colorPicker");
  colorInp.addEventListener("change", () => {
    socket.emit("color", colorInp.value);
    ctx.strokeStyle = colorInp.value;
  });
};

// verifica qual e a ferramenta ao clicar
const tools = () => {
  const colorInp = document.querySelector("#colorPicker");

  const tools = document.querySelectorAll('.tools')
  tools.forEach(tool => {
    tool.addEventListener('click', (e) => {
      const toolType = e.target.getAttribute('tooltype')

      toolsObj[toolType](colorInp)
    })
  })
}

// diametro da caneta
const penWidth = () => {
  const range = document.querySelector('#pen-width')
  range.addEventListener('change', (e) => {
    socket.emit("lineWidth", e.target.value);
    pen.penWidth = e.target.value
    ctx.lineWidth = e.target.value
  })
}

// game loop
const frame = () => {
  if (pen.active && pen.moving && pen.oldPos && pen.tool == "brush" 
  || pen.active && pen.moving && pen.oldPos && pen.tool == "eraser") {
    socket.emit("drawing", { pos: pen.pos, oldPos: pen.oldPos });
    pen.moving = false;
  }
  pen.oldPos = { x: pen.pos.x, y: pen.pos.y };
  requestAnimationFrame(frame);
};

// respostas do socket
socket.on("drawing", (line) => {
  draw(line);
});

socket.on("colorRes", (color) => {
  ctx.strokeStyle = color;
});

socket.on("lineWidth", (lineWidth) => {
  ctx.lineWidth = lineWidth
})

//chamada das funcoes ao iniciar o DOM
document.addEventListener("DOMContentLoaded", () => {
  newUser()
  screenCfg();
  commands();
  tools()
  penWidth()
  colorPicker();
  chat();

  requestAnimationFrame(frame);
});
