import Yargs from 'yargs'
import initPakoworld from "./providers/pakoworld/index.js";
import initWoodmart from "./providers/woodwell/index.js";
import initZougris from "./providers/zougris/index.js";
import initMegapap from "./providers/megapap/index.js";
import initAlphab2b from "./providers/alphab2b/index.js";
import initPolib2b from "./providers/polib2b/index.js";
import initFylliana from "./providers/fylliana";


const args = Yargs(process.argv).argv

if (args?.provider) {
    switch (args.provider) {
        case 'pakoworld':
            initPakoworld()
            break
        case 'woodwell':
            initWoodmart()
            break
        case 'zougris':
            initZougris()
            break
        case 'megapap':
            initMegapap()
            break
        case 'alphab2b':
            initAlphab2b()
            break
        case 'polib2b':
            initPolib2b()
            break
        case 'fylliana':
            initFylliana()
            break
        default:
            console.log('No Such Provider')
            break
    }
}

