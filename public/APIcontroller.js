const compController = require('./controllers/compController');

const CompController = compController.CompContoller;

function Controller(db) {
    this.db = db;
    this.controllers = {
        compController: new CompController(this.db)
    }
}

module.exports = {
    Controller: Controller
}