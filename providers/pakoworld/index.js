import convert from "xml-js"
import fs from 'fs'
import Yargs from 'yargs'
import axios from "axios";

const args = Yargs(process.argv).argv
const XML_link = "https://www.pakoworld.com/?route=extension%2Ffeed%2Fcsxml_feed&token=MTQ4NTlMUDI4MA%3D%3D&lang=el&fbclid=IwAR2faAQyDtKJhwKOamSa8qPvH2R0d9h9x9DArj1Oed743MLrIuwHIQDs5gE"
const newXMLPath = './providers/pakoworld/newXML.xml'
const originalXMLPath = './providers/pakoworld/originalXML.xml'

function generateLocalXmlFile(xml) {
    let xml2js = convert.xml2js(xml, {compact: true, spaces: 4});

    const replaceableObjects = [
        {from: "Έπιπλα εσωτερικού χώρου > Ντουλάπες ρούχων", to: "Ντουλαπες"},
        {from: "Διακόσμηση", to: "Διακόσμηση"},
        {from: "Έπιπλα γραφείου > Βιβλιοθήκες γραφείου", to: "Βιβλιοθήκες"},
        {from: "Έπιπλα γραφείου > Γραφεία διευθυντικά", to: "Γραφεία"},
        {from: "Έπιπλα γραφείου > Γραφεία εργασίας", to: "Γραφεία"},
        {from: "Έπιπλα γραφείου > Καναπέδες γραφείου", to: "Καναπέδες"},
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου Gaming - Βucket", to: "Καρέκλες Gaming"},
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου διευθυντή", to: "Καρέκλες Διευθυντικές"},
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου διευθυντή SUPREME QUALITY", to: "Καρέκλες Διευθυντικές"},
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου επισκέπτη", to: "Καρέκλες Υποδοχής"},
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου εργασίας", to: "Καρέκλες Γραφείου"},
        {from: "Έπιπλα γραφείου > Ντουλάπες γραφείου", to: "Ντουλάπες Γραφείου"},
        {from: "Έπιπλα εξωτερικού χώρου > Καρέκλες κήπου", to: "Καρέκλες Κήπου"},
        {from: "Έπιπλα εξωτερικού χώρου > Πολυθρόνες κήπου", to: "Πολυθρόνες Κήπου"},
        {from: "Έπιπλα εξωτερικού χώρου > Σαλόνια κήπου", to: "Σαλόνια Κήπου"},
        {from: "Έπιπλα εξωτερικού χώρου > Σετ τραπεζαρία κήπου", to: "Σετ Τραπεζαρία Κήπου"},
        {from: "Έπιπλα εξωτερικού χώρου > Τραπέζια Φαγητού κήπου", to: "Τραπέζια Κήπου"},
        {from: "Έπιπλα εσωτερικού χώρου > Βιβλιοθήκες", to: "Βιβλιοθήκες"},
        {from: "Έπιπλα εσωτερικού χώρου > Βιτρίνες", to: "Βιτρίνες"},
        {from: "Έπιπλα εσωτερικού χώρου > Έπιπλα εισόδου", to: "Έπιπλα Είσόδου"},
        {from: "Έπιπλα εσωτερικού χώρου > Έπιπλα τηλεόρασης", to: "Έπιπλα Τηλεόρασης"},
        {from: "Έπιπλα εσωτερικού χώρου > Καναπέδες", to: "Καναπέδες"},
        {from: "Έπιπλα εσωτερικού χώρου > Καναπέδες - Κρεβάτι", to: "Καναπέδες - Κρεβάτι"},
        {from: "Έπιπλα εσωτερικού χώρου > Καναπέδες γωνιακοί", to: "Καναπέδες Γωνιακοί"},
        {from: "Έπιπλα εσωτερικού χώρου > Καρέκλες", to: "Καρέκλες"},
        {from: "Έπιπλα εσωτερικού χώρου > Κομοδίνα", to: "Κομοδίνα"},
        {from: "Έπιπλα εσωτερικού χώρου > Κρεβάτια", to: "Κρεβάτια"},
        {from: "Έπιπλα εσωτερικού χώρου > Μπουφέδες", to: "Μπουφέδες"},
        {from: "Έπιπλα εσωτερικού χώρου > Παπουτσοθήκες", to: "Παπουτσοθήκες"},
        {from: "Έπιπλα εσωτερικού χώρου > Πολυθρόνες σαλονιού", to: "Πολυθρόνες"},
        {from: "Έπιπλα εσωτερικού χώρου > Πολυθρόνες τραπεζαρίας", to: "Πολυθρόνες Τραπεζαρίας"},
        {from: "Έπιπλα εσωτερικού χώρου > Ραφιέρες τοίχου", to: "Ραφιέρες Τοίχου"},
        {from: "Έπιπλα εσωτερικού χώρου > Σετ τραπεζαρίες", to: "Σετ Τραπεζαρίες"},
        {from: "Έπιπλα εσωτερικού χώρου > Σκαμπό", to: "Σκαμπό"},
        {from: "Έπιπλα εσωτερικού χώρου > Στρώματα ύπνου & Σομιέδες", to: "Στρώματα"},
        {from: "Έπιπλα εσωτερικού χώρου > Συνθέσεις σαλονιού", to: "Συνθέσεις Σαλονιού"},
        {from: "Έπιπλα εσωτερικού χώρου > Συρταριέρες - Κονσόλες", to: "Συρταριέρες"},
        {from: "Έπιπλα εσωτερικού χώρου > Τραπεζάκια βοηθητικά", to: "Τραπεζάκια Βοηθητικά"},
        {from: "Έπιπλα εσωτερικού χώρου > Τραπεζάκια σαλονιού", to: "Τραπεζάκια Σαλονιού"},
        {from: "Έπιπλα εσωτερικού χώρου > Τραπέζια", to: "Τραπέζια"},
        {from: "Φωτισμός > Απλίκες", to: "Φωτιστικά Άπλικες"},
        {from: "Φωτισμός > Δαπέδου", to: "Φωτιστικά Δαπέδου"},
        {from: "Φωτισμός > Επιτραπέζια", to: "Φωτιστικά Επιτραπέζια"},
        {from: "Φωτισμός > Οροφής", to: "Φωτιστικά Οροφής"}
    ]

    if (args.filter === "on") {
        xml2js.pakoworld.products.product = xml2js.pakoworld.products.product.filter(product => {
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

    xml2js.pakoworld.products.product.map(product => {
        replaceableObjects.map(item => {
            if (product.category._cdata === item.from) {
                product.category._cdata = item.to
            }
            if (product.name._cdata) {
                product.name._cdata = product.name._cdata
                    .replace(/pakoworld/g, "")
                    .replace(/\s+/g, ' ').trim();
            }
            if (product.description._cdata) {
                product.description._cdata = product.description._cdata
                    .replace('<img src="/image/catalog/Icons/assembly-icon.png" style="border-width: 0px; border-style: solid; margin-left: 3px; margin-right: 3px; float: left; height: 35px; width: 35px;" valign="center" alt="Οδηγίες συναρμολόγησης" title="Οδηγίες συναρμολόγησης"><br /><br />', "")
                    .replace('href="/image/catalog/manuals/', 'href="https://www.pakoworld.com/image/catalog/manuals/')
                    .replace(/\s+/g, ' ').trim();
            }
        })
    })

    console.log(`${xml2js.pakoworld.products.product.length} Products`)

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


export default function initPakoworld() {
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