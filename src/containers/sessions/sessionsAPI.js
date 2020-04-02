export const getSessionsByCompId = (compId, callback) => {
    window.api.promise('/session/comp', compId, (res) => callback(res));
}

export const createSession = (form, callback) => {
    window.api.promise('/session/post', form, (res) => callback(res));   
}

export const deleteSessionById = (form, callback) =>{
    window.api.promise('/session/id/delete', form, (res) => callback(res));   
}