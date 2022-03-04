import convert from "xml-js"
import fs from 'fs'
import Yargs from 'yargs'
import axios from "axios";

const args = Yargs(process.argv).argv
const XML_link = "https://www.zougris.gr/Content/files/ExportImport/xmlfeed.xml"
const newXMLPath = './providers/zougris/newXML.xml'
const originalXMLPath = './providers/zougris/originalXML.xml'


function generateLocalXmlFile(xml) {
    let xml2js = convert.xml2js(xml, {compact: true, spaces: 4});

    const replaceableObjects = [
        {from: "ΓΡΑΦΕΙΑ", top: "Γραφεία"},
        {from: "ΕΠΙΠΛΑ TV", top: "Έπιπλα Τηλεόρασης"},
        {from: "ΚΑΘΙΣΜΑΤΑ ΔΙΕΥΘΥΝΤΙΚΑ", top: "Καρέκλες Διευθυντικές"},
        {from: "ΚΑΘΙΣΜΑΤΑ ΕΡΓΑΣΙΑΣ", top: "Καρέκλες γραφείου"},
        {from: "ΚΑΘΙΣΜΑΤΑ ΥΠΟΔΟΧΗΣ", top: "Καρέκλες υποδοχής"},
        {from: "ΚΑΝΑΠΕΔΕΣ", top: "Καναπέδες"},
        {from: "ΚΑΝΑΠΕΔΕΣ ΚΡΕΒΑΤΙ", top: "Καναπέδες - Κρεβάτι"},
        {from: "ΚΑΡΕΚΛΕΣ", top: "Καρέκλες"},
        {from: "ΠΑΠΟΥΤΣΟΘΗΚΕΣ", top: "Παπουτσοθήκες"},
        {from: "ΠΟΛΥΘΡΟΝΕΣ", top: "Πολυθρόνες Τραπεζαρίας"},
        {from: "ΤΡΑΠΕΖΑΚΙΑ ΓΙΑ ΞΑΠΛΩΣΤΡΕΣ", top: "Τραπεζάκια Κήπου"},
        {from: "ΤΡΑΠΕΖΑΚΙΑ ΣΑΛΟΝΙΟΥ", top: "Τραπεζάκια Σαλονιού"},
        {from: "ΤΡΑΠΕΖΑΚΙΑ ΧΑΜΗΛΑ", top: "Τραπεζάκια Κήπου"},
        {from: "ΤΡΑΠΕΖΙΑ", top: "Τραπέζια"},
        {from: "ΚΡΕΒΑΤΙΑ-ΚΟΜΟΔΙΝΑ", top: ""},
    ]

    if (args.filter === "on") {
        xml2js.Products.Product = xml2js.Products.Product.filter(product => {
            let mutchedProduct = null
            replaceableObjects.forEach(item => {
                if (product.Category3 && item.from === product.Category3?._cdata.trim()) {
                    mutchedProduct = product
                }
            })
            if (mutchedProduct) {
                return product
            }
        })
    }

    xml2js.Products.Product.map(product => {
        if (!product.Category3) return
        switch (product.Category3._cdata.trim()) {
            case "ΚΡΕΒΑΤΙΑ-ΚΟΜΟΔΙΝΑ":
                if (product.Title._cdata.search(/ΚΟΜΟΔΙΝΟ/i) !== -1) {
                    product.Category3._cdata = "Κομοδίνα"
                } else {
                    product.Category3._cdata = "Κρεβάτια"
                }
                break
            default:
                replaceableObjects.map(item => {
                    if (product.Category3._cdata === item.from) {
                        product.Category3._cdata = item.to
                    }
                })
        }
    })

    console.log(`${xml2js.Products.Product.length} Products`)
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


export default function initZougris() {
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
