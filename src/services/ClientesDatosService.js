import http from "../http-common";

class ClientesDatosService {
    getAll() {
        return http.get("/cliente");
    }

    create(data) {
        return http.post("/cliente", data);
    }
}
export default new ClientesDatosService();