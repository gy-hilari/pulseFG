function SessionRoutes(router, controller) {
    this.controller = controller;

    router.on('/session/comp', (compId) => {
        return new Promise((resolve, reject) => {
            this.controller.GetSessionsByCompId(compId).then((res) => {
                resolve(res);
            });
        });
    });

    router.on('/session/id', (sessionId) => {
        return new Promise((resolve, reject) => {
            this.controller.GetSessionById(sessionId).then((res) => {
                resolve(res);
            }).catch((err) => reject(err));
        });
    });

    router.on('/session/post', (form) => {
        return new Promise((resolve, reject) => {
            this.controller.CreateSession(form).then((res) => {
                this.controller.GetSessionsByCompId(form.compId).then((res) => {
                    resolve(res);
                });
            }).catch((err) => {
                this.controller.GetSessionsByCompId(form.compId).then((res) => {
                    resolve(res);
                });
            });
        });
    });

    router.on('/session/id/delete', (form) => {
        return new Promise((resolve, reject) => {
            this.controller.DeleteSessionById(form.sessionId).then((res) => {
                this.controller.GetSessionsByCompId(form.compId).then((res) => {
                    resolve(res);
                });
            }).catch((err) => {
                this.controller.GetSessionsByCompId(form.compId).then((res) => {
                    resolve(res);
                });
            })
        });
    });

    router.on('/session/put/name', (form) => {
        return new Promise((resolve, reject) => {
            this.controller.UpdateSessionNameById(form).then((res) => {
                this.controller.GetSessionById(form.sessionId).then((res) => {
                    resolve(res);
                });
            }).catch((err) => {
                this.controller.GetSessionById(form.sessionId).then((res) => {
                    resolve(res);
                });
            });
        });
    });

    // router.on('/session/comp/delete', (compId) => {
    //     return new Promise((resolve, reject) => {
    //         this.controller.DeleteSessionByCompId(compId).then((res) => {

    //         }).catch((err) => {

    //         })
    //     });
    // });
}

module.exports = {
    SessionRoutes: SessionRoutes
}