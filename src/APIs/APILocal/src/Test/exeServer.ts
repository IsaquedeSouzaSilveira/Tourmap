import { fastify } from 'fastify';

import RoutesAdmin from "../Controllers/Login/Admin";
import RoutesClient from '../Controllers/Login/Client';
import RoutesBusiness from '../Controllers/Login/Business';

import RoutesPontoTuristicos from '../Controllers/Points/TouristPoint';
import RoutesCommercialPoint from '../Controllers/Points/CommercialPoint';

const server = fastify();

server.register(RoutesAdmin, {prefix: "admin"});
server.register(RoutesClient, {prefix: "client"});
server.register(RoutesBusiness, {prefix: "business"});

server.register(RoutesPontoTuristicos, {prefix: "touristPoint"});
server.register(RoutesCommercialPoint, {prefix: "commercialPoint"});

export default server;

const start = async () => {
  try {
    await server.listen({ port: 3333, host: '0.0.0.0' }); 
    console.log('Servidor rodando na porta 3333');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();