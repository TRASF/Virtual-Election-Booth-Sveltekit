export interface User {
  uid: string | null;
  email?: string | null;
  name?: string | null;
  identificationID?: string | null
  votePartyAllowed?: Array<Voteparty> | null
}

export interface Voteparty {
  candidate: string
  votes: BigInteger
  Name: string,
  createdAt: Date,
  updateAt: Date
}

export interface UserLogIn {
  VerifiedEmail: User;
}

export interface Candidate {
  id: number;
  votes: number;
  name: string;
  voteParty: string; 
} 