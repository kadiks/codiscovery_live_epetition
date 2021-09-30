const canvasEl = document.querySelector("#cnv")
const btnSaveEl = document.querySelector("#btn-save")
const eraseEl = document.querySelector("#erase")
const formEl = document.querySelector("form")
const ctx = canvasEl.getContext("2d")

let isClicked = false

// Element.addEventListener(eventName: String, cb:Function)

scaleCanvas(canvasEl, ctx, 200, 100)

addListeners()

function addListeners() {
  eraseEl.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
  })
  formEl.addEventListener("submit", async (evt) => {
    evt.preventDefault()
    const firstname = document.querySelector('[name="firstname"]').value
    const lastname = document.querySelector('[name="lastname"]').value
    const signature = canvasEl.toDataURL()

    console.log("signature", signature.length)
    const errors = []

    if (firstname.length === 0) {
      errors.push("Le prénom est obligatoire")
    }
    if (lastname.length === 0) {
      errors.push("Le nom est obligatoire")
    }
    if (signature.length <= 2518) {
      errors.push("La signature est obligatoire")
    }

    if (errors.length > 0) {
      displayError(errors)
      return
    }

    const url = formEl.action
    const method = formEl.method

    const body = JSON.stringify({
      firstname,
      lastname,
      signature
    })

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body
    })
    const json = await response.json()

    if (json.success) {
      window.location = "/"
    } else {
      displayError([`Erreur d'enregistrement: ${json.message}`])
    }
  })

  canvasEl.addEventListener("mousedown", () => {
    isClicked = true
    ctx.beginPath()
  })
  canvasEl.addEventListener("mouseup", () => {
    isClicked = false
  })

  canvasEl.addEventListener("mousemove", (evt) => {
    // if (isClicked === false)
    if (!isClicked) {
      return
    }
    const x = evt.layerX
    const y = evt.layerY

    ctx.lineTo(x, y)

    ctx.stroke()
  })
}

function displayError(errors) {
  const errorsEl = formEl.querySelector(".errors")
  errorsEl.innerHTML = ""
  errors.forEach((errorMessage) => {
    const liEl = document.createElement("li")
    liEl.textContent = `${errorMessage}`
    errorsEl.appendChild(liEl)
  })
}

function scaleCanvas(canvas, context, width, height) {
  // assume the device pixel ratio is 1 if the browser doesn't specify it
  const devicePixelRatio = window.devicePixelRatio || 1

  // determine the 'backing store ratio' of the canvas context
  const backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1

  // determine the actual ratio we want to draw at
  const ratio = devicePixelRatio / backingStoreRatio

  if (devicePixelRatio !== backingStoreRatio) {
    // set the 'real' canvas size to the higher width/height
    canvas.width = width * ratio
    canvas.height = height * ratio

    // ...then scale it back down with CSS
    canvas.style.width = width + "px"
    canvas.style.height = height + "px"
  } else {
    // this is a normal 1:1 device; just scale it simply
    canvas.width = width
    canvas.height = height
    canvas.style.width = ""
    canvas.style.height = ""
  }

  // scale the drawing context so everything will work at the higher ratio
  context.scale(ratio, ratio)
}
