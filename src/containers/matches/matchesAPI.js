export const getMatchById = (matchId, callback) => {
    window.api.promise('/match/id', matchId, (res) => callback(res));
}

export const getMatchesBySessionId = (form, callback) => {
    window.api.promise('/match/session', form, (res) => callback(res));
}

export const createMatch = (form, callback) => {
    console.log(form);
    window.api.promise('/match/post', form, (res) => callback(res));
}