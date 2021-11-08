const PORT = process.env.PORT || 3000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const artikels = [
    {
        name: 'media',
        address: 'https://mediakonsumen.com/?s=myrepublic#gsc.tab=0',
        base: ''
    },
    {
        name: 'detik',
        address: 'detik',
        base: ''
    }
]

const articles = []

artikels.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Covid")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json(articles)
})

app.get('/artikel/:artikelsId', (req, res) => {
    const artikelsId = req.params.artikelsId

    const artikelAddress = artikels.filter(newspaper => newspaper.name == artikelsId)[0].address
    const artikelBase = artikels.filter(newspaper => newspaper.name == artikelsId)[0].base


    axios.get(artikelAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Covid")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: artikelBase + url,
                    source: artikelsId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))