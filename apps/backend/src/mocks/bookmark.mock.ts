const userId = '68132ee40d897d85ab29cca4';

const mockBookmarks = [
  {
    user: userId,
    url: 'https://www.google.com',
    icon: 'https://www.google.com/favicon.ico',
    title: 'Google',
    description: "The world's information at your fingertips",
    visitCount: 0,
    screenshotUrl: 'https://example.com/screenshots/google.png',
    lastVisitedAt: null,
    categories: [
      {
        name: '搜索工具',
        user: userId,
        icon: '',
      },
      {
        name: '搜索工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '搜索工具',
        user: userId,
        color: '#333',
      },
    ],
  },
  {
    user: userId,
    url: 'https://github.com',
    icon: 'https://github.com/favicon.ico',
    title: 'GitHub',
    description: 'GitHub is where people build software.',
    visitCount: 12,
    screenshotUrl: 'https://example.com/screenshots/github.png',
    lastVisitedAt: '2025-05-01T10:23:45Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '代码',
        user: userId,
        color: '#6e5494',
      },
      {
        name: '开源',
        user: userId,
        color: '#24292e',
      },
    ],
  },
  {
    user: userId,
    url: 'https://stackoverflow.com',
    icon: 'https://stackoverflow.com/favicon.ico',
    title: 'Stack Overflow',
    description: 'Where developers learn, share, & build careers.',
    visitCount: 8,
    screenshotUrl: 'https://example.com/screenshots/stackoverflow.png',
    lastVisitedAt: '2025-05-02T14:15:20Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '问答',
        user: userId,
        color: '#f48024',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.amazon.com',
    icon: 'https://www.amazon.com/favicon.ico',
    title: 'Amazon',
    description: "Online shopping from the earth's biggest selection.",
    visitCount: 5,
    screenshotUrl: 'https://example.com/screenshots/amazon.png',
    lastVisitedAt: '2025-05-03T09:10:15Z',
    categories: [
      {
        name: '购物',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '电商',
        user: userId,
        color: '#ff9900',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.netflix.com',
    icon: 'https://www.netflix.com/favicon.ico',
    title: 'Netflix',
    description: 'Watch TV shows and movies anytime, anywhere.',
    visitCount: 7,
    screenshotUrl: 'https://example.com/screenshots/netflix.png',
    lastVisitedAt: '2025-05-04T20:30:00Z',
    categories: [
      {
        name: '娱乐',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '视频',
        user: userId,
        color: '#e50914',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.facebook.com',
    icon: 'https://www.facebook.com/favicon.ico',
    title: 'Facebook',
    description: 'Connect with friends, family and other people you know.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/facebook.png',
    lastVisitedAt: '2025-05-01T18:45:22Z',
    categories: [
      {
        name: '社交媒体',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '社交',
        user: userId,
        color: '#1877f2',
      },
    ],
  },
  {
    user: userId,
    url: 'https://twitter.com',
    icon: 'https://twitter.com/favicon.ico',
    title: 'Twitter',
    description: `See what's happening in the world right now.`,
    visitCount: 9,
    screenshotUrl: 'https://example.com/screenshots/twitter.png',
    lastVisitedAt: '2025-05-05T07:12:33Z',
    categories: [
      {
        name: '社交媒体',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '社交',
        user: userId,
        color: '#1da1f2',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.linkedin.com',
    icon: 'https://www.linkedin.com/favicon.ico',
    title: 'LinkedIn',
    description: 'Manage your professional identity and build your network.',
    visitCount: 2,
    screenshotUrl: 'https://example.com/screenshots/linkedin.png',
    lastVisitedAt: '2025-04-28T11:20:45Z',
    categories: [
      {
        name: '社交媒体',
        user: userId,
        icon: '',
      },
      {
        name: '职业发展',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '职场',
        user: userId,
        color: '#0a66c2',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.reddit.com',
    icon: 'https://www.reddit.com/favicon.ico',
    title: 'Reddit',
    description: 'The front page of the internet.',
    visitCount: 6,
    screenshotUrl: 'https://example.com/screenshots/reddit.png',
    lastVisitedAt: '2025-05-04T16:30:10Z',
    categories: [
      {
        name: '社交媒体',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '论坛',
        user: userId,
        color: '#ff4500',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.wikipedia.org',
    icon: 'https://www.wikipedia.org/favicon.ico',
    title: 'Wikipedia',
    description: 'The free encyclopedia that anyone can edit.',
    visitCount: 4,
    screenshotUrl: 'https://example.com/screenshots/wikipedia.png',
    lastVisitedAt: '2025-05-02T09:45:30Z',
    categories: [
      {
        name: '知识',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '百科',
        user: userId,
        color: '#000000',
      },
    ],
  },
  {
    user: userId,
    url: 'https://medium.com',
    icon: 'https://medium.com/favicon.ico',
    title: 'Medium',
    description: 'Where good ideas find you.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/medium.png',
    lastVisitedAt: '2025-05-01T14:25:18Z',
    categories: [
      {
        name: '博客',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '阅读',
        user: userId,
        color: '#000000',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.nytimes.com',
    icon: 'https://www.nytimes.com/favicon.ico',
    title: 'The New York Times',
    description: 'Breaking news, world news & multimedia.',
    visitCount: 1,
    screenshotUrl: 'https://example.com/screenshots/nytimes.png',
    lastVisitedAt: '2025-04-30T08:15:40Z',
    categories: [
      {
        name: '新闻',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '时事',
        user: userId,
        color: '#000000',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.bbc.com',
    icon: 'https://www.bbc.com/favicon.ico',
    title: 'BBC',
    description: 'Breaking news, sport, TV, radio and a whole lot more.',
    visitCount: 2,
    screenshotUrl: 'https://example.com/screenshots/bbc.png',
    lastVisitedAt: '2025-05-03T07:30:25Z',
    categories: [
      {
        name: '新闻',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '国际',
        user: userId,
        color: '#bb1919',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.cnn.com',
    icon: 'https://www.cnn.com/favicon.ico',
    title: 'CNN',
    description: 'Breaking News, Latest News and Videos.',
    visitCount: 1,
    screenshotUrl: 'https://example.com/screenshots/cnn.png',
    lastVisitedAt: '2025-05-02T19:10:05Z',
    categories: [
      {
        name: '新闻',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '时事',
        user: userId,
        color: '#cc0000',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.instagram.com',
    icon: 'https://www.instagram.com/favicon.ico',
    title: 'Instagram',
    description: 'Create and share photos, stories, reels, videos, messages.',
    visitCount: 8,
    screenshotUrl: 'https://example.com/screenshots/instagram.png',
    lastVisitedAt: '2025-05-05T12:40:15Z',
    categories: [
      {
        name: '社交媒体',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '照片',
        user: userId,
        color: '#c13584',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.pinterest.com',
    icon: 'https://www.pinterest.com/favicon.ico',
    title: 'Pinterest',
    description: 'Discover recipes, home ideas, style inspiration and more.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/pinterest.png',
    lastVisitedAt: '2025-04-29T15:20:35Z',
    categories: [
      {
        name: '社交媒体',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '创意',
        user: userId,
        color: '#e60023',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.twitch.tv',
    icon: 'https://www.twitch.tv/favicon.ico',
    title: 'Twitch',
    description: 'Interactive livestreaming service for gaming, entertainment, sports, music, and more.',
    visitCount: 5,
    screenshotUrl: 'https://example.com/screenshots/twitch.png',
    lastVisitedAt: '2025-05-04T21:15:30Z',
    categories: [
      {
        name: '娱乐',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '游戏',
        user: userId,
        color: '#9146ff',
      },
      {
        name: '直播',
        user: userId,
        color: '#6441a5',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.spotify.com',
    icon: 'https://www.spotify.com/favicon.ico',
    title: 'Spotify',
    description: 'Music for everyone.',
    visitCount: 7,
    screenshotUrl: 'https://example.com/screenshots/spotify.png',
    lastVisitedAt: '2025-05-05T08:45:20Z',
    categories: [
      {
        name: '音乐',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '音乐流媒体',
        user: userId,
        color: '#1db954',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.apple.com',
    icon: 'https://www.apple.com/favicon.ico',
    title: 'Apple',
    description: 'Discover the innovative world of Apple products.',
    visitCount: 2,
    screenshotUrl: 'https://example.com/screenshots/apple.png',
    lastVisitedAt: '2025-05-01T13:10:45Z',
    categories: [
      {
        name: '科技',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '硬件',
        user: userId,
        color: '#555555',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.microsoft.com',
    icon: 'https://www.microsoft.com/favicon.ico',
    title: 'Microsoft',
    description: 'Software, devices, solutions for businesses and consumers.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/microsoft.png',
    lastVisitedAt: '2025-04-30T10:25:15Z',
    categories: [
      {
        name: '科技',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '软件',
        user: userId,
        color: '#00a4ef',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.airbnb.com',
    icon: 'https://www.airbnb.com/favicon.ico',
    title: 'Airbnb',
    description: 'Vacation rentals, cabins, beach houses, unique homes and experiences.',
    visitCount: 1,
    screenshotUrl: 'https://example.com/screenshots/airbnb.png',
    lastVisitedAt: '2025-04-28T16:40:30Z',
    categories: [
      {
        name: '旅行',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '住宿',
        user: userId,
        color: '#ff5a5f',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.booking.com',
    icon: 'https://www.booking.com/favicon.ico',
    title: 'Booking.com',
    description: 'Hotels, homes, and everything in between.',
    visitCount: 1,
    screenshotUrl: 'https://example.com/screenshots/booking.png',
    lastVisitedAt: '2025-04-29T09:20:10Z',
    categories: [
      {
        name: '旅行',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '酒店',
        user: userId,
        color: '#003580',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.udemy.com',
    icon: 'https://www.udemy.com/favicon.ico',
    title: 'Udemy',
    description: 'Online courses - Learn anything, on your schedule.',
    visitCount: 4,
    screenshotUrl: 'https://example.com/screenshots/udemy.png',
    lastVisitedAt: '2025-05-03T14:15:25Z',
    categories: [
      {
        name: '教育',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '在线课程',
        user: userId,
        color: '#a435f0',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.coursera.org',
    icon: 'https://www.coursera.org/favicon.ico',
    title: 'Coursera',
    description: 'Build skills with courses, certificates, and degrees online.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/coursera.png',
    lastVisitedAt: '2025-05-02T11:30:40Z',
    categories: [
      {
        name: '教育',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '在线课程',
        user: userId,
        color: '#0056d2',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.notion.so',
    icon: 'https://www.notion.so/favicon.ico',
    title: 'Notion',
    description: 'One workspace. Every team. All your work in one place.',
    visitCount: 10,
    screenshotUrl: 'https://example.com/screenshots/notion.png',
    lastVisitedAt: '2025-05-05T09:10:15Z',
    categories: [
      {
        name: '生产力',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '笔记',
        user: userId,
        color: '#000000',
      },
      {
        name: '协作',
        user: userId,
        color: '#333333',
      },
    ],
  },
  {
    user: userId,
    url: 'https://trello.com',
    icon: 'https://trello.com/favicon.ico',
    title: 'Trello',
    description: "Manage your team's projects from anywhere.",
    visitCount: 6,
    screenshotUrl: 'https://example.com/screenshots/trello.png',
    lastVisitedAt: '2025-05-04T13:45:30Z',
    categories: [
      {
        name: '生产力',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '项目管理',
        user: userId,
        color: '#0079bf',
      },
    ],
  },
  {
    user: userId,
    url: 'https://slack.com',
    icon: 'https://slack.com/favicon.ico',
    title: 'Slack',
    description: 'Where work happens.',
    visitCount: 15,
    screenshotUrl: 'https://example.com/screenshots/slack.png',
    lastVisitedAt: '2025-05-05T11:20:40Z',
    categories: [
      {
        name: '生产力',
        user: userId,
        icon: '',
      },
      {
        name: '协作工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '沟通',
        user: userId,
        color: '#4a154b',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.figma.com',
    icon: 'https://www.figma.com/favicon.ico',
    title: 'Figma',
    description: 'The collaborative interface design tool.',
    visitCount: 8,
    screenshotUrl: 'https://example.com/screenshots/figma.png',
    lastVisitedAt: '2025-05-03T16:30:20Z',
    categories: [
      {
        name: '设计',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: 'UI设计',
        user: userId,
        color: '#0acf83',
      },
      {
        name: '协作',
        user: userId,
        color: '#1abcfe',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.canva.com',
    icon: 'https://www.canva.com/favicon.ico',
    title: 'Canva',
    description: 'Design anything, publish anywhere.',
    visitCount: 4,
    screenshotUrl: 'https://example.com/screenshots/canva.png',
    lastVisitedAt: '2025-05-01T15:40:25Z',
    categories: [
      {
        name: '设计',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '图形设计',
        user: userId,
        color: '#00c4cc',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.dropbox.com',
    icon: 'https://www.dropbox.com/favicon.ico',
    title: 'Dropbox',
    description: 'Store, share, and access your files from anywhere.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/dropbox.png',
    lastVisitedAt: '2025-04-30T14:15:35Z',
    categories: [
      {
        name: '云存储',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '文件共享',
        user: userId,
        color: '#0061ff',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.drive.google.com',
    icon: 'https://www.drive.google.com/favicon.ico',
    title: 'Google Drive',
    description: 'Store files online and access them from any device.',
    visitCount: 7,
    screenshotUrl: 'https://example.com/screenshots/gdrive.png',
    lastVisitedAt: '2025-05-04T10:25:15Z',
    categories: [
      {
        name: '云存储',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '文件共享',
        user: userId,
        color: '#4285f4',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.paypal.com',
    icon: 'https://www.paypal.com/favicon.ico',
    title: 'PayPal',
    description: 'The safer, easier way to pay online.',
    visitCount: 2,
    screenshotUrl: 'https://example.com/screenshots/paypal.png',
    lastVisitedAt: '2025-04-29T11:40:30Z',
    categories: [
      {
        name: '金融',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '支付',
        user: userId,
        color: '#003087',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.stripe.com',
    icon: 'https://www.stripe.com/favicon.ico',
    title: 'Stripe',
    description: 'Online payment processing for internet businesses.',
    visitCount: 1,
    screenshotUrl: 'https://example.com/screenshots/stripe.png',
    lastVisitedAt: '2025-04-28T13:20:45Z',
    categories: [
      {
        name: '金融',
        user: userId,
        icon: '',
      },
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '支付API',
        user: userId,
        color: '#635bff',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.wordpress.org',
    icon: 'https://www.wordpress.org/favicon.ico',
    title: 'WordPress',
    description: 'Free and open-source content management system.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/wordpress.png',
    lastVisitedAt: '2025-05-02T16:15:25Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: 'CMS',
        user: userId,
        color: '#21759b',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.shopify.com',
    icon: 'https://www.shopify.com/favicon.ico',
    title: 'Shopify',
    description: 'Build your business with Shopify, the commerce platform.',
    visitCount: 1,
    screenshotUrl: 'https://example.com/screenshots/shopify.png',
    lastVisitedAt: '2025-04-30T09:35:50Z',
    categories: [
      {
        name: '电商',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '网店',
        user: userId,
        color: '#96bf48',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.wix.com',
    icon: 'https://www.wix.com/favicon.ico',
    title: 'Wix',
    description: 'Create a website with the Wix website builder.',
    visitCount: 1,
    screenshotUrl: 'https://example.com/screenshots/wix.png',
    lastVisitedAt: '2025-04-29T14:25:10Z',
    categories: [
      {
        name: '网站建设',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '建站工具',
        user: userId,
        color: '#faad4d',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.squarespace.com',
    icon: 'https://www.squarespace.com/favicon.ico',
    title: 'Squarespace',
    description: 'Build a website, sell online, and manage a brand.',
    visitCount: 0,
    screenshotUrl: 'https://example.com/screenshots/squarespace.png',
    lastVisitedAt: null,
    categories: [
      {
        name: '网站建设',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '建站工具',
        user: userId,
        color: '#000000',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.digitalocean.com',
    icon: 'https://www.digitalocean.com/favicon.ico',
    title: 'DigitalOcean',
    description: 'The developer cloud. Deploy, manage, and scale cloud applications.',
    visitCount: 5,
    screenshotUrl: 'https://example.com/screenshots/digitalocean.png',
    lastVisitedAt: '2025-05-03T11:10:40Z',
    categories: [
      {
        name: '云服务',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '服务器',
        user: userId,
        color: '#0080ff',
      },
      {
        name: '开发',
        user: userId,
        color: '#0069ff',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.aws.amazon.com',
    icon: 'https://www.aws.amazon.com/favicon.ico',
    title: 'Amazon Web Services',
    description: 'Cloud computing services for businesses and developers.',
    visitCount: 6,
    screenshotUrl: 'https://example.com/screenshots/aws.png',
    lastVisitedAt: '2025-05-04T15:30:20Z',
    categories: [
      {
        name: '云服务',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '云计算',
        user: userId,
        color: '#ff9900',
      },
      {
        name: '服务器',
        user: userId,
        color: '#232f3e',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.azure.microsoft.com',
    icon: 'https://www.azure.microsoft.com/favicon.ico',
    title: 'Microsoft Azure',
    description: 'Cloud computing service for building, testing, deploying, and managing applications.',
    visitCount: 4,
    screenshotUrl: 'https://example.com/screenshots/azure.png',
    lastVisitedAt: '2025-05-02T13:45:35Z',
    categories: [
      {
        name: '云服务',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '云计算',
        user: userId,
        color: '#0078d4',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.cloudflare.com',
    icon: 'https://www.cloudflare.com/favicon.ico',
    title: 'Cloudflare',
    description: 'The Web Performance & Security Company.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/cloudflare.png',
    lastVisitedAt: '2025-05-01T16:20:15Z',
    categories: [
      {
        name: '网络安全',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: 'CDN',
        user: userId,
        color: '#f48120',
      },
      {
        name: '安全',
        user: userId,
        color: '#404041',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.vercel.com',
    icon: 'https://www.vercel.com/favicon.ico',
    title: 'Vercel',
    description: 'Develop. Preview. Ship.',
    visitCount: 8,
    screenshotUrl: 'https://example.com/screenshots/vercel.png',
    lastVisitedAt: '2025-05-05T10:15:30Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '部署',
        user: userId,
        color: '#000000',
      },
      {
        name: '前端',
        user: userId,
        color: '#333333',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.netlify.com',
    icon: 'https://www.netlify.com/favicon.ico',
    title: 'Netlify',
    description: 'Develop and deploy the best web experiences in record time.',
    visitCount: 5,
    screenshotUrl: 'https://example.com/screenshots/netlify.png',
    lastVisitedAt: '2025-05-03T09:40:25Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '部署',
        user: userId,
        color: '#00c7b7',
      },
      {
        name: '前端',
        user: userId,
        color: '#4d9abf',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.heroku.com',
    icon: 'https://www.heroku.com/favicon.ico',
    title: 'Heroku',
    description: 'Cloud platform that lets companies build, deliver, monitor and scale apps.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/heroku.png',
    lastVisitedAt: '2025-04-30T11:35:45Z',
    categories: [
      {
        name: '云服务',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: 'PaaS',
        user: userId,
        color: '#430098',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.mongodb.com',
    icon: 'https://www.mongodb.com/favicon.ico',
    title: 'MongoDB',
    description: 'The database for modern applications.',
    visitCount: 4,
    screenshotUrl: 'https://example.com/screenshots/mongodb.png',
    lastVisitedAt: '2025-05-02T10:20:30Z',
    categories: [
      {
        name: '数据库',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: 'NoSQL',
        user: userId,
        color: '#13aa52',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.postgresql.org',
    icon: 'https://www.postgresql.org/favicon.ico',
    title: 'PostgreSQL',
    description: "The world's most advanced open source database.",
    visitCount: 7,
    screenshotUrl: 'https://example.com/screenshots/postgresql.png',
    lastVisitedAt: '2025-05-04T14:25:10Z',
    categories: [
      {
        name: '数据库',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '关系型数据库',
        user: userId,
        color: '#336791',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.mysql.com',
    icon: 'https://www.mysql.com/favicon.ico',
    title: 'MySQL',
    description: "The world's most popular open source database.",
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/mysql.png',
    lastVisitedAt: '2025-05-01T11:15:40Z',
    categories: [
      {
        name: '数据库',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '关系型数据库',
        user: userId,
        color: '#00758f',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.redis.io',
    icon: 'https://www.redis.io/favicon.ico',
    title: 'Redis',
    description: 'Open source in-memory data structure store.',
    visitCount: 5,
    screenshotUrl: 'https://example.com/screenshots/redis.png',
    lastVisitedAt: '2025-05-03T13:30:20Z',
    categories: [
      {
        name: '数据库',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '缓存',
        user: userId,
        color: '#dc382d',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.docker.com',
    icon: 'https://www.docker.com/favicon.ico',
    title: 'Docker',
    description: 'Empowering App Development for Developers.',
    visitCount: 9,
    screenshotUrl: 'https://example.com/screenshots/docker.png',
    lastVisitedAt: '2025-05-05T09:45:15Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '容器化',
        user: userId,
        color: '#2496ed',
      },
      {
        name: 'DevOps',
        user: userId,
        color: '#0db7ed',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.kubernetes.io',
    icon: 'https://www.kubernetes.io/favicon.ico',
    title: 'Kubernetes',
    description: 'Production-Grade Container Orchestration.',
    visitCount: 4,
    screenshotUrl: 'https://example.com/screenshots/kubernetes.png',
    lastVisitedAt: '2025-05-02T15:10:35Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '容器编排',
        user: userId,
        color: '#326ce5',
      },
      {
        name: 'DevOps',
        user: userId,
        color: '#3371e3',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.jenkins.io',
    icon: 'https://www.jenkins.io/favicon.ico',
    title: 'Jenkins',
    description: 'Build great things at any scale.',
    visitCount: 2,
    screenshotUrl: 'https://example.com/screenshots/jenkins.png',
    lastVisitedAt: '2025-04-29T13:25:50Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: 'CI/CD',
        user: userId,
        color: '#d33833',
      },
      {
        name: 'DevOps',
        user: userId,
        color: '#335061',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.gitlab.com',
    icon: 'https://www.gitlab.com/favicon.ico',
    title: 'GitLab',
    description: 'The complete DevOps platform.',
    visitCount: 6,
    screenshotUrl: 'https://example.com/screenshots/gitlab.png',
    lastVisitedAt: '2025-05-04T11:40:25Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '代码仓库',
        user: userId,
        color: '#fc6d26',
      },
      {
        name: 'DevOps',
        user: userId,
        color: '#e24329',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.bitbucket.org',
    icon: 'https://www.bitbucket.org/favicon.ico',
    title: 'Bitbucket',
    description: 'Code, test, and deploy with free private repositories.',
    visitCount: 3,
    screenshotUrl: 'https://example.com/screenshots/bitbucket.png',
    lastVisitedAt: '2025-05-01T14:35:20Z',
    categories: [
      {
        name: '开发工具',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '代码仓库',
        user: userId,
        color: '#0052cc',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.jira.com',
    icon: 'https://www.jira.com/favicon.ico',
    title: 'Jira',
    description: 'Issue & project tracking software.',
    visitCount: 10,
    screenshotUrl: 'https://example.com/screenshots/jira.png',
    lastVisitedAt: '2025-05-05T13:20:45Z',
    categories: [
      {
        name: '生产力',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '项目管理',
        user: userId,
        color: '#0052cc',
      },
      {
        name: '敏捷',
        user: userId,
        color: '#172b4d',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.asana.com',
    icon: 'https://www.asana.com/favicon.ico',
    title: 'Asana',
    description: 'Work on big ideas, without the busywork.',
    visitCount: 4,
    screenshotUrl: 'https://example.com/screenshots/asana.png',
    lastVisitedAt: '2025-05-03T10:15:30Z',
    categories: [
      {
        name: '生产力',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '项目管理',
        user: userId,
        color: '#fc636b',
      },
    ],
  },
  {
    user: userId,
    url: 'https://www.monday.com',
    icon: 'https://www.monday.com/favicon.ico',
    title: 'Monday.com',
    description: 'Work without limits.',
    visitCount: 2,
    screenshotUrl: 'https://example.com/screenshots/monday.png',
    lastVisitedAt: '2025-04-30T15:40:20Z',
    categories: [
      {
        name: '生产力',
        user: userId,
        icon: '',
      },
    ],
    tags: [
      {
        name: '项目管理',
        user: userId,
        color: '#ff3d57',
      },
    ],
  },
];

export default mockBookmarks;
