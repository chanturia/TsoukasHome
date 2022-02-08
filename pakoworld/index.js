import convert from "xml-js"
import https from 'https'
import fs from 'fs'
import Yargs from 'yargs'

const args = Yargs(process.argv).argv
const XML_link = "https://www.pakoworld.com/?route=extension%2Ffeed%2Fcsxml_feed&token=MTQ4NTlMUDI4MA%3D%3D&lang=el&fbclid=IwAR2faAQyDtKJhwKOamSa8qPvH2R0d9h9x9DArj1Oed743MLrIuwHIQDs5gE"


function generateLocalXmlFile(xml) {
    let xml2js = convert.xml2js(xml, {compact: true, spaces: 4});

    const replaceableObjects = [
        {from: "Έπιπλα εσωτερικού χώρου > Ντουλάπες ρούχων", to: "Epipla-esoterikou-xorou>ntoulapes"},
        {from: "Διακόσμηση", to: "diakosmisi"},
        {from: "Έπιπλα γραφείου > Βιβλιοθήκες γραφείου", to: "voithitika-epipla>vivliothikes"},
        {from: "Έπιπλα γραφείου > Γραφεία διευθυντικά", to: "epipla-grafeiou>grafeia"},
        {from: "Έπιπλα γραφείου > Γραφεία εργασίας", to: "epipla-grafeiou>grafeia"},
        {from: "Έπιπλα γραφείου > Καναπέδες γραφείου", to: "epipla-grafeiou>kanapedes"},
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου Gaming - Βucket", to: "epipla-grafeiou>karekles-grafeiou"},
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου διευθυντή", to: "epipla-grafeiou>karekles-grafeiou"},
        {
            from: "Έπιπλα γραφείου > Καρέκλες γραφείου διευθυντή SUPREME QUALITY",
            to: "epipla-grafeiou>karekles-grafeiou"
        },
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου επισκέπτη", to: "epipla-grafeiou>karekles-ipodoxis"},
        {from: "Έπιπλα γραφείου > Καρέκλες γραφείου εργασίας", to: "epipla-grafeiou>karekles-grafeiou"},
        {from: "Έπιπλα γραφείου > Ντουλάπες γραφείου", to: "epipla-grafeiou>ntoulapes-grafeiou"},
        {from: "Έπιπλα εξωτερικού χώρου > Καρέκλες κήπου", to: "epipla-eksoterikou-xorou>karekles-kipou"},
        {from: "Έπιπλα εξωτερικού χώρου > Πολυθρόνες κήπου", to: "epipla-eksoterikou-xorou>karekles-kipou"},
        {from: "Έπιπλα εξωτερικού χώρου > Σαλόνια κήπου", to: "epipla-eksoterikou-xorou>salonia-kipou"},
        {from: "Έπιπλα εξωτερικού χώρου > Σετ τραπεζαρία κήπου", to: "epipla-eksoterikou-xorou>-set-trapezia-kipou"},
        {from: "Έπιπλα εξωτερικού χώρου > Τραπέζια Φαγητού κήπου", to: "epipla-eksoterikou-xorou>trapezia-kipou"},
        {from: "Έπιπλα εσωτερικού χώρου > Βιβλιοθήκες", to: "voithitika-epipla>vivliothikes"},
        {from: "Έπιπλα εσωτερικού χώρου > Βιτρίνες", to: "epipla-esoterikou-xorou>vitrines"},
        {from: "Έπιπλα εσωτερικού χώρου > Έπιπλα εισόδου", to: "voithitika-epipla>epipla-eisodou"},
        {from: "Έπιπλα εσωτερικού χώρου > Έπιπλα τηλεόρασης", to: "epipla-esoterikou-xorou>epipla-tileorasis"},
        {from: "Έπιπλα εσωτερικού χώρου > Καναπέδες", to: "epipla-esoterikou-xorou>kanapedes"},
        {from: "Έπιπλα εσωτερικού χώρου > Καναπέδες - Κρεβάτι", to: "epipla-esoterikou-xorou>kanapedes"},
        {from: "Έπιπλα εσωτερικού χώρου > Καναπέδες γωνιακοί", to: "epipla-esoterikou-xorou>salonia"},
        {from: "Έπιπλα εσωτερικού χώρου > Καρέκλες", to: "epipla-esoterikou-xorou>karekles"},
        {from: "Έπιπλα εσωτερικού χώρου > Κομοδίνα", to: "voithitika-epipla>komodina"},
        {from: "Έπιπλα εσωτερικού χώρου > Κρεβάτια", to: "epipla-esoterikou-xorou>krevatia"},
        {from: "Έπιπλα εσωτερικού χώρου > Μπουφέδες", to: "epipla-esoterikou-xorou>mpoufedes"},
        {from: "Έπιπλα εσωτερικού χώρου > Παπουτσοθήκες", to: "voithitika-epipla>papoutsothikes"},
        {from: "Έπιπλα εσωτερικού χώρου > Πολυθρόνες - Κρεβάτι", to: "epipla-esoterikou-xorou>polithrones"},
        {from: "Έπιπλα εσωτερικού χώρου > Πολυθρόνες σαλονιού", to: "epipla-esoterikou-xorou>polithrones"},
        {from: "Έπιπλα εσωτερικού χώρου > Πολυθρόνες τραπεζαρίας", to: "epipla-esoterikou-xorou>karekles"},
        {from: "Έπιπλα εσωτερικού χώρου > Ραφιέρες τοίχου", to: "voithitika-epipla>rafieres-toixou"},
        {from: "Έπιπλα εσωτερικού χώρου > Σετ τραπεζαρίες", to: "epipla-esoterikou-xorou>trapezaries"},
        {from: "Έπιπλα εσωτερικού χώρου > Σκαμπό", to: "voithitika-epipla>skampo"},
        {from: "Έπιπλα εσωτερικού χώρου > Στρώματα ύπνου & Σομιέδες", to: "voithitika-epipla>stromata"},
        {from: "Έπιπλα εσωτερικού χώρου > Συνθέσεις σαλονιού", to: "epipla-esoterikou-xorou>sintheseis-saloniou"},
        {from: "Έπιπλα εσωτερικού χώρου > Συρταριέρες - Κονσόλες", to: "voithitika-epipla>sirtarieres"},
        {from: "Έπιπλα εσωτερικού χώρου > Τραπεζάκια βοηθητικά", to: "voithitika-epipla>trapezakia"},
        {from: "Έπιπλα εσωτερικού χώρου > Τραπεζάκια σαλονιού", to: "epipla-esoterikou-xorou>trapezakia-saloniou"},
        {from: "Έπιπλα εσωτερικού χώρου > Τραπέζια", to: "epipla-esoterikou-xorou>trapezia"},
        {from: "Φωτισμός > Απλίκες", to: "fotismos>fotistika-aplikes"},
        {from: "Φωτισμός > Δαπέδου", to: "fotismos>fotistika-dapedou"},
        {from: "Φωτισμός > Επιτραπέζια", to: "fotismos>fotistika-epitrapezia"},
        {from: "Φωτισμός > Οροφής", to: "fotismos>fotistika-orofis"},
    ]

    const filteredObject = [
        "Είδη ταξιδίου > Βαλίτσες ταξιδίου",
        "Είδη ταξιδίου > Σακίδια πλάτης - Backpacks",
        "Έπιπλα γραφείου > Reception γραφείου",
        "Έπιπλα γραφείου > Καρέκλες γραφείου παιδικές",
        "Έπιπλα γραφείου > Ντουλάπια γραφείου",
        "Έπιπλα γραφείου > Πολυθρόνες γραφείου",
        "Έπιπλα γραφείου > Συρταριέρες γραφείου",
        "Έπιπλα γραφείου > Τραπεζάκια γραφείου",
        "Έπιπλα γραφείου > Τραπέζια συνεδρίου",
        "Έπιπλα εξωτερικού χώρου > Έπιπλα catering - συνεδρίου",
        "Έπιπλα εξωτερικού χώρου > Κούνιες κήπου",
        "Έπιπλα εξωτερικού χώρου > Πανιά πολυθρόνας σκηνοθέτη",
        "Έπιπλα εσωτερικού χώρου > Ανάκλινδρα",
        "Έπιπλα εσωτερικού χώρου > Καλόγεροι - Κρεμάστρες",
        "Έπιπλα εσωτερικού χώρου > Οργάνωση σπιτιού",
        "Έπιπλα εσωτερικού χώρου > Παιδικό Δωμάτιο",
        "Έπιπλα εσωτερικού χώρου > Πουφ",
        "Έπιπλα εσωτερικού χώρου > Σκαμπό μπαρ",
    ]
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

    if (args.filter === "on") {
        xml2js.pakoworld.products.product = xml2js.pakoworld.products.product.filter(product => {
            if (!filteredObject.includes(product.category._cdata)) {
                return product
            }
        })
    }

    const js2xml = convert.js2xml(xml2js, {compact: true, ignoreComment: true, spaces: 4});

    fs.writeFileSync('newXML.xml', js2xml)

}

async function getXMLFromUrl() {
    let xml = '';
    console.time('time')
    https.get(XML_link, response => {
        response.on('data', function (chunk) {
            xml += chunk;
        });
        response.on('end', function () {
            fs.writeFileSync('originalXML.xml', xml, "utf-8")
            generateLocalXmlFile(xml)
            console.timeEnd('time')
        });
    })
}

async function getXMLFromFile(fileName) {
    console.time('time')
    const xmlData = fs.readFileSync(fileName, 'utf8')
    generateLocalXmlFile(xmlData)
    console.timeEnd('time')
}

if (args.type === 'file') {
    if (fs.existsSync('originalXML.xml')) {
        getXMLFromFile('originalXML.xml').then()
    } else {
        getXMLFromUrl().then()
    }
} else {
    getXMLFromUrl().then()
}
