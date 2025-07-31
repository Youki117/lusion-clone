'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import { ArrowRight, BookOpen, Zap } from 'lucide-react'
import { SubjectCard } from '@/components/ui/SubjectCard'
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
        {/* Section Header */}
        <div ref={titleRef} className="mb-16 md:mb-20">
          <div className="flex items-center space-x-3 mb-6">
            <BookOpen className="w-8 h-8 text-blue-400" />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-white drop-shadow-lg">
              学科知识图谱
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-200 max-w-4xl">
            探索各学科的知识结构，通过AI智能辅导和3D可视化，
            让学习变得更加直观高效。选择你感兴趣的学科开始学习之旅。
          </p>

          {/* 统计信息 */}
          <div className="flex items-center space-x-8 mt-6 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>{getAvailableSubjects().length} 个学科可用</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>{subjects.reduce((total, subject) => total + subject.knowledgePoints, 0)} 个知识点</span>
            </div>
          </div>
        </div>

        {/* 学科网格 - 响应式布局 */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-16">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              index={index}
            />
          ))}
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
