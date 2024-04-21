export class ReviewsDtoCreate {
  product: number;
  user: number;
  firstName: string;
  lastName: string;
  rating: number;
  review: string;
  approved: boolean;
}
