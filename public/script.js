const canva = document.querySelector('#canva')
const ctx = canva.getContext('2d')
const socket = io.connect()

const pen = {
    active: false,
    moving: false,
    pos: { x: 0, y: 0 },
    oldPos: { x: 0, y: 0 },
    penColor: "red",
}

const screenCfg = () => {
    canva.width = window.innerWidth * 0.8
    canva.height = window.innerHeight * 0.5
}

const commands = () => {
    canva.onmousedown = (e) => { pen.active = true }
    canva.onmouseup = (e) => { pen.active = false }
    
    canva.onmousemove = (e) => {
        pen.pos.x = e.clientX - (window.innerWidth - window.innerWidth * 0.8) / 2
        pen.pos.y = e.clientY 
        pen.moving = true
    }
}

const draw = (line) => {
    ctx.beginPath()
    ctx.moveTo(line.oldPos.x, line.oldPos.y)
    ctx.lineTo(line.pos.x, line.pos.y)
    ctx.stroke()
}

const colorPicker = () => {
    const colorInp = document.querySelector('#colorPicker')
    colorInp.addEventListener('change', () => {
        socket.emit('color', colorInp.value)
        ctx.strokeStyle = colorInp.value
    })
}

const frame = () => {
    if(pen.active && pen.moving && pen.oldPos) {
        socket.emit('drawing', { pos: pen.pos, oldPos: pen.oldPos})
        pen.moving = false; 
    }
    pen.oldPos = { x: pen.pos.x, y: pen.pos.y }
    requestAnimationFrame(frame)
}

socket.on('drawing', line => {
    draw(line)
})

socket.on('colorRes', color => {
    console.log(color)
    ctx.strokeStyle = color
})

const chat = () => {
    const btn = document.querySelector('.send')
    const anwser = document.querySelector('#anwser')
    const anwserContainer = document.querySelector('.anwserContainer ul')

    const createMsg = (msg) => {
        const li  = document.createElement('li')
        li.innerHTML = msg
        anwserContainer.appendChild(li)
    }

    socket.on('msg', msg => {
        createMsg(msg)
    })

    btn.addEventListener('click', () => {
        socket.emit('msg', anwser.value)
    })
}

//chamada das funcoes
document.addEventListener('DOMContentLoaded', () => {
    commands()
    screenCfg()
    colorPicker()
    chat()
    
    requestAnimationFrame(frame)
})
