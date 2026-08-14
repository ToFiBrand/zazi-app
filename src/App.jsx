import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import AppShell from './components/AppShell'
import AuthShell from './components/AuthShell'
import DashboardShell from './components/DashboardShell'
import RequireAuth from './components/RequireAuth'

import SplashScreen from './screens/SplashScreen'
import OnboardingScreen from './screens/OnboardingScreen'
import AuthScreen from './screens/AuthScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import ResetPasswordScreen from './screens/ResetPasswordScreen'
import TermsScreen from './screens/TermsScreen'
import PrivacyScreen from './screens/PrivacyScreen'
import InterestsScreen from './screens/InterestsScreen'
import CreateAvatarScreen from './screens/CreateAvatarScreen'
import HomeScreen from './screens/HomeScreen'
import LearnScreen from './screens/LearnScreen'
import LessonDetailScreen from './screens/LessonDetailScreen'
import ExploreScreen from './screens/ExploreScreen'
import ContentViewScreen from './screens/ContentViewScreen'
import CareerHubScreen from './screens/CareerHubScreen'
import CreateContentScreen from './screens/CreateContentScreen'
import CreateSubmissionScreen from './screens/CreateSubmissionScreen'
import ChallengesScreen from './screens/ChallengesScreen'
import SearchScreen from './screens/SearchScreen'
import ProfileScreen from './screens/ProfileScreen'
import NotificationsScreen from './screens/NotificationsScreen'
import ContributorApplicationScreen from './screens/ContributorApplicationScreen'
import SaveProgressScreen from './screens/SaveProgressScreen'
import AdminDashboard from './screens/AdminDashboard'
import SponsorDashboard from './screens/SponsorDashboard'
import TeacherDashboard from './screens/TeacherDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Auth / onboarding — centered card on desktop, full-bleed on mobile */}
            <Route element={<AuthShell />}>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/welcome" element={<AuthScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
              <Route path="/reset-password" element={<ResetPasswordScreen />} />
              <Route path="/terms" element={<TermsScreen />} />
              <Route path="/privacy" element={<PrivacyScreen />} />
              <Route path="/interests" element={<InterestsScreen />} />
              <Route path="/create-avatar" element={<CreateAvatarScreen />} />
            </Route>

            {/* Student app — sidebar on desktop, bottom tab bar on mobile. Requires a session. */}
            <Route element={<RequireAuth />}>
              <Route element={<AppShell />}>
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/learn" element={<LearnScreen />} />
                <Route path="/learn/:lessonId" element={<LessonDetailScreen />} />
                <Route path="/career" element={<CareerHubScreen />} />
                <Route path="/create" element={<CreateContentScreen />} />
                <Route path="/create/:type" element={<CreateSubmissionScreen />} />
                <Route path="/challenges" element={<ChallengesScreen />} />
                <Route path="/search" element={<SearchScreen />} />
                <Route path="/explore" element={<ExploreScreen />} />
                <Route path="/explore/:contentId" element={<ContentViewScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/notifications" element={<NotificationsScreen />} />
                <Route path="/contributor-application" element={<ContributorApplicationScreen />} />
                <Route path="/save-progress" element={<SaveProgressScreen />} />
              </Route>

              {/* Role dashboards — desktop-first, own internal layout */}
              <Route element={<DashboardShell />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/sponsor" element={<SponsorDashboard />} />
                <Route path="/teacher" element={<TeacherDashboard />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
