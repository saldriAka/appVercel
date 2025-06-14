"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PageTransition } from "@/components/page-transition"
import { QuestionCard } from "@/components/question-card"

const generateQuestions = () => {
  const questions = []
  for (let i = 1; i <= 100; i++) {
    questions.push({
      id: i,
      question: `Question ${i}: Lorem ipsum dolor sit amet, consectetur adipiscing elit?`,
      options: [
        { id: "a", text: "Option A" },
        { id: "b", text: "Option B" },
        { id: "c", text: "Option C" },
        { id: "d", text: "Option D" },
      ],
      correctAnswer: "a",
    })
  }
  return questions
}

const allQuestions = generateQuestions()

export default function ExamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams()
  const searchParams = useSearchParams()

  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate page number and answers from client
  useEffect(() => {
    const pageParam = params?.page
    const parsedPage = Number.parseInt(Array.isArray(pageParam) ? pageParam[0] : pageParam || "1")

    if (isNaN(parsedPage) || parsedPage < 1 || parsedPage > 10) {
      router.replace("/exam/1")
      setCurrentPage(1)
    } else {
      setCurrentPage(parsedPage)
    }

    const savedAnswers = localStorage.getItem("examAnswers")
    setAnswers(savedAnswers ? JSON.parse(savedAnswers) : {})

    setHydrated(true)
  }, [params?.page, router])

  // Save to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("examAnswers", JSON.stringify(answers))
    }
  }, [answers, hydrated])

  if (!hydrated) return null // Prevent hydration mismatch

  const startIndex = (currentPage - 1) * 10
  const pageQuestions = allQuestions.slice(startIndex, startIndex + 10)

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / 100) * 100

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  const direction = (searchParams.get("direction") as "left" | "right") || "right"

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      router.push(`/exam/${currentPage - 1}?direction=left`)
    }
  }

  const goToNextPage = () => {
    const unanswered = pageQuestions.filter((q) => !answers[q.id])
    if (unanswered.length > 0) {
      toast({
        title: "Incomplete answers",
        description: "Please answer all questions before proceeding.",
        variant: "destructive",
      })
      return
    }

    if (currentPage < 10) {
      router.push(`/exam/${currentPage + 1}?direction=right`)
    } else {
      router.push("/exam/result")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Online Exam</h1>
        <div className="flex items-center gap-4 mb-2">
          <span className="text-sm font-medium">Progress: {answeredCount}/100 questions answered</span>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => router.push(`/exam/${page}?direction=${page > currentPage ? "right" : "left"}`)}
              className="w-10 h-10"
            >
              {page}
            </Button>
          ))}
        </div>
      </div>

      <PageTransition direction={direction}>
        <div className="space-y-6">
          {pageQuestions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              selectedAnswer={answers[question.id] || ""}
              onAnswerSelect={handleAnswerSelect}
              index={index}
            />
          ))}
        </div>
      </PageTransition>

      <div className="mt-8 flex justify-between">
        <Button onClick={goToPreviousPage} disabled={currentPage === 1} variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={goToNextPage}>
          {currentPage === 10 ? "Submit Exam" : "Next"}
          {currentPage !== 10 && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
