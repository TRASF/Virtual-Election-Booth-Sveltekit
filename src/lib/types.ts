export interface User {
    uid: string;
    email?: string | null;
    name?: string;
  }

export interface UserLogIn{
  VerifiedEmail: User;
}

export interface Candidate {
  id: number;
  votes: number;
  name: string;
  voteParty: string;
}