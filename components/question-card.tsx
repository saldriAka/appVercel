"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

interface QuestionCardProps {
  question: {
    id: number
    question: string
    options: { id: string; text: string }[]
  }
  selectedAnswer: string
  onAnswerSelect: (questionId: number, optionId: string) => void
  index: number
}

export function QuestionCard({ question, selectedAnswer, onAnswerSelect, index }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{question.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedAnswer || ""} onValueChange={(value) => onAnswerSelect(question.id, value)}>
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option.id} id={`q${question.id}-${option.id}`} />
                <Label htmlFor={`q${question.id}-${option.id}`} className="cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  )
}
