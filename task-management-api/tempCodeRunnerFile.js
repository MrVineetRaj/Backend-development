;
require('./db/mongoose')

const routerUser = require('./routers/user')
const routerTask = require('./routers/task')
const app = express();
const port= 3000;

app.use(express.json())
