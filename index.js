const express = require("express")
const { Sequelize, Model, DataTypes } = require("sequelize")
const exphbs = require("express-handlebars")

// DB Connect
const sequelize = new Sequelize("epetition", "admin", "admin", {
  host: "localhost",
  dialect: "mariadb"
})

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log("Connection has been established successfully.")
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

connectDB()

// DB models
const Signature = sequelize.define("Signature", {
  // Model attributes are defined here
  firstname: {
    type: DataTypes.STRING
  },
  lastname: {
    type: DataTypes.STRING
  },
  signature: {
    type: DataTypes.TEXT
  }
})

const testDB = async () => {
  await sequelize.sync({ force: true })
  //   const jane = await Signature.create({
  //     firstname: "janedoe",
  //     lastname: "janedoe",
  //     signature: "abcdef"
  //   })
  //   console.log(jane.toJSON())
}

// testDB()

const app = express()

// Express Config
app.use(express.static("public"))
app.engine("handlebars", exphbs())
app.set("view engine", "handlebars")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Routes
app.get("/", async (request, response) => {
  const signaturesDB = await Signature.findAll({
    order: [["createdAt", "DESC"]]
  })
  const signatures = signaturesDB.map((s) => ({
    ...s.toJSON(),
    createdAt: s.createdAt.toLocaleDateString()
  }))
  console.log("signatures", signatures)

  response.render("home", {
    signatures
  })
})
app.post("/signatures", async (request, response) => {
  //   console.log("request.body", request.body)

  const { firstname, lastname, signature } = request.body

  try {
    await Signature.create({
      firstname,
      lastname,
      signature
    })

    response.json({
      success: true
    })
  } catch (e) {
    response.json({
      success: false,
      message: e.toString()
    })
  }
})

app.listen(3000, () => {
  console.log("Server started")
})
