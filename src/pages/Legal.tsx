import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, FileText, CreditCard, RefreshCcw } from 'lucide-react';

export default function Legal() {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold gradient-text mb-2">Legal & Policies</h1>
            <p className="text-muted-foreground">Our commitment to transparency and your rights</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="privacy" className="gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="terms" className="gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Terms</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="refunds" className="gap-2">
                <RefreshCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Refunds</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="privacy">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6 text-sm text-muted-foreground">
                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Last Updated: January 30, 2026</h3>
                        <p>
                          NStudio ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 3D modeling and animation platform.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Information We Collect</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Account information (email, username, profile data)</li>
                          <li>Payment information (processed securely via PayPal)</li>
                          <li>Usage data (features used, projects created)</li>
                          <li>Device information (browser type, operating system)</li>
                          <li>User-generated content (3D models, animations, uploads)</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">How We Use Your Information</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>To provide and maintain our services</li>
                          <li>To process transactions and send related information</li>
                          <li>To communicate with you about updates, offers, and support</li>
                          <li>To improve our platform and user experience</li>
                          <li>To comply with legal obligations</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Data Security</h3>
                        <p>
                          We implement industry-standard security measures including encryption, secure servers, and regular security audits. Your payment information is never stored on our servers - all transactions are processed through PayPal's secure infrastructure.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Your Rights</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Access your personal data</li>
                          <li>Request correction of inaccurate data</li>
                          <li>Request deletion of your data</li>
                          <li>Opt-out of marketing communications</li>
                          <li>Data portability</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Cookies</h3>
                        <p>
                          We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can manage cookie preferences through your browser settings.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Third-Party Services</h3>
                        <p>
                          We may use third-party services including PayPal for payments, analytics providers, and cloud storage services. These services have their own privacy policies governing data usage.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Contact Us</h3>
                        <p>
                          For privacy-related inquiries, contact us at privacy@nstudio.app
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Terms of Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6 text-sm text-muted-foreground">
                      <section>
                        <h3 className="text-foreground font-semibold mb-2">1. Acceptance of Terms</h3>
                        <p>
                          By accessing or using NStudio, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">2. Description of Service</h3>
                        <p>
                          NStudio provides a web-based 3D modeling, animation, and rendering platform. Features include but are not limited to: 3D asset creation, scene composition, animation tools, and cloud rendering.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">3. User Accounts</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>You must provide accurate and complete registration information</li>
                          <li>You are responsible for maintaining the security of your account</li>
                          <li>You must notify us immediately of any unauthorized access</li>
                          <li>One person may not maintain more than one account</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">4. User Content</h3>
                        <p>
                          You retain ownership of content you create. By uploading content, you grant NStudio a non-exclusive license to host, display, and distribute your content as necessary to provide our services.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">5. Prohibited Conduct</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Violating any applicable laws or regulations</li>
                          <li>Infringing on intellectual property rights</li>
                          <li>Uploading malicious content or code</li>
                          <li>Attempting to access other users' accounts</li>
                          <li>Circumventing security measures</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">6. Fan Service Submissions</h3>
                        <p>
                          When submitting models for store review, you certify that you own or have rights to the content. Accepted submissions may receive compensation as outlined in our Creator Program.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">7. Limitation of Liability</h3>
                        <p>
                          NStudio is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of our services.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Payment Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6 text-sm text-muted-foreground">
                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Accepted Payment Methods</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>PayPal accounts</li>
                          <li>Credit cards (Visa, Mastercard, American Express, Discover)</li>
                          <li>Debit cards with Visa/Mastercard logos</li>
                          <li>PayPal Credit (where available)</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Pricing</h3>
                        <p>
                          All prices are displayed in USD. Prices may vary by region and are subject to change. You will always see the final price before completing a purchase.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Subscriptions</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Club subscriptions are billed monthly</li>
                          <li>Subscriptions auto-renew unless cancelled</li>
                          <li>You can cancel anytime from your account settings</li>
                          <li>Cancellation takes effect at the end of your billing period</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Bonus Points</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Club members earn bonus points on purchases</li>
                          <li>Points can be redeemed for store discounts</li>
                          <li>Points have no cash value and cannot be transferred</li>
                          <li>Points expire 12 months after being earned</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Security</h3>
                        <p>
                          All payment processing is handled by PayPal. We never store your full card numbers or CVV codes. PayPal is PCI DSS Level 1 certified, the highest level of security certification.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="refunds">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="font-display flex items-center gap-2">
                    <RefreshCcw className="w-5 h-5 text-primary" />
                    Refund Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6 text-sm text-muted-foreground">
                      <section className="p-4 bg-success/10 rounded-lg border border-success/30">
                        <h3 className="text-success font-semibold mb-2 text-lg">14-Day Money-Back Guarantee</h3>
                        <p className="text-success/90">
                          We offer a full refund within 14 days of purchase, no questions asked. Your satisfaction is our priority.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Eligible for Refund</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>One-time asset purchases (within 14 days)</li>
                          <li>First subscription payment (within 14 days)</li>
                          <li>Accidental duplicate purchases</li>
                          <li>Technical issues preventing access</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Refund Process</h3>
                        <ol className="list-decimal pl-4 space-y-1">
                          <li>Contact support@nstudio.app with your order details</li>
                          <li>Include your PayPal transaction ID</li>
                          <li>Briefly describe the reason for refund</li>
                          <li>Refunds are processed within 3-5 business days</li>
                          <li>Refund appears in your account within 5-10 business days</li>
                        </ol>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Non-Refundable Items</h3>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>Purchases made more than 14 days ago</li>
                          <li>Bonus points already redeemed</li>
                          <li>Subscription renewals after the first month</li>
                          <li>Custom/commissioned work</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Subscription Cancellation</h3>
                        <p>
                          You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period. No partial refunds are given for unused subscription time after the 14-day guarantee period.
                        </p>
                      </section>

                      <section>
                        <h3 className="text-foreground font-semibold mb-2">Disputes</h3>
                        <p>
                          We encourage you to contact us before filing a PayPal dispute. We're committed to resolving issues quickly and fairly. Filing a dispute may delay resolution.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
