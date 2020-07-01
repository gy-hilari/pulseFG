export const getMatchById = (matchId, callback) => {
    window.api.promise('/match/id', matchId, (res) => callback(res));
}

export const getMatchesBySessionId = (sessionId, callback) => {
    window.api.promise('/match/session', sessionId, (res) => callback(res));
}

export const createMatch = (form, callback) => {
    console.log(form);
    window.api.promise('/match/post', form, (res) => callback(res));
}

export const deleteMatchById = (form, callback) => {
    window.api.promise('/match/id/delete', form, (res) => callback(res));
}

export const deleteMatchesBySessionId = (sessionId) => {
    getMatchesBySessionId(sessionId, (matches) => {
        if(matches.length > 0)
        matches.forEach(match => deleteMatchById({matchId: match.id, sessionId: sessionId}, (res) => console.log(res))); 
    });
}