import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/';

class UserService {
    getPublicContent() {
        return axios.get(API_URL);
    }


    getOrderList(id) {
        return axios.get(API_URL + 'showorders', {
            headers: authHeader(),
            params: {
                user_id: id
            }


        })
    }

    getAdminBoard() {
        return axios.get(API_URL + 'admin', {headers: authHeader()});
    }
}

export default new UserService();
