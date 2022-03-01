import Yargs from 'yargs'
import initPakoworldt from "./providers/pakoworld/index.js";
import initWoodmart from "./providers/woodwell/index.js";


const args = Yargs(process.argv).argv

if (args?.provider) {
    switch (args.provider) {
        case 'pakoworld':
            initPakoworldt()
            break
        case 'woodwell':
            initWoodmart()
            break
        case 'zougris':
            initPakoworldt()
            break
        default:
            console.log('No Such Provider')
            break
    }
}

