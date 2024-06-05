import { Participation } from './Participation';
export class Olympic {
  id!: number;
  country!: string;
  participations!: Participation[];
  numberOfParticipation?: number;
}

export interface CountryDetails {
  name: string;
  series: { name: string; value: number }[];
}
