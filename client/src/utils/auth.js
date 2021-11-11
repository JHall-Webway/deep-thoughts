import decode from 'jwt-decode';

class AuthService {
    getProfile() {
        return decode(this.getToken());
    }
    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.expiresIn > Date.now() / 1000) {
                localStorage.removeItem('id_token');
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }
    getToken() {
        return localStorage.getItem('id_token');
    }
    login(idToken) {
        localStorage.setItem('id_token', idToken);
        window.location.assign('/');
    }
    logout() {
        localStorage.removeItem('id_token');
        window.location.assign('/');
    }
};

export default new AuthService();