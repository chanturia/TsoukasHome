import convert from "xml-js"
import fs from 'fs'
import Yargs from 'yargs'
import axios from "axios";

const args = Yargs(process.argv).argv
const XML_link = "https://www.alphab2b.gr/index.php?route=extension%2Ffeed%2Fxmlfeed&lang_id=2&customer_group_id=4&fbclid=IwAR0zLJBkTHhiDbYlE_Gxwo96bCMlpr4AlZa1glpUPdGerob0ND2Pn3N-fxM"
const newXMLPath = './providers/alphab2b/newXML.xml'
const originalXMLPath = './providers/alphab2b/originalXML.xml'


function generateLocalXmlFile(xml) {
    let xml2js = convert.xml2js(xml, {compact: true, spaces: 4});

    const replaceableObjects = [
        {from: "ΕΠΙΠΛΑ > ΚΡΕΒΑΤΟΚΑΜΑΡΑ > ΣΕΤ ΚΡΕΒΑΤΟΚΑΜΑΡΑΣ", to: "Σετ Κρεβατοκάμαρας"},
        {from: "ΕΠΙΠΛΑ > ΚΡΕΒΑΤΟΚΑΜΑΡΑ > ΚΡΕΒΑΤΙΑ", to: "Κρεβάτια"},
        {from: "ΕΠΙΠΛΑ > ΚΡΕΒΑΤΟΚΑΜΑΡΑ > ΝΤΟΥΛΑΠΕΣ", to: "Ντουλάπες"},
        {from: "ΕΠΙΠΛΑ > ΕΙΣΟΔΟΥ > ΝΤΟΥΛΑΠΕΣ", to: "Ντουλάπες"},
        {from: "ΕΠΙΠΛΑ > ΚΡΕΒΑΤΟΚΑΜΑΡΑ > ΚΟΜΟΔΙΝΑ", to: "Κομοδίνα"},
        {from: "ΕΠΙΠΛΑ > ΚΡΕΒΑΤΟΚΑΜΑΡΑ > ΣΥΡΤΑΡΙΕΡΕΣ-ΤΟΥΑΛΕΤΕΣ", to: "Συρταριέρες"},
        {from: "ΕΠΙΠΛΑ > ΣΑΛΟΝΙ > ΣΥΝΘΕΤΑ TV", to: "Συνθέσεις Σαλονιού"},
        {from: "ΕΠΙΠΛΑ > ΣΑΛΟΝΙ > ΕΠΙΠΛΟ ΤV", to: "Έπιπλα Τηλεόρασης"},
        {from: "ΕΠΙΠΛΑ > ΤΡΑΠΕΖΑΡΙΑ > ΜΠΟΥΦΕΣ", to: "Μπουφέδες"},
        {from: "ΕΠΙΠΛΑ > ΕΙΣΟΔΟΥ > ΣΕΤ ΕΙΣΟΔΟΥ", to: "Έπιπλα Εισόδου"},
        {from: "ΕΠΙΠΛΑ > ΕΙΣΟΔΟΥ > ΚΟΜΟΤΕΣ -ΝΤΟΥΛΑΠΙΑ", to: "Συρταριέρες"},
        {from: "ΕΠΙΠΛΑ > ΣΑΛΟΝΙ > ΒΙΤΡΙΝΕΣ", to: "Βιτρίνες"},
        {from: "ΕΠΙΠΛΑ > ΓΡΑΦΕΙΟ > ΒΙΒΛΙΟΘΗΚΗ", to: "Βιβλιοθήκες"},
        {from: "ΕΠΙΠΛΑ > ΕΙΣΟΔΟΥ > ΠΑΠΟΥΤΣΟΘΗΚΕΣ", to: "Παπουτσοθήκες"},
        {from: "ΕΠΙΠΛΑ > ΓΡΑΦΕΙΟ > ΓΡΑΦΕΙΑ", to: "Γραφεία"},
        {from: "ΕΠΙΠΛΑ > ΣΑΛΟΝΙ > ΤΡΑΠΕΖΑΚΙΑ", to: "Τραπεζάκια Σαλονιού"},
        {from: "ΕΠΙΠΛΑ > ΕΙΣΟΔΟΥ > ΚΑΘΡΕΠΤΕΣ", to: "Καθρέπτες"},
        {from: "ΦΩΤΙΣΤΙΚΑ > ΚΡΕΜΑΣΤΑ", to: "Φωτιστικά Οροφής"},
        {from: "ΦΩΤΙΣΤΙΚΑ > ΕΠΙΤΟΙΧΙΑ", to: "Φωτιστικά Άπλικες"},
        {from: "ΕΠΙΠΛΑ > ΤΡΑΠΕΖΑΡΙΑ > ΤΡΑΠΕΖΙΑ", to: "Τραπέζια"},
        {from: "ΕΠΙΠΛΑ > ΣΑΛΟΝΙ > ΚΑΝΑΠΕΣ", to: "Καναπέδες"},
        {from: "ΦΩΤΙΣΤΙΚΑ > ΔΑΠΕΔΟΥ", to: "Φωτιστικά Δαπέδου"},
    ]

    if (args.filter === "on") {
        xml2js.products.product = xml2js.products.product.filter(product => {
            let mutchedProduct = null
            replaceableObjects.forEach(item => {
                if (product.category && item.from === product.category?._cdata.trim()) {
                    mutchedProduct = product
                }
            })
            if (mutchedProduct) {
                return product
            }
        })
    }

    xml2js.products.product.map(product => {
        switch (product.category._cdata) {
            default:
                replaceableObjects.map(item => {
                    if (product.category._cdata === item.from) {
                        product.category._cdata = item.to
                    }
                })
        }

        if (product.manual){
            product.description._cdata =`<strong>Οδηγός Συναρμολόγησης</strong><a href="${product.manual._cdata}" target="_blank">εδώ</a> <br> ${product.description._cdata}`
        }
    })

    console.log(`${xml2js.products.product.length} Products`)
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


export default function initAlphab2b() {
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
