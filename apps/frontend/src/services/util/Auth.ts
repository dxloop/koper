/**
 * Sets the JWT token in the local storage
 * @param token The JWT token to be set in the local storage
 */
export function setJWT(token: string) {
   localStorage.setItem('token', token);
}

/**
 * Gets the JWT token from the local storage
 * @returns JWT token from the local storage
 */
export function getJWT() {
   return localStorage.getItem('token');
}

/**
 * Removes the JWT token from the local storage
 */
export function removeJWT() {
   localStorage.removeItem('token');
}