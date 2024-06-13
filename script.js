const canv = document.getElementById("canv")
const ctx = canv.getContext("2d")
ctx.imageSmoothingEnabled = false
canv.width = window.innerWidth*.65
canv.height = window.innerHeight

let canvimg = ctx.getImageData(0,0,canv.width,canv.height)
let pixels = canvimg.data
for (let e = 0; e < pixels.length; e += 4) {
    pixels[e+0] = 255
    pixels[e+1] = 255
    pixels[e+2] = 255
    pixels[e+3] = 255
}

ctx.putImageData(canvimg,0,0)


const colorpicker = document.getElementById("colorpicker")
const increase = document.getElementById("increase")
const sizeinput = document.getElementById("size")
const decrease = document.getElementById("decrease")
const clearbutton = document.getElementById("clear")
const switchPaint = document.getElementById("switchPaint")
const switchFill = document.getElementById("switchFill")

let tool = "paint"
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


function v(x, y, sr, sg, sb, width, height, data, tr, tg, tb) {
    let i = ((y * width) + x) * 4

    if ((x >= 0) && (x <= canv.width) && (y >= 0) && (y <= canv.height) && (data[i] === sr) && (data[i+1] === sg) && (data[i+2] === sb) && !((data[i] === tr) && (data[i+1] === tg) && (data[i+2] === tb))) {
        return true
    }
    
        
        
    return false
}

/*
0x0
0xx
000
*/

function spread(x, y, r, g, b, data, width, height, sr, sg, sb) {
    let i = ((y * width) + x) * 4
    if (v(x,y,sr,sg,sb,width,height,data, r, g, b)) {
        //console.log(i)
            //ctx.fillStyle = `rgb(${r},${g},${b})`
            // ctx.fillStyle = "#ff0000"
            // ctx.fillRect(x, height-y, 1, 1)
            data[i] = r
            data[i+1] = g
            data[i+2] = b
            data[i+3] = 255
            //console.log(data[i])
            let list = []
            if (v(x+0,y+1,sr,sg,sb,width,height, data, r, g, b)) {
                list.push([x,y+1])
            }
            if (v(x+0,y-1,sr,sg,sb,width,height, data, r, g, b)) {
                list.push([x,y-1])
            }
            if (v(x+1,y+0,sr,sg,sb,width,height, data, r, g, b)) {
                list.push([x+1,y+0])
            }
            if (v(x-1,y+0,sr,sg,sb,width,height, data, r, g, b)) {
                list.push([x-1,y+0])
            }
            return JSON.stringify(list) === "[]" ? false : list//[[x, y-1],[x+1, y],[x, y+1],[x-1, y]]
            spread(x-1, y-1, r, g, b, data, width, height, sr, sg, sb)
            spread(x+1, y-1, r, g, b, data, width, height, sr, sg, sb)
            spread(x-1, y+1, r, g, b, data, width, height, sr, sg, sb)
            spread(x+1, y+1, r, g, b, data, width, height, sr, sg, sb)
            
    }
    return false
    
    
    
}

function startfill(x, y, r, g, b) {
    let imagedata = ctx.getImageData(0, 0, canv.width, canv.height)
    //console.log(imagedata)
    let data = imagedata.data
    let s = Date.now()
    
    let tocheck = [[x, y]]
    let si = ((y* canv.width) + x) * 4
    let [sr, sg, sb] = [data[si],data[si+1],data[si+2]]
    let f = 0
    while ((tocheck.length > 0)) { // f < 100000 && 
        //console.log(tocheck.length)
        f += 1
        // if (f > 500) {
        //     console.log("very big number")
        //     return
        // }
        //let i = ((tocheck[0][1]* canv.height) + tocheck[0][0]) * 4
        let e = spread(tocheck[0][0], tocheck[0][1], r, g, b, data, canv.width, canv.height, sr, sg, sb)
        tocheck.reverse()
        tocheck.pop()
        tocheck.reverse()
        if (Array.isArray(e)) {
            //console.log("added")
            tocheck = tocheck.concat(e)
            //console.log(tocheck[tocheck.length-1])
        }

    }
    //console.log(imagedata)
    //console.log(data)
    ctx.putImageData(imagedata,0,0)
    //console.log(ctx.getImageData(0, 0, canv.width, canv.height))
    console.log(Date.now() - s)
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

switchPaint.addEventListener("click", (e) => {
    tool = "paint"
})

switchFill.addEventListener("click", (e) => {
    tool = "fill"
})

function main() {
    size = sizeinput.value
    color = colorpicker.value
    if ((mouseX < 0) || (mouseX > canv.width) || (mouseY < 0) || (mouseY > canv.height)) {
        return
    }
    if (mousedown) {
        if (tool === "paint") {
            ctx.fillStyle = color
            ctx.fillRect(mouseX - (size/2),mouseY - (size/2),size,size)
        }
        else if (tool === "fill") {

            mousedown = false
            let col = toRgb(color)
            startfill(mouseX, mouseY, col.r, col.g, col.b)
            console.log(mouseX, mouseY)
            console.log("fill")
            console.log(col)
        }
    }

}

setInterval(main,15)

//startfill(0, 0, 255, 1, 1)