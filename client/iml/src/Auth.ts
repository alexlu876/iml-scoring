export const jwtDecode = require('jwt-decode');


export function getLocalAccessToken() : string | null {
    return localStorage.getItem('accessToken');
}

export function isLocalAccessTokenFresh() : boolean {
    return localStorage.getItem('accessTokenFreshness') === '1';
}
export function setLocalTokenFreshness(freshness : boolean) {
    localStorage.setItem('accessTokenFreshness', freshness ? '1' : '0');
}

export function getTokenIdentifier(token: string) : string | null {
    try {
    var decoded = jwtDecode(token);
    }
    catch (err) {
        return null;
    }
    if (!decoded) return null;
    var identity = decoded["identity"];
    return identity;
}
export function isTokenValid(token : string) : boolean {
    var decoded = jwtDecode(token);
    if (!decoded) return false;
    var expirationTime = decoded["exp"];
    if (!expirationTime) return false;
    return expirationTime*1000 > Date.now();
}

export function getLocalRefreshToken() : string | null {
    return localStorage.getItem('refreshToken');
}

export function setLocalRefreshToken(refreshToken: string) {
    localStorage.setItem('refreshToken', refreshToken);
    setLocalTokenFreshness(true);
}

export function setLocalAccessToken(accessToken: string) {
    console.log(accessToken);
    localStorage.setItem('accessToken', accessToken);
}

//todo -use mobx or apollo state for this
export function isLoggedIn() : boolean {
    return getLocalAccessToken() != null;
}

export function logout() : void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}
