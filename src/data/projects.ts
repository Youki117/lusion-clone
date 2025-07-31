export interface Project {
  id: string
  title: string
  category: string
  description: string
  image: string
  href: string
  tags: string[]
}

export const projects: Project[] = [
  {
    id: 'devin-ai',
    title: 'Devin AI',
    category: 'web • design • development • 3d',
    description: 'An innovative AI-powered development platform that revolutionizes how we build software. Created with cutting-edge 3D interfaces and seamless user experiences.',
    image: 'https://via.placeholder.com/800x600/667eea/ffffff?text=Devin+AI',
    href: '/projects/devin-ai',
    tags: ['AI', 'Web Development', '3D Design', 'Innovation']
  },
  {
    id: 'porsche-dream-machine',
    title: 'Porsche: Dream Machine',
    category: 'concept • 3D illustration • mograph • video',
    description: 'A visually stunning concept project showcasing the future of automotive design through immersive 3D illustrations and motion graphics.',
    image: 'https://via.placeholder.com/800x600/764ba2/ffffff?text=Porsche+Dream',
    href: '/projects/porsche-dream-machine',
    tags: ['Automotive', '3D Illustration', 'Motion Graphics', 'Concept']
  },
  {
    id: 'synthetic-human',
    title: 'Synthetic Human',
    category: 'web • design • development • 3d',
    description: 'Exploring the boundaries between human and artificial intelligence through interactive web experiences and advanced 3D visualization.',
    image: 'https://via.placeholder.com/800x600/4f46e5/ffffff?text=Synthetic+Human',
    href: '/projects/synthetic-human',
    tags: ['AI', 'Human Interface', '3D Visualization', 'Interactive']
  },
  {
    id: 'spatial-fusion',
    title: 'Meta: Spatial Fusion',
    category: 'web • design • development • 3d',
    description: 'A groundbreaking spatial computing experience that merges physical and digital worlds through innovative web technologies.',
    image: 'https://via.placeholder.com/800x600/06b6d4/ffffff?text=Meta+Spatial',
    href: '/projects/spatial-fusion',
    tags: ['Meta', 'Spatial Computing', 'AR/VR', 'Web Technology']
  },
  {
    id: 'spaace-nft',
    title: 'Spaace - NFT Marketplace',
    category: 'web • design • development • 3d • web3',
    description: 'A next-generation NFT marketplace with immersive 3D galleries and seamless Web3 integration for digital art collectors.',
    image: 'https://via.placeholder.com/800x600/8b5cf6/ffffff?text=Spaace+NFT',
    href: '/projects/spaace-nft',
    tags: ['NFT', 'Web3', 'Blockchain', '3D Gallery']
  },
  {
    id: 'ddd-2024',
    title: 'DDD 2024',
    category: 'web • design • development • 3d',
    description: 'The official website for Design, Develop, Deploy 2024 conference, featuring interactive 3D elements and modern web design.',
    image: 'https://via.placeholder.com/800x600/f59e0b/ffffff?text=DDD+2024',
    href: '/projects/ddd-2024',
    tags: ['Conference', 'Event Design', '3D Elements', 'Modern Web']
  },
  {
    id: 'choo-choo-world',
    title: 'Choo Choo World',
    category: 'concept • web • game design • 3d',
    description: 'An enchanting interactive world where imagination meets technology, featuring playful game mechanics and delightful 3D environments.',
    image: 'https://via.placeholder.com/800x600/10b981/ffffff?text=Choo+Choo',
    href: '/projects/choo-choo-world',
    tags: ['Game Design', 'Interactive', '3D World', 'Playful']
  },
  {
    id: 'soda-experience',
    title: 'Soda Experience',
    category: 'AR • development • 3d',
    description: 'An augmented reality experience that brings beverage brands to life through immersive AR technology and 3D interactions.',
    image: 'https://via.placeholder.com/800x600/ef4444/ffffff?text=Soda+AR',
    href: '/projects/soda-experience',
    tags: ['Augmented Reality', 'Brand Experience', '3D Interaction', 'Mobile']
  }
]
