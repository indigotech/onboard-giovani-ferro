import axios from "axios";
import { expect } from "chai";

const port = process.env.PORT ? +process.env.PORT : 30002;

describe('GET Users', async () => {
  it('should find all users', async () => {
    const response = await axios.get(`http://localhost:${port}/users`);

    expect(response.status).to.equal(200);

    expect(response.data).to.be.an("array");
  });
});
