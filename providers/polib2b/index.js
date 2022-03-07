import convert from "xml-js"
import fs from 'fs'
import Yargs from 'yargs'
import axios from "axios";

const args = Yargs(process.argv).argv
const XML_link = "https://www.polib2b.gr/pub/feedb2b/b2b_audience_2_instock.xml"
const newXMLPath = './providers/polib2b/newXML.xml'
const originalXMLPath = './providers/polib2b/originalXML.xml'


function generateLocalXmlFile(xml) {
    let xml2js = convert.xml2js(xml, {compact: true, spaces: 4});

    const replaceableObjects = [
        {from: "ΕΠΙΠΛΑ > ΚΡΕΒΑΤΟΚΑΜΑΡΑ > ΣΕΤ ΚΡΕΒΑΤΟΚΑΜΑΡΑΣ", to: "Σετ Κρεβατοκάμαρας"},
        {from: "Σαλόνι > Έπιπλα Τηλεόρασης > Ξύλινα", to: "Έπιπλα Τηλεόρασης"},
        {from: "Υπνοδωμάτιο > Ντουλάπες > Ανοιγόμενες", to: "Ντουλάπες"},
        {from: "Υπνοδωμάτιο > Τουαλέτες > Ξύλινες", to: "Τουαλέτες"},
        {from: "Υπνοδωμάτιο > Κρεβάτια > Ξύλινα", to: "Κρεβάτια"},
        {from: "Σαλόνι > Σύνθετα σαλονιού", to: "Συνθέσεις Σαλονιού"},
        {from: "Κουζίνα Τραπεζαρία > Μπουφέδες", to: "Μπουφέδες"},
        {from: "Γραφείο > Γραφεία > Εργασίας", to: "Γραφεία"},
        {from: "Κουζίνα Τραπεζαρία > Έπιπλα Υποδοχής > Παπουτσοθήκες", to: "Παπουτσοθήκες"},
        {from: "Σαλόνι > Τραπεζάκια Σαλονιού > Ξύλινα", to: "Τραπεζάκια Σαλονιού"},
        {from: "Σαλόνι > Τραπεζάκια Σαλονιού > Βοηθητικά", to: "Τραπεζάκια Βοηθητικά"},
        {from: "Γραφείο > Βιβλιοθήκες", to: "Βιβλιοθήκες"},
        {from: "Σαλόνι > Σαλόνια - Καναπέδες > Γωνιακοί Καναπέδες", to: "Καναπέδες Γωνιακοί"},
        {from: "Υπνοδωμάτιο > Κομοδίνα > Ξύλινα", to: "Κομοδίνα"},
        {from: "Υπνοδωμάτιο > Συρταριέρες > Ξύλινες", to: "Συρταριέρες"},
        {from: "Γραφείο > Τραπεζάκια Γραφείου > Ξύλινα", to: "Τραπεζάκια Σαλονιού"},
        {from: "Γραφείο > Γραφεία > Επαγγελματικά", to: "Γραφεία"},
        {from: "Σαλόνι > Σαλόνια - Καναπέδες > Διθέσιοι Καναπέδες", to: "Καναπέδες"},
        {from: "Σαλόνι > Σαλόνια - Καναπέδες > Τριθέσιοι Καναπέδες", to: "Καναπέδες"},
        {from: "Σαλόνι > Αξεσουάρ συνθέσεων > Βιτρίνες Στήλες", to: "Βιτρίνες"},
        {from: "Υπνοδωμάτιο > Καθρέπτες > Κρεμαστοί", to: "Καθρέπτες"},
        {from: "Κουζίνα Τραπεζαρία > Έπιπλα Υποδοχής > Σετ Υποδοχής", to: "Έπιπλα Εισόδου"},
        {from: "Γραφείο > Γραφεία > Υπολογιστή", to: "Γραφεία"},
        {from: "Γραφείο > Συρταριέρες Ντουλάπια > Ντουλάπια", to: "Ντουλάπες Γραφείου"},
        {from: "Γραφείο > Συρταριέρες Ντουλάπια > Συρταριέρες", to: "Συρταριέρες Γραφείου"},
        {from: "Υπνοδωμάτιο > Μαξιλάρια ύπνου", to: "Μαξιλάρια"},
        {from: "Φωτισμός > Επιτραπέζια Πορτατίφ", to: "Φωτιστικά Επιτραπέζια"},
        {from: "Υπνοδωμάτιο > Κρεβάτια > Επενδυμένα", to: "Κρεβάτια"},
        {from: "Κουζίνα Τραπεζαρία > Τραπέζια > Τραπεζαρίας", to: "Τραπέζια"},
        {from: "Σαλόνι > Πολυθρόνες > Μπερζέρα", to: "Πολυθρόνες Σαλονιού"},
        {from: "Υπνοδωμάτιο > Συρταριέρες", to: "Συρταριέρες"},
        {from: "Σαλόνι > Σαλόνια - Καναπέδες > Καναπέδες Κρεβάτια", to: "Καναπέδες - Κρεβάτι"},
        {from: "Σαλόνι > Πολυθρόνες > Πολυθρόνα", to: "Πολυθρόνες Τραπεζαρίας"},
        {from: "Κουζίνα Τραπεζαρία > Καρέκλες > Κουζίνας", to: "Καρέκλες"},
        {from: "Κουζίνα Τραπεζαρία > Καρέκλες > Τραπεζαρίας", to: ""},
    ]

    if (args.filter === "on") {
        xml2js.products.item = xml2js.products.item.filter(product => {
            let mutchedProduct = null
            replaceableObjects.forEach(item => {
                if (product.google_product_category && item.from === product.google_product_category?._cdata.trim()) {
                    mutchedProduct = product
                }
            })
            if (mutchedProduct) {
                return product
            }
        })
    }

    xml2js.products.item.map(product => {
        switch (product.google_product_category._cdata) {
            case "Κουζίνα Τραπεζαρία > Καρέκλες > Τραπεζαρίας":
                if (product.title._cdata.search(/Καρέκλα/i) !== -1) {
                    product.google_product_category._cdata = "Καρέκλες"
                } else if (product.title._cdata.search(/Πολυθρόνα/i) !== -1) {
                    product.google_product_category._cdata = "Πολυθρόνες Τραπεζαρίας"
                }
                break
            default:
                replaceableObjects.map(item => {
                    if (product.google_product_category._cdata === item.from) {
                        product.google_product_category._cdata = item.to
                    }
                })
        }
    })

    /*remove unused products*/
    xml2js.products.item = xml2js.products.item.filter(product => {
        if (product.google_product_category._cdata !== 'Κουζίνα Τραπεζαρία > Καρέκλες > Τραπεζαρίας') {
            return product
        }
    })

    console.log(`${xml2js.products.item.length} Products`)
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


export default function initPolib2b() {
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
