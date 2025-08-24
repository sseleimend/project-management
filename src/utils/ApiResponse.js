export class ApiResponse {
  constructor({ status, message, data = null, error = null }) {
    this.status = status;
    this.message = message;
    if (data !== null) this.data = data;
    if (error !== null) this.error = error;
  }
}

export default ApiResponse;
