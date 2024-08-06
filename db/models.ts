export interface User {
    id: number;
    display_name: string;
    phone_number: string;
    profile_picture_url: string;
    email_address: string;
  }
  
  export interface Post {
    id: number;
    userId: number;
    title: string;
    content: string;
    createdAt: number;
    user?: User;
    comments?: Comment[];
  }
  
  export interface Comment {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: number;
    user?: User;
  }