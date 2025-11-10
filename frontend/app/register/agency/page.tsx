"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const legalStatuses = [
  "Private Limited Company",
  "Public Limited Company",
  "Partnership Firm",
  "Proprietorship",
  "LLP",
  "Society",
  "Trust",
  "Other"
]

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
]

const busTypes = [
  "AC Sleeper", "Non-AC Sleeper", "AC Seater", "Non-AC Seater",
  "Volvo AC", "Semi-Sleeper", "Double Decker", "Mini Bus"
]

const ticketingMethods = [
  "Manual Counter",
  "Online Portal",
  "Mobile App",
  "Third-party Software",
  "Mixed (Manual + Online)"
]

export default function AgencyRegistration() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [formData, setFormData] = useState({
    // Company Details
    name: "",
    code: "",
    legalStatus: "",
    yearOfEstablishment: "",
    companyRegistrationNumber: "",
    gstTaxId: "",
    headOfficeAddress: "",
    city: "",
    state: "",
    pincode: "",
    // Admin Details
    adminName: "",
    adminDesignation: "",
    adminEmail: "",
    adminPhone: "",
    alternatePhone: "",
    // Login Credentials
    username: "",
    password: "",
    confirmPassword: "",
    // Operations
    totalBuses: "",
    primaryBusTypes: [] as string[],
    keyOperatingRoutes: "",
    currentTicketingMethod: "",
    expectedGoLiveDate: undefined as Date | undefined,
    specificRequirements: ""
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBusTypeChange = (busType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      primaryBusTypes: checked
        ? [...prev.primaryBusTypes, busType]
        : prev.primaryBusTypes.filter(type => type !== busType)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      const requiredFields = [
        'name', 'legalStatus', 'yearOfEstablishment', 'headOfficeAddress',
        'city', 'state', 'pincode', 'adminName', 'adminDesignation',
        'adminEmail', 'adminPhone', 'username', 'password', 'totalBuses',
        'primaryBusTypes', 'keyOperatingRoutes', 'currentTicketingMethod'
      ]

      const missingFields = requiredFields.filter(field => {
        if (field === 'primaryBusTypes') return formData.primaryBusTypes.length === 0
        return !formData[field as keyof typeof formData]
      })

      if (missingFields.length > 0) {
        alert(`कृपया सभी आवश्यक फ़ील्ड भरें: ${missingFields.map(field => {
          const fieldLabels: { [key: string]: string } = {
            name: 'Agency/Company Name',
            legalStatus: 'Legal Status / Type',
            yearOfEstablishment: 'Year of Establishment',
            headOfficeAddress: 'Head Office Address',
            city: 'City / District',
            state: 'State / Province',
            pincode: 'Pincode / Zip Code',
            adminName: 'Full Name of Admin',
            adminDesignation: 'Designation / Role',
            adminEmail: 'Official Email ID',
            adminPhone: 'Mobile Number',
            username: 'Username',
            password: 'Password',
            totalBuses: 'Total Number of Buses',
            primaryBusTypes: 'Primary Bus Types',
            keyOperatingRoutes: 'Key Operating Routes',
            currentTicketingMethod: 'Current Ticketing Method'
          }
          return fieldLabels[field] || field
        }).join(', ')}`)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match")
        return
      }

      const submitData = {
        ...formData,
        expectedGoLiveDate: formData.expectedGoLiveDate ? format(formData.expectedGoLiveDate, 'yyyy-MM-dd') : undefined
      }

      const response = await fetch('/api/agencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/thank-you')
      } else {
        alert(data.error || 'Failed to submit registration')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Failed to submit registration. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Agency Registration</h1>
          <p className="text-lg text-gray-600">Join our bus ticketing network</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Company Details */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">भाग 1: कंपनी/एजेंसी का विवरण (Company/Agency Details)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Agency/Company Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="एजेंसी/कंपनी का नाम"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Agency Code (Optional)</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      placeholder="e.g., ABC"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="legalStatus">Legal Status / Type *</Label>
                    <Select value={formData.legalStatus} onValueChange={(value) => handleInputChange('legalStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="कानूनी स्थिति / प्रकार" />
                      </SelectTrigger>
                      <SelectContent>
                        {legalStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="yearOfEstablishment">Year of Establishment *</Label>
                    <Input
                      id="yearOfEstablishment"
                      type="number"
                      value={formData.yearOfEstablishment}
                      onChange={(e) => handleInputChange('yearOfEstablishment', e.target.value)}
                      placeholder="स्थापना का वर्ष"
                      min="1900"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyRegistrationNumber">Company Registration Number</Label>
                    <Input
                      id="companyRegistrationNumber"
                      value={formData.companyRegistrationNumber}
                      onChange={(e) => handleInputChange('companyRegistrationNumber', e.target.value)}
                      placeholder="कंपनी पंजीकरण संख्या (CIN/Udyam/Trade License)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gstTaxId">GST/Tax ID Number</Label>
                    <Input
                      id="gstTaxId"
                      value={formData.gstTaxId}
                      onChange={(e) => handleInputChange('gstTaxId', e.target.value)}
                      placeholder="जीएसटी/टैक्स ID नंबर"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="headOfficeAddress">Head Office Address *</Label>
                  <Textarea
                    id="headOfficeAddress"
                    value={formData.headOfficeAddress}
                    onChange={(e) => handleInputChange('headOfficeAddress', e.target.value)}
                    placeholder="मुख्यालय का पूरा पता"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City / District *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="शहर / ज़िला"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State / Province *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="राज्य / प्रांत" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode / Zip Code *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="पिनकोड / ज़िप कोड"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Details */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">भाग 2: मुख्य संपर्क/एडमिन की जानकारी (Key Contact / Admin Details)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminName">Full Name of Admin *</Label>
                    <Input
                      id="adminName"
                      value={formData.adminName}
                      onChange={(e) => handleInputChange('adminName', e.target.value)}
                      placeholder="एडमिन का पूरा नाम"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminDesignation">Designation / Role *</Label>
                    <Input
                      id="adminDesignation"
                      value={formData.adminDesignation}
                      onChange={(e) => handleInputChange('adminDesignation', e.target.value)}
                      placeholder="पदनाम / भूमिका (e.g., Owner, IT Head)"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminEmail">Official Email ID (for Login) *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      placeholder="आधिकारिक ईमेल ID (लॉगिन के लिए)"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="adminPhone">Mobile Number (with Country Code) *</Label>
                    <Input
                      id="adminPhone"
                      value={formData.adminPhone}
                      onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                      placeholder="मोबाइल नंबर (कंट्री कोड के साथ)"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="alternatePhone">Alternate Contact Number</Label>
                  <Input
                    id="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                    placeholder="वैकल्पिक संपर्क नंबर"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a strong password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Operations */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">भाग 3: ऑपरेशन और जरूरतें (Operations and Requirements)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalBuses">Total Number of Buses *</Label>
                    <Input
                      id="totalBuses"
                      type="number"
                      value={formData.totalBuses}
                      onChange={(e) => handleInputChange('totalBuses', e.target.value)}
                      placeholder="कुल बसों की संख्या"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentTicketingMethod">Current Ticketing Method *</Label>
                    <Select value={formData.currentTicketingMethod} onValueChange={(value) => handleInputChange('currentTicketingMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="वर्तमान टिकटिंग विधि" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketingMethods.map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Primary Bus Types *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {busTypes.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={formData.primaryBusTypes.includes(type)}
                          onCheckedChange={(checked) => handleBusTypeChange(type, checked as boolean)}
                        />
                        <Label htmlFor={type} className="text-sm">{type}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="keyOperatingRoutes">Key Operating Routes *</Label>
                  <Textarea
                    id="keyOperatingRoutes"
                    value={formData.keyOperatingRoutes}
                    onChange={(e) => handleInputChange('keyOperatingRoutes', e.target.value)}
                    placeholder="मुख्य ऑपरेशन रूट"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Expected Go-Live Date</Label>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.expectedGoLiveDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.expectedGoLiveDate ? format(formData.expectedGoLiveDate, "PPP") : "कब से सिस्टम शुरू करने की उम्मीद है?"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.expectedGoLiveDate}
                          onSelect={(date) => {
                            handleInputChange('expectedGoLiveDate', date)
                            setDateOpen(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <Label htmlFor="specificRequirements">Any Specific Requirements?</Label>
                  <Textarea
                    id="specificRequirements"
                    value={formData.specificRequirements}
                    onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
                    placeholder="कोई विशेष आवश्यकताएं हैं?"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
