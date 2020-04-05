export const getSessionsByCompId = (compId, callback) => {
    window.api.promise('/session/comp', compId, (res) => callback(res));
}

export const createSession = (form, callback) => {
    window.api.promise('/session/post', form, (res) => callback(res));
}

export const deleteSessionById = (form, callback) => {
    window.api.promise('/session/id/delete', form, (res) => callback(res));
}

export const updateSessionName = (form, callback) => {
    window.api.promise('/session/put/name', form, (res) => callback(res));
}

export const createMeasurement = (form, callback) => {
    window.api.promise('/measure/post', form, (res) => callback(res));
}

export const getMeasurementsBySessionId = (sessionId, callback) => {
    window.api.promise('/measure/session', sessionId, (res) => callback(res));
}