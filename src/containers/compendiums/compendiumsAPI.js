export const ipcTest = () => {
    window.api.promise('test', { message: "Getting image dir..." }, (res) => console.log(res));
}

export const getComps = (callback) => {
    window.api.promise('/comp', { message: 'getting compendiums...' }, (res) => callback(res));
}

export const createComp = (form, callback) => {
    window.api.promise('/comp/create', form, (res) => callback(res));
}

export const deleteComp = (compId, callback) => {
    window.api.promise('/comp/delete', compId, (res) => callback(res));
}