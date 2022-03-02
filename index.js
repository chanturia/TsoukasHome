import Yargs from 'yargs'
import initPakoworld from "./providers/pakoworld/index.js";
import initWoodmart from "./providers/woodwell/index.js";
import initZougris from "./providers/zougris/index.js";
import initMegapap from "./providers/megapap/index.js";
import initAlphab2b from "./providers/Alphab2b/index.js";


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
        case 'Alphab2b':
            initAlphab2b()
            break
        default:
            console.log('No Such Provider')
            break
    }
}

