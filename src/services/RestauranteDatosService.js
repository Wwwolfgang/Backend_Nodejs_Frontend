import http from "../http-common";

class RestauranteDatosService {
  getAll() {
    return http.get("/restaurante");
  }

  get(id) {
    return http.get(`/restaurante/${id}`);
  }

  create(data) {
    return http.post("/restaurante", data);
  }

  update(id, data) {
    return http.put(`/restaurante/${id}`, data);
  }

  delete(id) {
    return http.delete(`/restaurante/${id}`);
  }

}

export default new RestauranteDatosService();