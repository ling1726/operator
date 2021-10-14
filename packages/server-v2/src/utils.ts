import faker from 'faker';
import Attendee from './GameObjects/Attendee';
import Player from './GameObjects/Player';

let ids = 1;
export function generateId() {
  return ids++;
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

let attendeeCount = 0;
const MAX_VALUE_COUNT = 500;
let attendeeNamesSet = new Set<string>();
while(attendeeNamesSet.size < MAX_VALUE_COUNT) {
  attendeeNamesSet.add(faker.name.firstName());
}
const attendeeNames = Array.from(attendeeNamesSet.entries()).map((entry) => entry[0]);

export function getAttendees(nb: number, player: Player) {
  let attendees: Attendee[] = [];
  for(let i=0;i<nb;i++) {
    attendees.push(new Attendee(attendeeNames[attendeeCount + i], player.id));
  }

  attendeeCount += nb;
  return attendees;
}

export function getExchangeNames(nb: number) {
  const exchangeNames: string[] = [];
  for(let i=0;i<nb;i++) {
    exchangeNames.push(faker.address.city());
  }

  return exchangeNames;
}


export function getCallNames(nb: number) {
  const callNames: string[] = [];
  for(let i=0;i<nb;i++) {
    callNames.push(faker.company.companyName());
  }

  return callNames;
}