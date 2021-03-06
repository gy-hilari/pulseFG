export const getComps = (callback) => {
    window.api.promise('/comp', { message: 'getting compendiums...' }, (res) => callback(res));
}

export const getComp = (compId, callback) => {
    window.api.promise('/comp/id', compId, (res) => callback(res));
}

export const createComp = (form, callback) => {
    window.api.promise('/comp/post', form, (res) => callback(res));
}

export const deleteComp = (compId, callback) => {
    window.api.promise('/comp/delete', compId, (res) => callback(res));
}

export const updateComp = (form, callback) => {
    window.api.promise('/comp/update', form, (res) => callback(res));
}