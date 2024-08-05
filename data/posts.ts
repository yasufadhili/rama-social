interface Post {
    id: string;
    user: string;
    user_image: string;
    images: string[];
    likes: number;
    comments: number;
    text?: string;
}


export const FEED_DATA: Post[] = [
    {
      id: '01',
      user: 'Yasu Fadhili',
      user_image: 'https://randomuser.me/api/portraits/men/30.jpg',
      images: ['https://picsum.photos/200/300', 'https://picsum.photos/200/301', 'https://picsum.photos/200/302'],
      likes: 100,
      comments: 50,
    },
    {
      id: '02',
      user: 'John Lenon',
      user_image: 'https://randomuser.me/api/portraits/men/20.jpg',
      images: ['https://picsum.photos/200/303'],
      likes: 200,
      comments: 75,
    },
    {
      id: '03',
      user: 'Walusimbi Paul',
      user_image: 'https://randomuser.me/api/portraits/men/40.jpg',
      images: ['https://picsum.photos/200/304', 'https://picsum.photos/200/305'],
      likes: 150,
      comments: 30,
    },
    {
      id: '04',
      user: 'Temmu Tim',
      user_image: 'https://randomuser.me/api/portraits/men/50.jpg',
      images: ['https://picsum.photos/200/306', 'https://picsum.photos/200/307', 'https://picsum.photos/200/308', 'https://picsum.photos/200/309', 'https://picsum.photos/200/310', 'https://picsum.photos/200/311'],
      likes: 250,
      comments: 90,
    },
    {
      id: '05',
      user: 'New User',
      user_image: 'https://randomuser.me/api/portraits/men/60.jpg',
      images: ['https://picsum.photos/200/312', 'https://picsum.photos/200/313', 'https://picsum.photos/200/314', 'https://picsum.photos/200/315', 'https://picsum.photos/200/316', 'https://picsum.photos/200/317', 'https://picsum.photos/200/318', 'https://picsum.photos/200/319'],
      likes: 300,
      comments: 120,
    },
    {
      id: '06',
      user: 'New User',
      user_image: 'https://randomuser.me/api/portraits/men/70.jpg',
      images: ['https://picsum.photos/200/312', 'https://picsum.photos/200/313', 'https://picsum.photos/200/314', 'https://picsum.photos/200/315', 'https://picsum.photos/200/316', 'https://picsum.photos/200/317', 'https://picsum.photos/200/318', 'https://picsum.photos/200/319'],
      likes: 300,
      comments: 120,
    },
      {
          "id": "1",
          "user": "Kibuuka Brian",
          "user_image": "https://randomuser.me/api/portraits/men/30.jpg",
          "images": [
              "https://picsum.photos/200/30",
              "https://picsum.photos/200/31",
              "https://picsum.photos/200/32",
              "https://picsum.photos/200/33",
              "https://picsum.photos/200/34"
          ],
          "likes": 62,
          "comments": 30,
          "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst."
      },
      {
          "id": "2",
          "user": "Kagwa Joseph",
          "user_image": "https://randomuser.me/api/portraits/men/20.jpg",
          "images": [],
          "likes": 142,
          "comments": 41,
          "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      },
      {
          "id": "3",
          "user": "Namuleme Janet",
          "user_image": "https://randomuser.me/api/portraits/women/40.jpg",
          "images": [
              "https://picsum.photos/200/320",
              "https://picsum.photos/200/321",
              "https://picsum.photos/200/322",
              "https://picsum.photos/200/323",
              "https://picsum.photos/200/324",
              "https://picsum.photos/200/325"
          ],
          "likes": 125,
          "comments": 77,
          "text": "Exploring the beauty of Uganda. #travel #adventure"
      },
      {
          "id": "4",
          "user": "Nalubega Mary",
          "user_image": "https://randomuser.me/api/portraits/women/20.jpg",
          "images": [
              "https://picsum.photos/200/340",
              "https://picsum.photos/200/341"
          ],
          "likes": 292,
          "comments": 86,
          "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst."
      },
      {
          "id": "5",
          "user": "Ssebagala George",
          "user_image": "https://randomuser.me/api/portraits/men/50.jpg",
          "images": [
              "https://picsum.photos/200/350",
              "https://picsum.photos/200/351",
              "https://picsum.photos/200/352"
          ],
          "likes": 67,
          "comments": 24,
          "text": ""
      },
      {
          "id": "6",
          "user": "Nakyobe Sarah",
          "user_image": "https://randomuser.me/api/portraits/women/30.jpg",
          "images": [],
          "likes": 101,
          "comments": 35,
          "text": "Exploring the beauty of Uganda. #travel #adventure"
      },
      {
          "id": "7",
          "user": "Byaruhanga Peter",
          "user_image": "https://randomuser.me/api/portraits/men/40.jpg",
          "images": [
              "https://picsum.photos/200/370",
              "https://picsum.photos/200/371",
              "https://picsum.photos/200/372"
          ],
          "likes": 231,
          "comments": 58,
          "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst."
      },
      {
          "id": "8",
          "user": "Namuleme Janet",
          "user_image": "https://randomuser.me/api/portraits/women/40.jpg",
          "images": [],
          "likes": 78,
          "comments": 19,
          "text": ""
      },
      {
          "id": "9",
          "user": "Kato Mukasa",
          "user_image": "https://randomuser.me/api/portraits/men/10.jpg",
          "images": [
              "https://picsum.photos/200/390",
              "https://picsum.photos/200/391",
              "https://picsum.photos/200/392",
              "https://picsum.photos/200/393",
              "https://picsum.photos/200/394"
          ],
          "likes": 117,
          "comments": 34,
          "text": "Exploring the beauty of Uganda. #travel #adventure"
      },
      {
          "id": "10",
          "user": "Nalwanga Rebecca",
          "user_image": "https://randomuser.me/api/portraits/women/50.jpg",
          "images": [],
          "likes": 294,
          "comments": 92,
          "text": ""
      },
      {
          "id": "11",
          "user": "Nalubega Mary",
          "user_image": "https://randomuser.me/api/portraits/women/20.jpg",
          "images": [
              "https://picsum.photos/200/410",
              "https://picsum.photos/200/411",
              "https://picsum.photos/200/412",
              "https://picsum.photos/200/413",
              "https://picsum.photos/200/414"
          ],
          "likes": 62,
          "comments": 30,
          "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst."
      },
      {
          "id": "12",
          "user": "Byaruhanga Peter",
          "user_image": "https://randomuser.me/api/portraits/men/40.jpg",
          "images": [],
          "likes": 97,
          "comments": 51,
          "text": "Exploring the beauty of Uganda. #travel #adventure"
      },
      {
          "id": "13",
          "user": "Nakyobe Sarah",
          "user_image": "https://randomuser.me/api/portraits/women/30.jpg",
          "images": [
              "https://picsum.photos/200/430",
              "https://picsum.photos/200/431",
              "https://picsum.photos/200/432",
              "https://picsum.photos/200/433"
          ],
          "likes": 81,
          "comments": 35,
          "text": ""
      },
      {
          "id": "14",
          "user": "Kato Mukasa",
          "user_image": "https://randomuser.me/api/portraits/men/10.jpg",
          "images": [
              "https://picsum.photos/200/450",
              "https://picsum.photos/200/451",
              "https://picsum.photos/200/452",
              "https://picsum.photos/200/453"
          ],
          "likes": 295,
          "comments": 94,
          "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst."
      },
      {
          "id": "15",
          "user": "Kibuuka Brian",
          "user_image": "https://randomuser.me/api/portraits/men/30.jpg",
          "images": [],
          "likes": 213,
          "comments": 54,
          "text": "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
          "id": "16",
          "user": "Namutebi Asha",
          "user_image": "https://randomuser.me/api/portraits/women/10.jpg",
          "images": [
              "https://picsum.photos/200/470",
              "https://picsum.photos/200/471",
              "https://picsum.photos/200/472"
          ],
          "likes": 57,
          "comments": 23,
          "text": "Exploring the beauty of Uganda. #travel #adventure"
      },
      {
          "id": "17",
          "user": "Byaruhanga Peter",
          "user_image": "https://randomuser.me/api/portraits/men/40.jpg",
          "images": [
              "https://picsum.photos/200/490",
              "https://picsum.photos/200/491",
              "https://picsum.photos/200/492",
              "https://picsum.photos/200/493",
              "https://picsum.photos/200/494",
              "https://picsum.photos/200/495"
          ],
          "likes": 278,
          "comments": 100,
          "text": "hello then"
      },
      {
          "id": "18",
          "user": "Ssebagala George",
          "user_image": "https://randomuser.me/api/portraits/men/50.jpg",
          "images": [],
          "likes": 326,
          "comments": 78,
          "text": ""
      },
      {
          "id": "19",
          "user": "Namutebi Asha",
          "user_image": "https://randomuser.me/api/portraits/women/10.jpg",
          "images": [
              "https://picsum.photos/200/518",
              "https://picsum.photos/200/519",
              "https://picsum.photos/200/520"
          ],
          "likes": 192,
          "comments": 83,
          "text": "Exploring the beauty of Uganda. #travel #adventure"
      },
      {
          "id": "20",
          "user": "Namutebi Asha",
          "user_image": "https://randomuser.me/api/portraits/women/10.jpg",
          "images": [
              "https://picsum.photos/200/540",
              "https://picsum.photos/200/541",
              "https://picsum.photos/200/542",
              "https://picsum.photos/200/543",
              "https://picsum.photos/200/544"
          ],
          "likes": 292,
          "comments": 96,
          "text": ""
        }
  ];
