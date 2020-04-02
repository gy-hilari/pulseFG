function CompRoutes(router, controller) {
    this.controller = controller;

    router.on('/comp', (ping) => {
        console.log(ping.message);
        return new Promise((resolve, reject) => {
            this.controller.GetCompendiums().then((res) => {
                resolve(res);
            });
        });
    });

    router.on('/comp/id', (compId) => {
        return new Promise((resolve, reject) => {
            GetCompendiumById(id).then((res) => {
                resolve(res);
            }).catch((err) => reject(err));
        });
    });

    router.on('/comp/post', (form) => {
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

    router.on('/comp/delete', (compId) => {
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

    router.on('/comp/update', (form) => {
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
    CompRoutes: CompRoutes
}