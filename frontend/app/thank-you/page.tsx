"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

export default function ThankYou() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
            Thank You!
          </CardTitle>
          <p className="text-lg text-gray-600">
            धन्यवाद! आपका पंजीकरण सफलतापूर्वक सबमिट हो गया है।
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-blue-900">Please wait 7 days</span>
            </div>
            <p className="text-blue-800">
              कृपया 7 दिन प्रतीक्षा करें। हम आपके आवेदन की समीक्षा करेंगे और जल्द ही संपर्क करेंगे।
            </p>
            <p className="text-sm text-blue-700 mt-2">
              (Please wait 7 days. We will review your application and contact you soon.)
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">What happens next?</h3>
            <div className="text-left space-y-2 text-gray-700">
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                <p>Our admin team will review your application within 7 days</p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                <p>You will receive an email notification about the approval status</p>
              </div>
              <div className="flex items-start">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                <p>Once approved, you can login to your agency dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="px-6"
            >
              Go to Home
            </Button>
            <Button
              onClick={() => router.push('/login')}
              className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Login (If Already Approved)
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            This page will automatically redirect to home in 10 seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
