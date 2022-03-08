import convert from "xml-js"
import fs from 'fs'
import Yargs from 'yargs'
import axios from "axios";

const args = Yargs(process.argv).argv
const XML_link = "https://www.woodwell.gr/services/ProductsXmlFeedLang.ashx?username=150545619&lang=el&xmlFeedKey=67457717-384c-497f-9185-f1103cb8f33f"
const newXMLPath = './providers/woodwell/newXML.xml'
const originalXMLPath = './providers/woodwell/originalXML.xml'


function generateLocalXmlFile(xml) {
    let xml2js = convert.xml2js(xml, {compact: true, spaces: 4});

    const replaceableObjects = [
        {from: "Καναπέδες Γωνία-Πολυμορφικοί", to: "Καναπέδες Γωνιακοί"},
        {from: "Καναπέδες-Πολυθρόνες-Σκαμπώ / Κρεβάτι", to: "Καναπέδες - Κρεβάτι"},
        {from: "Τραπεζάκια Σαλονιού & Βοηθητικά", to: "Τραπεζάκια Σαλονιού"},
        {from: "Έπιπλα TV - Κονσόλες", to: "Έπιπλα Τηλεόρασης"},
        {from: "Τραπέζια", to: "Τραπέζια"},
        {from: "Καθίσματα", to: "Καρέκλες"},
        {from: "Καρέκλες", to: "Καρέκλες"},
        {from: "Τραπεζαρίες set", to: "Σετ Τραπεζαρίες"},
        {from: "Κρεβάτια-Υποστρώματα-Set Υπνοδωμάτιο", to: "Κρεβάτια"},
        {from: "Στρώματα - Επιστρώματα - Μαξιλάρια", to: "Στρώματα "},
        {from: "Σκαμπώ Αποθήκευσης & Βοηθητικά", to: "Σκαμπό"},
        {from: "Set Καθιστικά - Τραπεζαρίες", to: "Σαλόνια Κήπου"},
        {from: "Καθίσματα Διευθυντικά", to: "Καρέκλες Διευθυντικές"},
        {from: "Καθίσματα Εργασίας / Μαθητείας", to: "Καρέκλες Γραφείου"},
        {from: "Καναπέδες & Καθίσματα Υποδοχής", to: "Καρέκλες Υποδοχής"},
        {from: "Γραφεία - Τραπέζια Συνεδρίου", to: "Γραφεία"},
        {from: "Καναπέδες-Πολυθρόνες & Σκαμπώ Κρεβάτι", to: "Γραφεία"},
        {from: "Μπουφέδες - Βιβλιοθήκες - Ραφιέρες - Βιτρίνες", to: "Γραφεία"},
        {from: "Κομοδίνα-Συρταριέρες-Τουαλέτες-Ντουλάπες", to: ""},
        {from: "Παπουτσοθήκες-Καλόγεροι-Καθρέπτες", to: ""},
        {from: "Καναπέδες - Καρέκλες - Πολυθρόνες", to: ""},
        {from: "Σαλόνια-Καναπέδες-Πολυθρόνες-Μπερζέρες-Ταμπουρέ", to: ""},
    ]

    if (args.filter === "on") {
        xml2js.NewDataSet.Table = xml2js.NewDataSet.Table.filter(product => {
            let mutchedProduct = null
            replaceableObjects.forEach(item => {
                if (item.from === product.Category_Caption_Title._text) {
                    mutchedProduct = product
                }
            })
            if (mutchedProduct) {
                return product
            }
        })
    }

    xml2js.NewDataSet.Table.map((product, index) => {
        switch (product.Category_Caption_Title._text) {
            case "Καναπέδες-Πολυθρόνες & Σκαμπώ Κρεβάτι":
                if (product.ProductCaption_Title._text.search('Μπουφές') !== -1) {
                    product.Category_Caption_Title._text = "Μπουφέδες"
                } else {
                    xml2js.NewDataSet.Table[index] = {}
                }
                break
            case "Μπουφέδες - Βιβλιοθήκες - Ραφιέρες - Βιτρίνες":
                if (product.ProductCaption_Title._text.search('Μπουφές') !== -1) {
                    product.Category_Caption_Title._text = "Μπουφέδες"
                } else {
                    xml2js.NewDataSet.Table[index] = null
                }
                break
            case "Κομοδίνα-Συρταριέρες-Τουαλέτες-Ντουλάπες":
                if (product.ProductCaption_Title._text.search('Κομοδίνο') !== -1) {
                    product.Category_Caption_Title._text = "Κομοδίνα"
                } else if (product.ProductCaption_Title._text.search('Συρταριέρα') !== -1) {
                    product.Category_Caption_Title._text = "Συρταριέρες"
                } else if (product.ProductCaption_Title._text.search('Ντουλάπα') !== -1) {
                    product.Category_Caption_Title._text = "Ντουλάπες"
                } else {
                    xml2js.NewDataSet.Table[index] = null
                }
                break
            case "Παπουτσοθήκες-Καλόγεροι-Καθρέπτες":
                if (product.ProductCaption_Title._text.search('Παπουτσοθήκη') !== -1) {
                    product.Category_Caption_Title._text = "Παπουτσοθήκες"
                } else if (product.ProductCaption_Title._text.search('Καθρέπτης') !== -1) {
                    product.Category_Caption_Title._text = "Καθρέπτες"
                } else {
                    xml2js.NewDataSet.Table[index] = null
                }
                break
            case "Καναπέδες - Καρέκλες - Πολυθρόνες":
                if (product.ProductCaption_Title._text.search('Καρέκλα') !== -1) {
                    product.Category_Caption_Title._text = "Καρέκλες Κήπου"
                }
                if (product.ProductCaption_Title._text.search('Πολυθρόνα') !== -1) {
                    product.Category_Caption_Title._text = "Πολυθρόνες Κήπου"
                }
                break
            case "Σαλόνια-Καναπέδες-Πολυθρόνες-Μπερζέρες-Ταμπουρέ":
                const searchTextLists1 = ['Σαλόνι', 'Καναπές', 'Kαναπές']
                const searchTextLists2 = ['Πολυθρόνα', 'Μπερζέρα']
                const searchTextLists3 = ['Σκαμπό', 'Υποπόδιο']
                searchTextLists1.map(searchTextList => {
                    if (product.ProductCaption_Title._text.search(searchTextList) !== -1) {
                        product.Category_Caption_Title._text = 'Καναπέδες'
                    }
                })
                searchTextLists2.map(searchTextList => {
                    if (product.ProductCaption_Title._text.search(searchTextList) !== -1) {
                        product.Category_Caption_Title._text = 'Πολυθρόνες Σαλονιού'
                    }
                })
                searchTextLists3.map(searchTextList => {
                    if (product.ProductCaption_Title._text.search(searchTextList) !== -1) {
                        product.Category_Caption_Title._text = 'Σκαμπό'
                    }
                })
                break
            default:
                replaceableObjects.map(item => {
                    if (product.Category_Caption_Title._text === item.from) {
                        product.Category_Caption_Title._text = item.to
                    }
                })
        }
    })
    /*remove empty products*/
    xml2js.NewDataSet.Table = xml2js.NewDataSet.Table.filter(product => {
        return product
    })
    console.log(`${xml2js.NewDataSet.Table.length} Products`)

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


export default function initWoodmart() {
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
