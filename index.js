import { generateTextAndImage } from "./utils.js"
const button = document.getElementById("generate")
const inputContainer = document.getElementById("inputContainer")
const fraseContainer = document.getElementById("fraseContainer")

let nameInput = document.getElementById("author")
let activityInput = document.getElementById("activity")
let placeInput = document.getElementById("place")

inputContainer.style.display = "flex"
fraseContainer.style.display = "none"

button.addEventListener("click", () => {
    if (nameInput.value && activityInput.value && placeInput.value) {

        let name = nameInput.value
        let favoriteActivity = activityInput.value
        let favoritePlace = placeInput.value

        // Temperature é um valor entre 0 e 1, onde 0 é frio e 1 é quente
        let temperature = 1

        generateTextAndImage(name, favoriteActivity, favoritePlace, temperature)
        inputContainer.style.display = "none"
        fraseContainer.style.display = "flex"

    } else {
        alert("Preencha todos os campos.")
    }
})
