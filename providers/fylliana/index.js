import convert from "xml-js"
import fs from 'fs'
import Yargs from 'yargs'
import axios from "axios";

const args = Yargs(process.argv).argv
const XML_link = "https://www.fylliana.gr/datafeed/48577/sPZbYqmObtt65dvHtlXJ1dUvoOvgRcJA?fbclid=IwAR0bAHT5gsO17dC9_QCPawR8wwL1sqQIrI8CChg5J88eiZA2QuyMVDVdpvQ"
const newXMLPath = './providers/fylliana/newXML.xml'
const originalXMLPath = './providers/fylliana/originalXML.xml'


function generateLocalXmlFile(xml) {
    let xml2js = convert.xml2js(xml, {compact: true, spaces: 4});

    const replaceableObjects = [
        {from: "Κάδρα", to: "Πίνακες"},
        {from: "Απλίκες", to: "Φωτιστικά Άπλικες"},
        {from: "Ρολόγια", to: "Ρολόγια"},
        {from: "Καθρέφτες", to: "Καθρέπτες"},
        {from: "Τραπέζια", to: "Τραπέζια"},
        {from: "Σετ κήπου", to: "Σαλόνια Κήπου"},
        {from: "Πολυθρόνες-Ανάκλινδρα", to: "Πολυθρόνες"},
        {from: "Φωτιστικά οροφής", to: "Φωτιστικά οροφής"},
        {from: "Επιτραπέζιες λάμπες", to: "Φωτιστικά Επιτραπέζια"},
        {from: "Καναπέδες κρεβάτια", to: "Καναπέδες - κρεβάτι"},
        {from: "Καναπέδες γωνιακοί", to: "Καναπέδες γωνιακοί"},
        {from: "Ταμπουρέ - Σκαμπώ", to: "Σκαμπό"},
        {from: "Παιδικά έπιπλα", to: "Παιδικά έπιπλα"},
        {from: "Φανάρια", to: "Φανάρια"},
        {from: "Λάμπες δαπέδου", to: "Φωτιστικά Δαπέδου"},
        {from: "Τραπεζάκια σαλονιού", to: "Τραπεζάκια σαλονιού"},
        {from: "Έπιπλα χώλ", to: "Έπιπλα Εισόδου"},
        {from: "Τραπεζαρίες", to: "Τραπέζια"},
        {from: "Βιβλιοθήκες - Ραφιέρες", to: "Βιβλιοθήκες"},
        {from: "Κρεβάτια", to: "Κρεβάτια"},
        {from: "Μαξιλάρια", to: "Μαξιλάρια"},
        {from: "Λευκά είδη", to: "Λευκά είδη"},
        {from: "Χαλιά", to: "Χαλιά"},
        {from: "Τραπέζια τραπεζαρίας", to: "Τραπέζια"},
        {from: "Μελαμίνης", to: "κρεβάτια"},
        {from: "Παπουτσοθήκες", to: "Παπουτσοθήκες"},
        {from: "Καρέκλες γραφείου", to: "Καρέκλες γραφείου"},
        {from: "Επενδεδυμένα", to: "κρεβάτια"},
        {from: "Βιτρίνες", to: "Βιτρίνες"},
        {from: "Σετ Καναπέδες", to: "Σαλόνια"},
        {from: "Κομοδίνα", to: "Κομοδίνα"},
        {from: "Κομότες - Μπουφέδες", to: "Μπουφέδες"},
        {from: "Γραφεία", to: "Γραφεία"},
        {from: "Έπιπλα τηλεόρασης - Συνθέσεις τηλεόρασης", to: ""},
    ]

    if (args.filter === "on") {
        xml2js.product_feed.products.product = xml2js.product_feed.products.product.filter(product => {
            let mutchedProduct = null

            replaceableObjects.forEach(item => {
                if (product.category_name && item.from === product.category_name?._cdata.trim()) {
                    mutchedProduct = product
                }
            })
            if (mutchedProduct) {
                return product
            }
        })
    }

    xml2js.product_feed.products.product.map(product => {
        switch (product.category_name._cdata) {
            case "Έπιπλα τηλεόρασης - Συνθέσεις τηλεόρασης":
                console.log(product)
                if (product.name._cdata.search(/ΚΕΝΤΡΟ ΨΥΧΑΓΩΓΙΑΣ/i) !== -1) {
                    product.category_name._cdata = "συνθέσεις σαλονιού"
                } else{
                    product.category_name._cdata = "επιπλα τηλεορασης"
                }
                break
            default:
                replaceableObjects.map(item => {
                    if (product.category_name._cdata === item.from) {
                        product.category_name._cdata = item.to
                    }
                })
        }
    })

    console.log(`${xml2js.product_feed.products.product.length} Products`)
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


export default function initFylliana() {
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
