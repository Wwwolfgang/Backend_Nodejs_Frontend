import http from "../http-common";

class ReservaDatosService {
  getAll() {
    return http.get("/reservas");
  }

  get(id) {
    return http.get(`/reservas/${id}`);
  }

  create(data) {
    return http.post("/reservas", data);
  }

  update(id, data) {
    return http.put(`/reservas/${id}`, data);
  }

  delete(id) {
    return http.delete(`/reservas/${id}`);
  }

}

export default new ReservaDatosService();