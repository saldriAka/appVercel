import { redirect } from "next/navigation"

export default function Home() {
  // Redirect to the first exam page
  redirect("/exam/1")
}
