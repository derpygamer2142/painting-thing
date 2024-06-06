const canv = document.getElementById("canv")
const ctx = canv.getContext("2d")

canv.width = window.innerWidth*.65
canv.height = window.innerHeight

const colorpicker = document.getElementById("colorpicker")
const increase = document.getElementById("increase")
const sizeinput = document.getElementById("size")
const decrease = document.getElementById("decrease")
const clearbutton = document.getElementById("clear")

let mousedown = false
let mouseX = 0
let mouseY = 0
let size = 5
let color = "000000"

function toRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}



function spread(x, y, r, g, b, data, width, height, sr, sg, sb) {
    if ((x >= 0) && (x <= width) && (y >= 0) && (y <= height)) {
        let i = (y * height + x) * 4
        if ((data[i] === sr) && (data[i+1] === sg) && (data[i+2] === sb)) {
            data[i] = r
            data[i+1] = g
            data[i+2] = b
            data[i+3] = 1
            return [[x-1, y-1],[x+1, y-1],[x-1, y+1],[x+1, y+1]]
            spread(x-1, y-1, r, g, b, data, width, height, sr, sg, sb)
            spread(x+1, y-1, r, g, b, data, width, height, sr, sg, sb)
            spread(x-1, y+1, r, g, b, data, width, height, sr, sg, sb)
            spread(x+1, y+1, r, g, b, data, width, height, sr, sg, sb)
            
        }
    }
    
    
    
    
    
}

function startfill(x, y, r, g, b) {
    let imagedata = ctx.getImageData(0, 0, canv.width, canv.height)
    console.log(imagedata)
    let data = imagedata.data

    
    let tocheck = [[x, y]]
    let checked = []
    let si = ((y* canv.height) + x) * 4
    let [sr, sg, sb] = [data[si],data[si+1],data[si+2]]
    while (tocheck.length > 0) {
        //let i = ((tocheck[0][1]* canv.height) + tocheck[0][0]) * 4
        let e = spread(tocheck[0][0], tocheck[0][1], r, g, b, data, canv.width, canv.height, sr, sg, sb)
        checked.reverse()
        checked.pop()
        checked.reverse()
        if (Array.isArray(e)) {
            checked = checked.concat(e)
        }

    }
    //spread(x, y, r, g, b, data, canv.width, canv.height, data[i], data[i+1], data[i+2])
}


document.addEventListener("mousedown",(e) => {
    mousedown = true
})

document.addEventListener("mouseup",(e) => {
    mousedown = false
})

document.addEventListener("mousemove",(e) => {
    mouseX = e.clientX
    mouseY = e.clientY
})

increase.addEventListener("click",(e) => {
    sizeinput.value = Number(sizeinput.value) + 1
})

decrease.addEventListener("click",(e) => {
    sizeinput.value = Number(sizeinput.value) - 1
})

clearbutton.addEventListener("click", (e) => {
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0,0,canv.width,canv.height)
})



function main() {
    size = sizeinput.value
    color = colorpicker.value

    if (mousedown) {
        ctx.fillStyle = color
        ctx.fillRect(mouseX - (size/2),mouseY - (size/2),size,size)
    }

}

setInterval(main,15)

startfill(0, 0, 0, 0, 0)