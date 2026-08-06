export type Role = 'USER' | 'GOVT' | 'ADMIN';

export interface User {
  id: string; // UUID or unique string
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
  createdAt: string;
}

export type EventStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface EventProposal {
  id: string;
  placeId: string;
  userId: string;
  title: string;
  description: string;
  status: EventStatus;
  createdAt: string;
}
