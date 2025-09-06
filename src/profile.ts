export type Social = {
  label: string
  href: string
}

export type Project = {
  name: string
  description: string
  tags: string[]
  link?: string
}

export const profile = {
  emoji: '👋',
  name: '조재혁',
  title: '안녕하세요, 조재혁입니다.',
  tagline:
    '7년차 안드로이드 개발자입니다.',
  about:
    '간단한 자기 소개를 여기에 적어주세요. 관심사, 경험, 목표 등을 자유롭게 적을 수 있어요.',
  skills: [
    'Kotlin',
    'Java',
    'Android SDK',
    'Jetpack',
    'Jetpack Compose',
    'Circuit',
    'MVVM',
    'Coroutines',
    'Flow',
    'Hilt (DI)',
    'Koin (DI)',
    'Retrofit / OkHttp',
    'Room',
    'Firebase',
    'Gradle',
    'CI/CD',
    'Unit/UI Test'
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/yourname' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yourname' },
    { label: 'Blog', href: 'https://yourblog.example.com' }
  ] as Social[],
  projects: [
    {
      name: 'Awesome App',
      description: '멋진 앱의 간단한 설명. 어떤 문제를 해결하는지 등을 적어주세요.',
      tags: ['TypeScript', 'Vite'],
      link: 'https://github.com/yourname/awesome-app'
    },
    {
      name: 'Another Project',
      description: '두 번째 프로젝트 설명. 배운 점이나 사용 기술 등을 덧붙여도 좋아요.',
      tags: ['Node.js', 'Docker']
    }
  ] as Project[],
  contact: {
    email: 'ro0opf@naver.com',
    location: ''
  }
}
