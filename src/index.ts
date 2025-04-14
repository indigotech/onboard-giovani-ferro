import { config } from "dotenv";
import { dbSetup } from "./client/client";
import { serverSetup } from "./server-setup";

config();
console.info("Server initiated sucessfully")
dbSetup();
await serverSetup();
