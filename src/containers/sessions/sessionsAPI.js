export const getSessionsByCompId = (compId, callback) => {
    console.log(`Getting Sessions of ${compId}`);
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