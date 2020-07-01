function MatchRoutes(router, controller) {
    this.controller = controller;

    router.on('/match/id', (matchId) => {
        return new Promise((resolve, reject) => {
            this.controller.GetMatchById(matchId).then((res) => {
                resolve(res);
            });
        });
    });

    router.on('/match/session', (sessionId) => {
        return new Promise((resolve, reject) => {
            this.controller.GetMatchesBySessionId(sessionId).then((res) => {
                resolve(res);
            });
        });
    });

    router.on('/match/post', (form) => {
        return new Promise((resolve, reject) => {
            this.controller.CreateMatch(form).then((res) => {
                resolve(res);
            }).catch((err) => {
                resolve(res);
            });
        });
    });

    router.on('/match/id/delete', (form) => {
        return new Promise((resolve, reject) => {
            this.controller.DeleteMatchById(form.matchId).then((res) => {
                this.controller.GetMatchesBySessionId(form.sessionId).then((res) => {
                    resolve(res);
                });
            }).catch((err) => {
                this.controller.GetMatchesBySessionId(form.sessionId).then((res) => {
                    resolve(res);
                });
            })
        });
    });

    // router.on('/match/session/delete', (sessionId) => {
    //     return new Promise((resolve, reject) => {
    //         this.controller.DeleteMatchById(form.matchId).then((res) => {
    //             this.controller.GetMatchesBySessionId(form.sessionId).then((res) => {
    //                 resolve(res);
    //             });
    //         }).catch((err) => {
    //             this.controller.GetMatchesBySessionId(form.sessionId).then((res) => {
    //                 resolve(res);
    //             });
    //         })
    //     });
    // });
}

module.exports = {
    MatchRoutes: MatchRoutes
}