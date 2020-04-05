function MeasurementRoutes(router, controller) {
    this.controller = controller;

    router.on('/measure/post', (form) => {
        return new Promise((resolve, reject) => {
            this.controller.CreateMeasurement(form).then((res) => {
                resolve(res);
            }).catch((err) => {
                console.log(err);
            });
        });
    });

    router.on('/measure/session', (sessionId) => {
        console.log(sessionId);
        return new Promise((resolve, reject) => {
            this.controller.GetMeasurementsBySessionId(sessionId).then((res) => {
                resolve(res);
            });
        })
    })
}

module.exports = {
    MeasurementRoutes: MeasurementRoutes
}