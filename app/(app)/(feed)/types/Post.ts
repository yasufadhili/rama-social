
type Circle = {
    slug: string;
    name: string;
  };
  
  type Creator = {
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    circles: Circle[];
  };
  
  type Media = {
    url: string;
    type: 'image' | 'video';
  };
  
  type Post = {
    id: string;
    creator: Creator;
    createdAt: string;
    content: string;
    media: Media[];
    likes: number;
    comments: number;
    shares: number;
    isLiked: boolean;
    isStarred: boolean;
  };