"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

// Mock data for 100 questions (same as in the exam page)
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
      correctAnswer: "a", // For demonstration purposes
    })
  }
  return questions
}

const allQuestions = generateQuestions()

export default function ResultPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Load answers from localStorage
    const savedAnswers = localStorage.getItem("examAnswers")
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers)
      setAnswers(parsedAnswers)

      // Calculate score
      let correctCount = 0
      allQuestions.forEach((question) => {
        if (parsedAnswers[question.id] === question.correctAnswer) {
          correctCount++
        }
      })
      setScore(correctCount)
    } else {
      // If no answers found, redirect to first page
      router.push("/exam/1")
    }
  }, [router])

  const handleRetakeExam = () => {
    // Clear saved answers
    localStorage.removeItem("examAnswers")
    router.push("/exam/1")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Exam Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-4xl font-bold">{score} / 100</p>
              <p className="text-muted-foreground mt-1">
                {score >= 70 ? "Congratulations! You passed." : "You did not pass. Please try again."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Score</span>
                <span>{score}%</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>

            <div className="pt-4 space-y-4">
              <h3 className="font-medium">Summary:</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">100</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Answered</p>
                  <p className="text-2xl font-bold">{Object.keys(answers).length}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Correct</p>
                  <p className="text-2xl font-bold">{score}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                  <p className="text-2xl font-bold">{Object.keys(answers).length - score}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={handleRetakeExam}>Retake Exam</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
