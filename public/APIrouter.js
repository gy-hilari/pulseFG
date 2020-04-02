const promiseIpc = require('electron-promise-ipc');
const controller = require('./APIcontroller');

const Controller = controller.Controller;

function Router(db) {
    this.controller = new Controller(db);
    this.routes = promiseIpc;

    this.routes.on('test', () => {
        return new Promise((resolve, reject) => {
            console.log('IPC Reached main!');
            resolve('IPC Returned from main!');
        });
    });

    this.routes.on('/comp', (ping) => {
        console.log(ping.message);
        return new Promise((resolve, reject) => {
            this.controller.GetCompendiums().then((res) => {
                resolve(res);
            });
        });
    });

    this.routes.on('/comp/id', (compId) => {
        return new Promise((resolve, reject) => {
            GetCompendiumById(id).then((res) => {
                resolve(res);
            }).catch((err) => reject(err));
        });
    });

    this.routes.on('/comp/create', (form) => {
        return new Promise((resolve, reject) => {
            this.controller.CreateCompendium(form).then((res) => {
                this.controller.GetCompendiums().then((res) => {
                    resolve(res);
                });
            }).catch((err) => {
                this.controller.GetCompendiums().then((res) => {
                    resolve(res);
                });
            });
        });
    });

    this.routes.on('/comp/delete', (compId) => {
        return new Promise((resolve, reject) => {
            this.controller.DeleteCompendiumById(compId).then((res) => {
                this.controller.GetCompendiums().then((res) => {
                    resolve(res);
                });
            }).catch((err) => {
                this.controller.GetCompendiums().then((res) => {
                    resolve(res);
                });
            });
        });
    });

    this.routes.on('/comp/update', (form) => {
        return new Promise((resolve, reject) => {
            this.controller.UpdateCompendiumById(form).then((res) => {
                this.controller.GetCompendiumById(form.id).then((res) => {
                    resolve(res);
                });
            }).catch((err) => {
                this.controller.GetCompendiumById(form.id).then((res) => {
                    resolve(res);
                });
            });
        });
    });
}

module.exports = {
    Router: Router
}