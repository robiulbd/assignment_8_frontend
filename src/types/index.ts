export interface Book {
  _id?: string;
  title: string;
  author: string;
  category:
    | "Fiction"
    | "Science"
    | "History"
    | "Kids"
    | "Poetry"
    | "Religion"
    | "Technology"
    | "Others";
  image: string;
  description: string;
  copies: number;
  userName: string;
  userEmail: string;
  createdAt?: string;
}

export interface IBorrow {
  _id?: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName?: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
}