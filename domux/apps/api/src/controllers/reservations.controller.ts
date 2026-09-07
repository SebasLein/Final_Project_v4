import { FastifyReply, FastifyRequest } from 'fastify';
import { parseOrThrow } from '../lib/validate';
import { createReservationSchema, reservationFiltersSchema } from '../schemas/reservations.schema';
import * as reservationsService from '../services/reservations.service';

export async function listReservationsHandler(request: FastifyRequest, reply: FastifyReply) {
  const filters = parseOrThrow(reservationFiltersSchema, request.query);
  const reservations = await reservationsService.listReservations(request.authUser!, filters);
  return reply.send(reservations);
}

export async function createReservationHandler(request: FastifyRequest, reply: FastifyReply) {
  const input = parseOrThrow(createReservationSchema, request.body);
  const reservation = await reservationsService.createReservation(request.authUser!, input);
  return reply.code(201).send(reservation);
}

export async function cancelReservationHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const reservation = await reservationsService.cancelReservation(request.authUser!, id);
  return reply.send(reservation);
}
