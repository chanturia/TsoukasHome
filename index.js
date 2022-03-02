import Yargs from 'yargs'
import initPakoworld from "./providers/pakoworld/index.js";
import initWoodmart from "./providers/woodwell/index.js";
import initZougris from "./providers/zougris/index.js";
import initMegapap from "./providers/megapap/index.js";


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
        default:
            console.log('No Such Provider')
            break
    }
}

