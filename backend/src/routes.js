const Router = require('koa-router');
const sayHello = require('./controller/hello');
const { createPetTable, insertPetRow, readAllPetRows, dropPetTable } = require('./controller/pet')

const router = new Router();

router.get('/hello', sayHello);

router.post('/createPetTable', createPetTable);

router.patch('/insertPetRow', insertPetRow)

router.get('/readAllPetRows', readAllPetRows)

router.del('/drop', dropPetTable)

module.exports = router