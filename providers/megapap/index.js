import convert from "xml-js"
import fs from 'fs'
import Yargs from 'yargs'
import axios from "axios";

const args = Yargs(process.argv).argv
const XML_link = "https://www.megapap.com/?route=extension/feed/csxml_feed&token=MTM2TFA2Nw==&lang=el"
const newXMLPath = './providers/megapap/newXML.xml'
const originalXMLPath = './providers/megapap/originalXML.xml'

function generateLocalXmlFile(xml) {
    let xml2js = convert.xml2js(xml, {compact: true, spaces: 4});

    const replaceableObjects = [
        {from: "Έπιπλα εσωτερικού χώρου > Ντουλάπες ρούχων", to: "Ντουλαπες"},
        {from: "Έπιπλα εσωτερικού χώρου > Ντουλάπες ρούχων", to: "Ντουλάπες"},
        {from: "Έπιπλα εσωτερικού χώρου > Καναπέδες - Κρεβάτι", to: "Καναπέδες - Κρεβάτι"},
        {from: "Έπιπλα κήπου > Τραπέζια κήπου", to: "Τραπέζια κήπου"},
        {from: "Έπιπλα γραφείου > Βιβλιοθήκες γραφείου", to: "Βιβλιοθήκες γραφείου"},
        {from: "Έπιπλα εσωτερικού χώρου > Παπουτσοθήκες", to: "Παπουτσοθήκες"},
        {from: "Έπιπλα εσωτερικού χώρου > Βιβλιοθήκες", to: "Βιβλιοθήκες"},
        {from: "Έπιπλα γραφείου > Γραφεία", to: "Γραφεία"},
        {from: "Έπιπλα εσωτερικού χώρου > Κρεβάτια", to: "Κρεβάτια"},
        {from: "Έπιπλα εσωτερικού χώρου > Συνθέσεις σαλονιού", to: "Συνθέσεις σαλονιού"},
        {from: "Έπιπλα εσωτερικού χώρου > Κομοδίνα", to: "Κομοδίνα"},
        {from: "Έπιπλα εσωτερικού χώρου > Έπιπλα εισόδου", to: "Έπιπλα εισόδου"},
        {from: "Έπιπλα εσωτερικού χώρου > Συρταριέρες - Τουαλέτες", to: "Συρταριέρες"},
        {from: "Έπιπλα εσωτερικού χώρου > Έπιπλα τηλεόρασης", to: "Έπιπλα τηλεόρασης"},
        {from: "Έπιπλα εσωτερικού χώρου > Τραπεζάκια σαλονιού", to: "Τραπεζάκια σαλονιού"},
        {from: "Έπιπλα γραφείου > Συρταριέρες γραφείου", to: "Συρταριέρες γραφείου"},
        {from: "Έπιπλα εσωτερικού χώρου > Ραφιέρες τοίχου", to: "Ραφιέρες τοίχου"},
        {from: "Έπιπλα εσωτερικού χώρου > Τραπέζια", to: "Τραπέζια"},
        {from: "Έπιπλα κήπου > Σετ σαλόνια κήπου", to: "Σαλόνια Κήπου"},
        {from: "Έπιπλα εσωτερικού χώρου > Βιτρίνες - Στήλες", to: "Βιτρίνες"},
        {from: "Έπιπλα εσωτερικού χώρου > Μπουφέδες", to: "Μπουφέδες"},
        {from: "Έπιπλα εσωτερικού χώρου > Καναπέδες", to: "Καναπέδες"},
        {from: "Φωτισμός > Δαπέδου φωτιστικά", to: "Φωτιστικά Δαπέδου"},
        {from: "Έπιπλα εσωτερικού χώρου > Σκαμπώ", to: "Σκαμπό"},
        {from: "Έπιπλα εσωτερικού χώρου > Τραπεζάκια βοηθητικά", to: "Τραπεζάκια Βοηθητικά"},
        {from: "Έπιπλα εσωτερικού χώρου > Πολυθρόνες σαλονιού", to: "Πολυθρόνες σαλονιού"},
        {from: "Έπιπλα εσωτερικού χώρου > Σετ τραπεζαρίες", to: "Σετ τραπεζαρίες"},
        {from: "Φωτισμός > Επιτραπέζια φωτιστικά", to: "φωτιστικά Επιτραπέζια"},
        {from: "Φωτισμός > Οροφής φωτιστικά", to: "φωτιστικά Οροφής"},
        {from: "Έπιπλα εσωτερικού χώρου > Καθρέπτες", to: "Καθρέπτες"},
        {from: "Έπιπλα εσωτερικού χώρου > Καρέκλες - Πολυθρόνες τραπεζαρίας", to: ""},
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου", to: ""},
    ]

    if (args.filter === "on") {
        xml2js.megapap.products.product = xml2js.megapap.products.product.filter(product => {
            let mutchedProduct = null
            replaceableObjects.forEach(item => {
                if (item.from === product.category._cdata) {
                    mutchedProduct = product
                }
            })
            if (mutchedProduct) {
                return product
            }
        })
    }


    xml2js.megapap.products.product.map((product) => {
        /*Create new field for attributes*/
        if (product.filters && Array.isArray(product.filters.filter)) {
            product.filters.filter.map(filter => {
                filter.newValue = {
                    _attributes: {id: filter.group._attributes.id},
                    _text: filter.value._text
                }
            })
        } else if (product.filters) {
            product.filters.filter.newValue = {
                _attributes: {id: product.filters.filter.group._attributes.id},
                _text: product.filters.filter.value._text
            }
        }

        switch (product.category._cdata) {
            case "Έπιπλα γραφείου > Καρέκλες γραφείου":
                if (product.name._cdata.search(/gaming/i) !== -1) {
                    product.category._cdata = "Καρέκλες Gaming"
                } else if (product.name._cdata.search(/εργονομική/i) !== -1 || product.name._cdata.search(/διευθυντή/i) !== -1) {
                    product.category._cdata = "Καρέκλες διευθυντικές"
                } else {
                    product.category._cdata = "Καρέκλες γραφείου"
                }
                break
            case "Έπιπλα εσωτερικού χώρου > Καρέκλες - Πολυθρόνες τραπεζαρίας":
                if (product.name._cdata.search(/Καρέκλα/i) !== -1) {
                    product.category._cdata = "Καρέκλες"
                } else if (product.name._cdata.search(/Πολυθρόνα/i) !== -1) {
                    product.category._cdata = "Πολυθρόνες Τραπεζαρίας"
                }
                break
            default:
                replaceableObjects.map(item => {
                    if (product.category._cdata === item.from) {
                        product.category._cdata = item.to
                    }
                })
        }

    })
    console.log(xml2js.megapap.products.product[0].filters.filter[0])

    console.log(`${xml2js.megapap.products.product.length} Products`)
    const js2xml = convert.js2xml(xml2js, {compact: true, ignoreComment: true, spaces: 4});

    fs.writeFileSync(newXMLPath, js2xml)
}

async function getXMLFromUrl() {
    console.time('time')
    axios.get(XML_link, {responseType: 'blob'})
        .then(response => {
            fs.writeFileSync(originalXMLPath, response.data, "utf-8")
            generateLocalXmlFile(response.data)
            console.timeEnd('time')
        })
}

async function getXMLFromFile(fileName) {
    console.time('time')
    const xmlData = fs.readFileSync(fileName, 'utf8')
    generateLocalXmlFile(xmlData)
    console.timeEnd('time')
}


export default function initMegapap() {
    if (args.type === 'file') {
        if (fs.existsSync(originalXMLPath)) {
            getXMLFromFile(originalXMLPath).then()
        } else {
            getXMLFromUrl().then()
        }
    } else {
        getXMLFromUrl().then()
    }
}