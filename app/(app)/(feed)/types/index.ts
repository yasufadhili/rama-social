export interface Post {
    post_type: 'text' | 'default' | 'audio';
    mediaUrls: string[];
    textBlocks: TextBlock[];
    content: string;
  }
  
  export interface TextBlock {
    text: string;
    style: any; 
  }
  
  export interface PostCardProps {
    item: Post;
    onImagePress: (urls: string[], index: number) => void;
  }
  