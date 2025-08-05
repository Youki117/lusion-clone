'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ArrowRight, BookOpen, Zap } from 'lucide-react'
import { ModernSubjectGrid } from '@/components/ui/ModernSubjectGrid'
import { ModernSectionHeader } from '@/components/ui/ModernSectionHeader'
import { subjects, getAvailableSubjects } from '@/data/subjects'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function FeaturedWork() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          {
            y: 60,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        )
      }

      // Subject cards animation
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.subject-card')

        if (cards.length > 0) {
          gsap.fromTo(cards,
            {
              y: 100,
              opacity: 0
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.15,
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
              }
            }
          )
        }
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-transparent"
    >
      <div className="container mx-auto px-6">
        {/* 现代化页面标题 */}
        <div ref={titleRef}>
          <ModernSectionHeader
            title="学科知识图谱"
            subtitle="探索各学科的知识结构，通过AI智能辅导和3D可视化，让学习变得更加直观高效。选择你感兴趣的学科开始学习之旅。"
            icon={<BookOpen className="w-8 h-8 text-blue-400" />}
            stats={[
              {
                icon: <Zap className="w-4 h-4" />,
                label: '个学科可用',
                value: getAvailableSubjects().length,
                color: '#fbbf24'
              },
              {
                icon: <BookOpen className="w-4 h-4" />,
                label: '个知识点',
                value: subjects.reduce((total, subject) => total + subject.knowledgePoints, 0),
                color: '#3b82f6'
              }
            ]}
          />
        </div>

        {/* 现代化学科网格 */}
        <div ref={gridRef} className="mb-16">
          <ModernSubjectGrid />
        </div>

        {/* 进入学习平台链接 */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <Link
            href="/education"
            className="inline-flex items-center space-x-3 text-lg font-medium text-white hover:text-gray-200 transition-colors duration-200 group"
          >
            <span>进入AI学习平台</span>
            <ArrowRight
              size={20}
              className="transform group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
