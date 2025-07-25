const imagePromptFromLocalStorage = localStorage.getItem("imagePrompt")
const quotePromptFromLocalStorage = localStorage.getItem("quotePrompt")
const imageUrlFromLocalStorage = localStorage.getItem("imageUrl")
const quoteFromLocalStorage = localStorage.getItem("quote")
const quoteSpan = document.querySelector(".quote-span")
const quoteWrapper = document.querySelector(".quote-wrapper")
const nameSpan = document.querySelector(".name-span")
const loader = document.getElementById("loader")

function startLoading() {
  nameSpan.style.display = "none"
  quoteWrapper.style.display = "none"
  loader.style.display = "block"
  document.body.backgroundImage = ""
}

function stopLoading(name, url, quote) {
  nameSpan.style.display = "inline"
  quoteWrapper.style.display = "block"
  loader.style.display = "none"
  nameSpan.textContent = `${name} - ${getDate()}`
  document.body.style.backgroundImage = `url(${url})`
  quoteSpan.textContent = quote
}

export async function generateTextAndImage(
  name,
  favActivity,
  favPlace,
  temperature
) {
  startLoading()
  let url = await getImage(favPlace)
  let quote = await getQuote(favActivity, favPlace, temperature)
  stopLoading(name, url, quote)
  return
}

function getDate() {
  const date = new Date()
  const monthIndex = date.getMonth()
  const year = date.getFullYear()

  const monthNames = [
    "Janeiro",
    "Feveiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const monthName = monthNames[monthIndex]

  return `${monthName} ${year}`
}

async function getImage(query) {
  const response = await fetch(
    `https://apis.scrimba.com/unsplash/photos/random/?count=1&query=${query}`
  )

  if (response.ok) {
    const data = await response.json()
    const imageUrl = data[0].urls.full
    return imageUrl
  } else {
    console.error(`Error: ${response.status}`)
  }
}

async function getQuote(favActivity, favPlace, temperature) {
  let quotePrompt = `Você é um gerador de frases poéticas chamado VerseScape.

Receberá duas informações do usuário:
- Atividade favorita
- Lugar favorito

Com base nisso, crie uma frase poética original, com tom inspirador ou reflexivo, conectando esses elementos de forma suave e artística. Use linguagem figurada e metáforas simples, como se fosse o início de um poema.

Importante:
- Só gere a frase se os termos informados forem palavras reais ou com significado claro. Não aceite sequências aleatórias ou sem sentido (ex: “asdhakjbhwdabwidbia”). Se identificar isso, responda: “Parece que algumas palavras não têm significado. Tente novamente com palavras reais.”
- Não repita as palavras exatamente como foram digitadas — transforme-as poeticamente.
- Se alguma das informações estiver vazia ou irreconhecível, também peça para o usuário preencher corretamente.

Exemplo de saída esperada:
"Entre as folhas dançantes de um bosque tranquilo, reencontrava sua alegria ao pintar o silêncio com pinceladas de cor."

Agora, gere a frase com base nas seguintes informações:
Atividade favorita: ${favActivity}
Lugar favorito: ${favPlace}
`

  if (quotePrompt === quotePromptFromLocalStorage) {
    return quoteFromLocalStorage
  }

  localStorage.setItem("quotePrompt", quotePrompt)
  let body = {
    model: "text-davinci-003",
    prompt: quotePrompt,
    temperature: temperature,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }

  let res = await fetch("https://apis.scrimba.com/openai/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  let response = await res.json()
  let newQuote = response.choices[0].text
  localStorage.setItem("quote", newQuote)
  return newQuote
}
