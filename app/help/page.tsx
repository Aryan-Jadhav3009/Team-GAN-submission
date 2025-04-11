import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Book, Video, Phone, MessageSquare } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions and learn how to use Health Companion
          </p>
        </div>

        {/* Quick Help Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Book className="mr-2 h-5 w-5 text-blue-500" />
                  User Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  Comprehensive guide to using all features of Health Companion
                </CardDescription>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">View Guide</Button>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Video className="mr-2 h-5 w-5 text-red-500" />
                  Tutorial Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  Watch step-by-step videos on how to use Health Companion
                </CardDescription>
                <Button className="w-full bg-red-500 hover:bg-red-600">Watch Videos</Button>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-green-500" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  Speak with our support team for personalized assistance
                </CardDescription>
                <Button className="w-full bg-green-500 hover:bg-green-600">Get Support</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <Card className="border border-gray-200">
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">
                    How do I set up medication reminders?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <p>To set up medication reminders:</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-2">
                      <li>Go to the Dashboard and click on the "Reminders" tab</li>
                      <li>Click the "Add Reminder" button</li>
                      <li>Enter the medication name, dosage, and schedule</li>
                      <li>Select your preferred notification method</li>
                      <li>Click "Save" to activate your reminder</li>
                    </ol>
                    <p className="mt-2">
                      You can set up multiple reminders for different medications and customize each one individually.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">
                    What should I do if I detect a fall alert?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <p>If you receive a fall alert:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Check on the person immediately if you are nearby</li>
                      <li>If it was a false alarm, you can cancel the alert by clicking the "Cancel Alert" button</li>
                      <li>If assistance is needed, emergency services will be automatically notified</li>
                      <li>You can use the "Call Emergency" button to directly connect with emergency services</li>
                    </ul>
                    <p className="mt-2">
                      The system is designed to automatically notify emergency contacts when a fall is detected, so
                      quick action can be taken.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">
                    How do I update my health information?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <p>To update your health information:</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-2">
                      <li>Go to the "Profile" page from the main navigation</li>
                      <li>Click on the "Medical Information" tab</li>
                      <li>
                        Update your health conditions, medications, allergies, and healthcare provider information
                      </li>
                      <li>Click "Save Changes" to update your information</li>
                    </ol>
                    <p className="mt-2">
                      It's important to keep your health information up-to-date so that caregivers and emergency
                      responders have accurate information.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">
                    How do I connect with my caregiver?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <p>To connect with your caregiver:</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-2">
                      <li>Go to the Dashboard and view the "Caregiver Updates" section</li>
                      <li>Click on "Contact Caregiver" to see all communication options</li>
                      <li>Choose to message, call, or video chat with your caregiver</li>
                    </ol>
                    <p className="mt-2">
                      You can also go to the "Caregiver Connections" page for more detailed options and to see your
                      entire care team.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">How do I make the text larger?</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <p>To increase the text size:</p>
                    <ol className="list-decimal pl-5 mt-2 space-y-2">
                      <li>Look for the "A+" button in the top navigation bar</li>
                      <li>Click it once to increase to medium size</li>
                      <li>Click it again to increase to large size</li>
                      <li>To decrease the size, click the "A-" button</li>
                    </ol>
                    <p className="mt-2">
                      These accessibility controls are available throughout the application to help you adjust the
                      display to your preferences.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        {/* Getting Started Guide */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started Guide</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mb-4">Welcome to Health Companion</h3>
              <p className="mb-4">
                Health Companion is designed to help you manage your health with ease. Here's how to get started:
              </p>

              <h4 className="text-lg font-medium mt-6 mb-3">Step 1: Set Up Your Profile</h4>
              <p className="mb-4">
                Complete your personal and medical information in the Profile section. This information helps us provide
                personalized care and is essential for emergency situations.
              </p>

              <h4 className="text-lg font-medium mt-6 mb-3">Step 2: Configure Your Reminders</h4>
              <p className="mb-4">
                Set up medication reminders and appointment alerts to help you stay on track with your health regimen.
              </p>

              <h4 className="text-lg font-medium mt-6 mb-3">Step 3: Connect with Caregivers</h4>
              <p className="mb-4">
                Add your caregivers and healthcare providers to your care team for better coordination and
                communication.
              </p>

              <h4 className="text-lg font-medium mt-6 mb-3">Step 4: Explore Health Monitoring</h4>
              <p className="mb-4">
                Familiarize yourself with the health metrics dashboard to track your vital signs and understand your
                health trends.
              </p>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-lg font-medium text-blue-800 mb-2">Need More Help?</h4>
                <p className="text-blue-700 mb-4">
                  Our support team is available 24/7 to assist you with any questions or concerns.
                </p>
                <div className="flex space-x-4">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Support
                  </Button>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
