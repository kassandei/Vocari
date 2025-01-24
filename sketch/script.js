const colorPicker = document.querySelector("#colorPicker");
const container = document.querySelector("#container");
const gridBox = document.createElement("div");
const erase = document.querySelector("#buttonErase")
const gridSize = document.querySelector('#gridSize');
const gridSizeValue = document.querySelector('#gridSizeValue');
const rainBow = document.querySelector('#buttonRainbow');

gridBox.setAttribute('id', 'gridBox');
createSquares(16);
container.appendChild(gridBox);

function createSquares(nSquares) {
    for(let i = 0; i < nSquares; i++) {
        const rowSquare = document.createElement("div");
        rowSquare.classList.add("rowSquare");
        for(let i = 0; i < nSquares; i++) {
            const square = document.createElement("div");
            square.classList.add("square");
            rowSquare.appendChild(square);
        } 
        gridBox.appendChild(rowSquare);
    }
}


let colorRainbow = false;

colorPicker.addEventListener("input", event => {
    colorRainbow = false;
    document.querySelector(".button-like").style.backgroundColor = event.target.value;
})

rainBow.addEventListener("click", () => {
    colorRainbow = !colorRainbow; 
})

let isDrawing = false;

gridBox.addEventListener("mousedown", event => {
    if (event.target.classList.contains("square")) {
        isDrawing = true;
        event.target.style.backgroundColor = colorPicker.value;
    }
});

gridBox.addEventListener("mousemove", event => {
    if (isDrawing && event.target.classList.contains("square")) {
        if(colorRainbow)
            event.target.style.backgroundColor = getRandomColor();
        else
            event.target.style.backgroundColor = colorPicker.value;
    }
});



document.addEventListener("mouseup", () => {
    isDrawing = false;
});

erase.addEventListener("click", () => {
    document.querySelectorAll(".square").forEach(square => {
        square.style.backgroundColor = '#FFFFFF';
    });
});

gridSize.addEventListener("input", event => {
    gridSizeValue.textContent = event.target.value;
    gridBox.innerHTML = '';
    createSquares(event.target.value);
});

function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}
